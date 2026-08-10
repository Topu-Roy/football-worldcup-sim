import type { Squad } from "../types.js";
import type { GroupStanding, Tournament, TournamentMatch } from "./types.js";
import { standingsFor } from "./standings.js";

/** True once every group match has a result. */
export function groupDone(state: Tournament): boolean {
  return state.matches
    .filter((m) => m.round === "group")
    .every((m) => m.result !== null);
}

/** The user's row in the current standings, or null. */
export function userGroupStanding(state: Tournament): GroupStanding | null {
  const table = standingsFor(state);
  return table.find((s) => s.squadId === state.userSquad.id) ?? null;
}

/** The first unplayed user match in order of round, or null if none remain. */
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

/** Resolve the two Squads playing a match. */
export function matchTeams(
  state: Tournament,
  m: TournamentMatch,
): { home: Squad; away: Squad } {
  return { home: state.squads[m.home], away: state.squads[m.away] };
}
