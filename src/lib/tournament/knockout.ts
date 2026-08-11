import type { MatchRound, Tournament } from "./types.js";
import { groupDone } from "./queries.js";
import { standingsFor } from "./standings.js";
import { drawStrong } from "./matchmaking.js";

const KNOCKOUT_ROUNDS: MatchRound[] = ["r16", "qf", "sf", "final"];

function resolveRoundExit(round: MatchRound): Tournament["outcome"] {
  if (round === "r16") return "round-of-16-exit";
  if (round === "qf") return "quarter-final-exit";
  return "semi-final-exit";
}

function createSingleMatch(state: Tournament, round: MatchRound): void {
  const usedNations = new Set<string>();
  for (const m of state.matches.filter((x) => x.isUser)) {
    const oppId = m.away === state.userSquad.id ? m.home : m.away;
    const opp = state.squads[oppId];
    if (opp) usedNations.add(opp.nation);
  }
  const opponent = drawStrong(1, [...usedNations])[0];
  state.squads[opponent.id] = opponent;
  state.matches.push({
    id: `${round}-1`,
    round,
    home: state.userSquad.id,
    away: opponent.id,
    result: null,
    isUser: true,
  });
}

/** Move to the knockout stage once the group is done: eliminate on failure to place top-2, else create the Round-of-16 match. */
export function advanceToKnockout(state: Tournament): void {
  if (state.phase !== "group" || !groupDone(state)) return;

  const table = standingsFor(state);
  const userQualified =
    table.findIndex((s) => s.squadId === state.userSquad.id) < 2;

  if (!userQualified) {
    state.phase = "ended";
    state.outcome = "eliminated";
    return;
  }

  state.phase = "knockout";
  createSingleMatch(state, "r16");
}

/** Resolve the current knockout round: end the tournament (champion/runners-up or exit) or schedule the next round. */
export function resolveKnockout(state: Tournament): void {
  if (state.phase !== "knockout") return;

  const pending = state.matches.find(
    (m) => m.isUser && m.round !== "group" && !m.result,
  );
  if (pending) return;

  const playedMatches = state.matches.filter(
    (m) => m.isUser && m.round !== "group" && m.result,
  );
  const played = playedMatches[playedMatches.length - 1];
  if (!played || !played.result) return;

  const userWon =
    played.result!.winner ===
    (played.home === state.userSquad.id ? 0 : 1);

  if (played.round === "final") {
    state.phase = "ended";
    state.outcome = userWon ? "champion" : "runners-up";
    return;
  }

  if (!userWon) {
    state.phase = "ended";
    state.outcome = resolveRoundExit(played.round);
    return;
  }

  const next = KNOCKOUT_ROUNDS[KNOCKOUT_ROUNDS.indexOf(played.round) + 1];
  createSingleMatch(state, next);
}