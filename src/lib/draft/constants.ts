import type { Player, Position } from "../types.js";

export const NATION_NAMES: Record<string, string> = {
  BRA: "Brazil",
  ITA: "Italy",
  FRG: "West Germany",
  GER: "Germany",
  URU: "Uruguay",
  NED: "Netherlands",
  POL: "Poland",
  ARG: "Argentina",
  FRA: "France",
  BEL: "Belgium",
  ENG: "England",
  SWE: "Sweden",
  BUL: "Bulgaria",
  CRO: "Croatia",
  TUR: "Turkey",
  KOR: "South Korea",
  ESP: "Spain",
  POR: "Portugal",
  MAR: "Morocco",
  JPN: "Japan",
  DEN: "Denmark",
  CMR: "Cameroon",
  NGA: "Nigeria",
  COL: "Colombia",
  CRC: "Costa Rica",
  NOR: "Norway",
};

/** URL slug for each nation code, used for squad page routes. */
export const NATION_SLUGS: Record<string, string> = {
  BRA: "brazil",
  ITA: "italy",
  FRG: "west-germany",
  GER: "germany",
  URU: "uruguay",
  NED: "netherlands",
  POL: "poland",
  ARG: "argentina",
  FRA: "france",
  BEL: "belgium",
  ENG: "england",
  SWE: "sweden",
  BUL: "bulgaria",
  CRO: "croatia",
  TUR: "turkey",
  KOR: "south-korea",
  ESP: "spain",
  POR: "portugal",
  MAR: "morocco",
  JPN: "japan",
  DEN: "denmark",
  CMR: "cameroon",
  NGA: "nigeria",
  COL: "colombia",
  CRC: "costa-rica",
  NOR: "norway",
};

export const POSITION_LABEL: Record<Position, string> = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  ATT: "Attacker",
};

export const MAX_REROLLS = 3;
export const DRAFT_ROUNDS = 11;

/**
 * The stats surfaced per department. Shared by the draft offer card and the
 * squad list so the same player shows the same labels everywhere.
 */
export const DEPT_STAT_KEYS: Record<Position, (keyof Player)[]> = {
  GK: ["reflexes", "positioning", "distribution"],
  DEF: ["tackling", "aerial", "passing", "pace"],
  MID: ["passing", "dribble", "workRate", "stamina"],
  ATT: ["finishing", "dribble", "pace", "offBall"],
};

/** Human-readable labels for player stat keys. */
export const STAT_LABELS: Record<string, string> = {
  reflexes: "Reflexes",
  positioning: "Positioning",
  distribution: "Distribution",
  tackling: "Tackling",
  aerial: "Aerial",
  passing: "Passing",
  pace: "Pace",
  dribble: "Dribble",
  workRate: "Work Rate",
  stamina: "Stamina",
  finishing: "Finishing",
  offBall: "Off Ball",
};
