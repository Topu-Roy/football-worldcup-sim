import { simulateMatch } from "../matchEngine.js";
import type { MatchRound, Tournament, TournamentMatch } from "./types.js";
import { groupDone } from "./queries.js";
import { standingsFor } from "./standings.js";
import { drawStrong } from "./matchmaking.js";

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

  const strong = drawStrong(3);
  for (const s of strong) state.squads[s.id] = s;
  const [h1, h2, h3] = strong.map((s) => s.id);

  const sfPairs: [string, [string, string]][] = [
    ["sf-1", [state.userSquad.id, h1]],
    ["sf-2", [h2, h3]],
  ];
  const sfMatches: TournamentMatch[] = sfPairs.map(([id, [home, away]]) => {
    const isUser = home === state.userSquad.id || away === state.userSquad.id;
    return {
      id,
      round: "sf" as MatchRound,
      home,
      away,
      result: isUser ? null : simulateMatch(state.squads[home], state.squads[away]),
      isUser,
    };
  });

  state.matches.push(...sfMatches);
  state.phase = "knockout";
  resolveKnockout(state);
}

export function resolveKnockout(state: Tournament): void {
  if (state.phase !== "knockout") return;

  const sfs = state.matches.filter((m) => m.round === "sf");
  if (!sfs.every((m) => m.result !== null)) return;

  const sfWinners = sfs.map((m) => (m.result!.winner === 0 ? m.home : m.away));

  const existingFinal = state.matches.find((m) => m.round === "final");
  if (!existingFinal) {
    const [home, away] = sfWinners as [string, string];
    const isUser = home === state.userSquad.id || away === state.userSquad.id;
    state.matches.push({
      id: "final",
      round: "final",
      home,
      away,
      result: isUser ? null : simulateMatch(state.squads[home], state.squads[away]),
      isUser,
    });
  }

  const final = state.matches.find((m) => m.round === "final")!;
  if (!final.result) return;

  state.phase = "ended";
  if (final.isUser) {
    const userWon =
      final.result!.winner === (final.home === state.userSquad.id ? 0 : 1);
    state.outcome = userWon ? "champion" : "runners-up";
  } else {
    state.outcome = "semi-final-exit";
  }
}
