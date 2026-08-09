import type { MatchResult, Squad } from "../types.js";

export type MatchRound = "group" | "sf" | "final";

export interface TournamentMatch {
  id: string;
  round: MatchRound;
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

export type TournamentOutcome =
  "champion" | "runners-up" | "semi-final-exit" | "eliminated";

export interface Tournament {
  phase: "group" | "knockout" | "ended";
  userSquad: Squad;
  squads: Record<string, Squad>;
  group: string[];
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
  outcome: "W" | "D" | "L";
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
