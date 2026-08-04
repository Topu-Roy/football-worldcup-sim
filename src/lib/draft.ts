import type { Formation, Player, Position, Squad } from './types.js';
import { FORMATIONS } from './types.js';
import { HISTORICAL_SQUADS } from '../data/historical/index.js';
import { pick } from './random.js';

export const NATION_NAMES: Record<string, string> = {
  BRA: 'Brazil',
  ITA: 'Italy',
  FRG: 'West Germany',
  GER: 'Germany',
  URU: 'Uruguay',
  NED: 'Netherlands',
  POL: 'Poland',
  ARG: 'Argentina',
  FRA: 'France',
  BEL: 'Belgium',
  ENG: 'England',
  SWE: 'Sweden',
  BUL: 'Bulgaria',
  CRO: 'Croatia',
  TUR: 'Turkey',
  KOR: 'South Korea',
  ESP: 'Spain',
  POR: 'Portugal',
  MAR: 'Morocco',
};

export const POSITION_LABEL: Record<Position, string> = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  ATT: 'Attacker',
};

export const MAX_REROLLS = 3;
export const DRAFT_ROUNDS = 11;
export const OFFER_SIZE = 5;

const pool: Player[] = HISTORICAL_SQUADS.flatMap((s) => s.players);

function nationYears(nation: string): number[] {
  return [...new Set(pool.filter((p) => p.nation === nation).map((p) => p.wcYear))].sort();
}

export function draftableNations(): string[] {
  return [...new Set(pool.map((p) => p.nation))];
}

export function formationOptions(): { key: string; formation: Formation }[] {
  return Object.entries(FORMATIONS).map(([key, formation]) => ({ key, formation }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function slotsLeft(formation: Formation, drafted: Player[]): Record<Position, number> {
  const left: Record<Position, number> = {
    GK: formation.GK,
    DEF: formation.DEF,
    MID: formation.MID,
    ATT: formation.ATT,
  };
  for (const p of drafted) left[p.position] -= 1;
  return left;
}

function candidateCount(left: Record<Position, number>): number {
  return left.GK + left.DEF + left.MID + left.ATT;
}

function fits(p: Player, left: Record<Position, number>): boolean {
  return left[p.position] > 0;
}

function eligibleForYear(nation: string, year: number, left: Record<Position, number>): Player[] {
  return pool
    .filter((p) => p.nation === nation && p.wcYear === year && fits(p, left))
    .slice(0, 11);
}

export interface Offer {
  nation: string;
  year: number;
  players: Player[];
}

export function makeOffer(formation: Formation, drafted: Player[], history: Offer[] = []): Offer {
  const left = slotsLeft(formation, drafted);
  const count = candidateCount(left);
  const usedCombos = new Set(history.map((o) => `${o.nation}-${o.year}`));
  const candidates: { nation: string; year: number; players: Player[] }[] = [];

  for (const nation of draftableNations()) {
    for (const year of nationYears(nation)) {
      if (usedCombos.has(`${nation}-${year}`)) continue;
      const players = eligibleForYear(nation, year, left);
      if (players.length > 0) candidates.push({ nation, year, players });
    }
  }

  if (candidates.length === 0) {
    // fall back: allow re-using nations/combos so draft can never stall
    for (const nation of draftableNations()) {
      for (const year of nationYears(nation)) {
        const players = eligibleForYear(nation, year, left);
        if (players.length > 0) candidates.push({ nation, year, players });
      }
    }
  }

  const chosen = pick(candidates);
  const keep = Math.min(count, OFFER_SIZE);
  const players = shuffle(chosen.players).slice(0, keep);
  return { nation: chosen.nation, year: chosen.year, players };
}

export function rerollOffer(
  formation: Formation,
  drafted: Player[],
  history: Offer[],
): Offer {
  return makeOffer(formation, drafted, history);
}

export function validateDraft(formation: Formation, drafted: Player[]): boolean {
  if (drafted.length !== DRAFT_ROUNDS) return false;
  const left = slotsLeft(formation, drafted);
  return candidateCount(left) === 0;
}

export function buildUserSquad(formation: Formation, drafted: Player[]): Squad {
  return {
    id: 'user-squad',
    name: 'Your XI',
    nation: 'MIX',
    wcYear: 2026,
    formation,
    players: drafted,
    isHistorical: false,
  };
}

export function positionColor(position: Position): string {
  switch (position) {
    case 'GK':
      return '#3cffd0';
    case 'DEF':
      return '#5200ff';
    case 'MID':
      return '#ffd23c';
    case 'ATT':
      return '#ff3c9e';
  }
}
