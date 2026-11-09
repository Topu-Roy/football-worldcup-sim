import type { MatchResult, MatchScript, Squad } from "../types.js";

export type MatchRound = "group" | "r16" | "qf" | "sf" | "final";

export interface TournamentMatch {
  id: string;
  round: MatchRound;
  home: string;
  away: string;
  result: MatchResult | null;
  /** Exact simulation script for the user's matches, used for replay. */
  script?: MatchScript | null;
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
  | "champion"
  | "runners-up"
  | "semi-final-exit"
  | "quarter-final-exit"
  | "round-of-16-exit"
  | "eliminated";

export interface Tournament {
  /** Unique id for this run (groups its matches together in match history). */
  id: string;
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
