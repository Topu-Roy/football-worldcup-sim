import type { MatchResult } from '../types.js';
import type { Tournament, TournamentMatch } from './types.js';

function normalizeResultForMatch(state: Tournament, m: TournamentMatch, result: MatchResult): MatchResult {
  if (m.away !== state.userSquad.id) return result;
  return {
    ...result,
    score: [result.score[1], result.score[0]],
    shots: [result.shots[1], result.shots[0]],
    shotsOnTarget: [result.shotsOnTarget[1], result.shotsOnTarget[0]],
    possession: [result.possession[1], result.possession[0]],
    winner: result.winner === null ? null : result.winner === 0 ? 1 : 0,
    events: result.events.map((ev) => ({ ...ev, teamIndex: ev.teamIndex === 0 ? 1 : 0 })),
  };
}

export function registerUserResult(state: Tournament, matchId: string, result: MatchResult): void {
  const m = state.matches.find((x) => x.id === matchId);
  if (!m || m.result) return;
  m.result = normalizeResultForMatch(state, m, result);
}
