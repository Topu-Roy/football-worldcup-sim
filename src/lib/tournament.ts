import type { MatchResult, Squad } from './types.js';
import { HISTORICAL_SQUADS } from '../data/historical/index.js';
import { simulateMatch } from './matchEngine.js';

export type MatchRound = 'group' | 'sf' | 'final';

export interface TournamentMatch {
  id: string;
  round: MatchRound;
  group?: 'A' | 'B';
  home: string;
  away: string;
  result: MatchResult | null;
  isUser: boolean;
}

export interface GroupStanding {
  squadId: string;
  name: string;
  nation: string;
  wcYear: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export type TournamentOutcome = 'champion' | 'runners-up' | 'semi-final-exit' | 'eliminated';

export interface Tournament {
  phase: 'group' | 'knockout' | 'ended';
  userSquad: Squad;
  squads: Record<string, Squad>;
  groups: { A: string[]; B: string[] };
  matches: TournamentMatch[];
  outcome?: TournamentOutcome;
}

export interface UserMatchStat {
  id: string;
  roundLabel: string;
  opponentId: string;
  opponentName: string;
  opponentNation: string;
  opponentYear: number;
  result: MatchResult;
  outcome: 'W' | 'D' | 'L';
}

export interface AggregateStats {
  matches: UserMatchStat[];
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  cleanSheets: number;
  penaltyWins: number;
  biggestWin: number;
  biggestLoss: number;
  avgGoalsFor: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roundRobinPairs(teams: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push([teams[i], teams[j]]);
    }
  }
  return pairs;
}

function simResult(home: Squad, away: Squad, regulationOnly = false): MatchResult {
  return simulateMatch(home, away, { regulationOnly });
}

function standingsForGroup(matches: TournamentMatch[], teams: string[], squads: Record<string, Squad>): GroupStanding[] {
  const base: GroupStanding = {
    squadId: '',
    name: '',
    nation: '',
    wcYear: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  };
  const table = new Map<string, GroupStanding>();
  for (const id of teams) {
    const s = squads[id];
    table.set(id, { ...base, squadId: id, name: s.name, nation: s.nation, wcYear: s.wcYear });
  }

  const groupMatches = matches.filter((m) => m.round === 'group' && teams.includes(m.home) && teams.includes(m.away));
  for (const m of groupMatches) {
    if (!m.result) continue;
    const home = table.get(m.home)!;
    const away = table.get(m.away)!;
    const [hg, ag] = m.result.score;
    home.played++;
    away.played++;
    home.gf += hg;
    home.ga += ag;
    away.gf += ag;
    away.ga += hg;
    if (m.result.winner === 0) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (m.result.winner === 1) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }
  for (const s of table.values()) {
    s.gd = s.gf - s.ga;
  }

  return [...table.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });
}

export function createTournament(userSquad: Squad): Tournament {
  const pool = HISTORICAL_SQUADS.filter((s) => s.id !== userSquad.id);
  const drawn = shuffle(pool).slice(0, 7);

  const groupA = [userSquad.id, drawn[0].id, drawn[1].id, drawn[2].id];
  const groupB = [drawn[3].id, drawn[4].id, drawn[5].id, drawn[6].id];

  const squads: Record<string, Squad> = { [userSquad.id]: userSquad };
  for (const s of drawn) squads[s.id] = s;

  const matches: TournamentMatch[] = [];
  for (const [home, away] of roundRobinPairs(groupA)) {
    const isUser = home === userSquad.id;
    matches.push({
      id: `A-${home}-${away}`,
      round: 'group',
      group: 'A',
      home,
      away,
      result: isUser ? null : simResult(squads[home], squads[away], true),
      isUser,
    });
  }
  for (const [home, away] of roundRobinPairs(groupB)) {
    matches.push({
      id: `B-${home}-${away}`,
      round: 'group',
      group: 'B',
      home,
      away,
      result: simResult(squads[home], squads[away], true),
      isUser: false,
    });
  }

  return { phase: 'group', userSquad, squads, groups: { A: groupA, B: groupB }, matches };
}

export function registerUserResult(state: Tournament, matchId: string, result: MatchResult): void {
  const m = state.matches.find((x) => x.id === matchId);
  if (!m || m.result) return;
  m.result = normalizeResultForMatch(state, m, result);
}

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

export function groupDone(state: Tournament): boolean {
  return state.matches.filter((m) => m.round === 'group').every((m) => m.result !== null);
}

export function standingsFor(state: Tournament, group: 'A' | 'B'): GroupStanding[] {
  return standingsForGroup(state.matches, state.groups[group], state.squads);
}

export function userGroupStanding(state: Tournament): GroupStanding | null {
  const a = standingsFor(state, 'A');
  return a.find((s) => s.squadId === state.userSquad.id) ?? null;
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

export function nextUserMatch(state: Tournament): TournamentMatch | null {
  return state.matches.find((m) => m.isUser && m.round === 'group' && !m.result) ??
    state.matches.find((m) => m.isUser && m.round === 'sf' && !m.result) ??
    state.matches.find((m) => m.isUser && m.round === 'final' && !m.result) ??
    null;
}

export function matchTeams(state: Tournament, m: TournamentMatch): { home: Squad; away: Squad } {
  return { home: state.squads[m.home], away: state.squads[m.away] };
}

export function aggregateStats(state: Tournament): AggregateStats {
  const stats: AggregateStats = {
    matches: [],
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    points: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    cleanSheets: 0,
    penaltyWins: 0,
    biggestWin: 0,
    biggestLoss: 0,
    avgGoalsFor: 0,
  };

  const roundLabel = (r: MatchRound): string => (r === 'group' ? 'Group A' : r === 'sf' ? 'Semi-final' : 'Final');

  for (const m of state.matches.filter((x) => x.isUser && x.result)) {
    const opp = m.home === state.userSquad.id ? state.squads[m.away] : state.squads[m.home];
    const userHome = m.home === state.userSquad.id;
    const gf = userHome ? m.result!.score[0] : m.result!.score[1];
    const ga = userHome ? m.result!.score[1] : m.result!.score[0];
    const outcome: 'W' | 'D' | 'L' = m.result!.winner === null ? 'D' : m.result!.winner === (userHome ? 0 : 1) ? 'W' : 'L';

    stats.matches.push({
      id: m.id,
      roundLabel: roundLabel(m.round),
      opponentId: opp.id,
      opponentName: opp.name,
      opponentNation: opp.nation,
      opponentYear: opp.wcYear,
      result: m.result!,
      outcome,
    });

    stats.played++;
    stats.gf += gf;
    stats.ga += ga;
    if (outcome === 'W') {
      stats.won++;
      stats.points += 3;
      stats.biggestWin = Math.max(stats.biggestWin, gf - ga);
    } else if (outcome === 'D') {
      stats.drawn++;
      stats.points += 1;
    } else {
      stats.lost++;
      stats.biggestLoss = Math.max(stats.biggestLoss, ga - gf);
    }
    if (ga === 0) stats.cleanSheets++;
    if (m.result!.penalties && outcome === 'W') stats.penaltyWins++;
  }

  stats.gd = stats.gf - stats.ga;
  stats.avgGoalsFor = stats.played > 0 ? stats.gf / stats.played : 0;
  return stats;
}
