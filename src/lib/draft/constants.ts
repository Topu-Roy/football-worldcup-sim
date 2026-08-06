import type { Position } from '../types.js';

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
