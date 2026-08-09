import { simulateMatch } from "../matchEngine.js";
import type { MatchRound, Tournament, TournamentMatch } from "./types.js";
import { groupDone } from "./queries.js";
import { standingsFor } from "./standings.js";
import { drawStrong } from "./matchmaking.js";

const KNOCKOUT_ROUNDS: MatchRound[] = ["r16", "qf", "sf", "final"];

function simulateFor(state: Tournament, home: string, away: string) {
  return simulateMatch(state.squads[home], state.squads[away]);
}

function winnersOf(matches: TournamentMatch[]): string[] {
  return matches.map((m) =>
    m.result!.winner === 0 ? m.home : m.away,
  );
}

function pairings(teams: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < teams.length; i += 2) {
    pairs.push([teams[i], teams[i + 1]]);
  }
  return pairs;
}

function hasRound(
  state: Tournament,
  round: MatchRound,
): boolean {
  return state.matches.some((m) => m.round === round);
}

function finishedRound(
  state: Tournament,
  round: MatchRound,
): boolean {
  const ms = state.matches.filter((m) => m.round === round);
  return ms.length > 0 && ms.every((m) => m.result !== null);
}

function createRound(
  state: Tournament,
  round: MatchRound,
  pairs: [string, string][],
): void {
  const existing = state.matches.some((m) => m.round === round);
  if (existing) return;
  pairs.forEach(([home, away], i) => {
    const isUser =
      home === state.userSquad.id || away === state.userSquad.id;
    state.matches.push({
      id: `${round}-${i + 1}`,
      round,
      home,
      away,
      result: isUser ? null : simulateFor(state, home, away),
      isUser,
    });
  });
}

function resolveRoundExit(round: MatchRound): Tournament["outcome"] {
  if (round === "r16") return "round-of-16-exit";
  if (round === "qf") return "quarter-final-exit";
  return "semi-final-exit";
}

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

  const strong = drawStrong(15);
  for (const s of strong) state.squads[s.id] = s;
  const teams = [
    state.userSquad.id,
    ...strong.map((s) => s.id),
  ];

  createRound(state, "r16", pairings(teams));
  state.phase = "knockout";
  resolveKnockout(state);
}

export function resolveKnockout(state: Tournament): void {
  if (state.phase !== "knockout") return;

  for (let r = 0; r < KNOCKOUT_ROUNDS.length; r++) {
    const round = KNOCKOUT_ROUNDS[r];
    if (!hasRound(state, round)) return;
    if (!finishedRound(state, round)) return;

    const roundMatches = state.matches.filter((m) => m.round === round);
    const userMatch = roundMatches.find((m) => m.isUser);

    if (round !== "final" && userMatch) {
      const userWon =
        userMatch.result!.winner ===
        (userMatch.home === state.userSquad.id ? 0 : 1);
      if (!userWon) {
        state.phase = "ended";
        state.outcome = resolveRoundExit(round);
        return;
      }
    }

    if (round === "final") {
      state.phase = "ended";
      const userWon =
        userMatch!.result!.winner ===
        (userMatch!.home === state.userSquad.id ? 0 : 1);
      state.outcome = userWon ? "champion" : "runners-up";
      return;
    }

    createRound(
      state,
      KNOCKOUT_ROUNDS[r + 1],
      pairings(winnersOf(roundMatches)),
    );
  }
}