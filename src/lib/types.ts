export type Position = "GK" | "DEF" | "MID" | "ATT";

export type Formation = {
  GK: number;
  DEF: number;
  MID: number;
  ATT: number;
};

export const FORMATIONS: Record<string, Formation> = {
  "4-3-3": { GK: 1, DEF: 4, MID: 3, ATT: 3 },
  "4-4-2": { GK: 1, DEF: 4, MID: 4, ATT: 2 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, ATT: 2 },
  "4-2-3-1": { GK: 1, DEF: 4, MID: 5, ATT: 1 },
};

export interface Player {
  id: string;
  name: string;
  nation: string;
  wcYear: number;
  position: Position;
  composure: number;
  form?: number;
  reflexes?: number;
  positioning?: number;
  distribution?: number;
  tackling?: number;
  aerial?: number;
  passing?: number;
  pace?: number;
  dribble?: number;
  workRate?: number;
  stamina?: number;
  finishing?: number;
  offBall?: number;
}

export interface Squad {
  id: string;
  name: string;
  nation: string;
  wcYear: number;
  formation: Formation;
  players: Player[];
  isHistorical: boolean;
}

export interface DepartmentComposure {
  GK: number;
  DEF: number;
  MID: number;
  ATT: number;
}

export interface TeamStrengths {
  attack: number;
  defense: number;
  creativity: number;
  finishing: number;
  defPassing: number;
  gk: number;
  composure: DepartmentComposure;
  avgStamina: number;
}

export interface MatchEvent {
  minute: number;
  teamIndex: 0 | 1;
  type: "goal";
  scorerId?: string;
  scorerName?: string;
}

export interface MatchResult {
  score: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  possession: [number, number];
  extraTime: boolean;
  penalties: boolean;
  penaltyScore?: [number, number];
  events: MatchEvent[];
  winner: 0 | 1 | null;
}

export interface SegmentSnapshot {
  minute: number;
  isET: boolean;
  score: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  possession: [number, number];
  events: MatchEvent[];
}

export interface PenaltyKick {
  team: 0 | 1;
  round: number;
  takerId: string;
  takerName: string;
  scored: boolean;
}

export interface MatchScript {
  regulation: SegmentSnapshot[];
  extraTime?: SegmentSnapshot[];
  penalties?: PenaltyKick[];
  result: MatchResult;
}
