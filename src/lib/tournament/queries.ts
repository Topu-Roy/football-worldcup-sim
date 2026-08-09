import type { Squad } from "../types.js";
import type { GroupStanding, Tournament, TournamentMatch } from "./types.js";
import { standingsFor } from "./standings.js";

export function groupDone(state: Tournament): boolean {
  return state.matches
    .filter((m) => m.round === "group")
    .every((m) => m.result !== null);
}

export function userGroupStanding(state: Tournament): GroupStanding | null {
  const table = standingsFor(state);
  return table.find((s) => s.squadId === state.userSquad.id) ?? null;
}

export function nextUserMatch(state: Tournament): TournamentMatch | null {
  const pending = (round: string) =>
    state.matches.find(
      (m) => m.isUser && m.round === round && !m.result,
    );
  return (
    pending("group") ??
    pending("r16") ??
    pending("qf") ??
    pending("sf") ??
    pending("final") ??
    null
  );
}

export function matchTeams(
  state: Tournament,
  m: TournamentMatch,
): { home: Squad; away: Squad } {
  return { home: state.squads[m.home], away: state.squads[m.away] };
}
