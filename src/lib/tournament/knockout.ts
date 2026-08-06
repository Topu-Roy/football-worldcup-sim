import type { MatchResult, Squad } from '../types.js';
import { simulateMatch } from '../matchEngine.js';
import type { MatchRound, Tournament, TournamentMatch } from './types.js';
import { groupDone } from './queries.js';
import { standingsFor } from './standings.js';

function simResult(home: Squad, away: Squad): MatchResult {
  return simulateMatch(home, away);
}

export function advanceToKnockout(state: Tournament): void {
  if (state.phase !== 'group' || !groupDone(state)) return;

  const a = standingsFor(state, 'A');
  const b = standingsFor(state, 'B');
  const userQualified = a.findIndex((s) => s.squadId === state.userSquad.id) < 2;

  if (!userQualified) {
    state.phase = 'ended';
    state.outcome = 'eliminated';
    return;
  }

  const a1 = a[0].squadId;
  const a2 = a[1].squadId;
  const b1 = b[0].squadId;
  const b2 = b[1].squadId;

  const sfPairs: [string, [string, string]][] = [
    ['sf-1', [a1, b2]],
    ['sf-2', [b1, a2]],
  ];
  const sfMatches: TournamentMatch[] = sfPairs.map(([id, [h, away]]) => {
    const isUser = h === state.userSquad.id || away === state.userSquad.id;
    return {
      id,
      round: 'sf' as MatchRound,
      home: h,
      away,
      result: isUser ? null : simResult(state.squads[h], state.squads[away]),
      isUser,
    };
  });

  state.matches.push(...sfMatches);
  state.phase = 'knockout';
  resolveKnockout(state);
}

export function resolveKnockout(state: Tournament): void {
  if (state.phase !== 'knockout') return;

  const sfs = state.matches.filter((m) => m.round === 'sf');
  if (!sfs.every((m) => m.result !== null)) return;

  const sfWinners = sfs.map((m) => (m.result!.winner === 0 ? m.home : m.away));

  const existingFinal = state.matches.find((m) => m.round === 'final');
  if (!existingFinal) {
    const [h, away] = sfWinners as [string, string];
    const isUser = h === state.userSquad.id || away === state.userSquad.id;
    state.matches.push({
      id: 'final',
      round: 'final',
      home: h,
      away,
      result: isUser ? null : simResult(state.squads[h], state.squads[away]),
      isUser,
    });
  }

  const final = state.matches.find((m) => m.round === 'final')!;
  if (!final.result) return;

  state.phase = 'ended';
  if (final.isUser) {
    const userWon = final.result!.winner === (final.home === state.userSquad.id ? 0 : 1);
    state.outcome = userWon ? 'champion' : 'runners-up';
  } else {
    state.outcome = 'semi-final-exit';
  }
}
