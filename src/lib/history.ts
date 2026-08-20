import type { Formation, Squad } from "./types.js";
import { aggregateStats } from "./tournament/aggregate.js";
import type { Tournament, TournamentOutcome } from "./tournament/types.js";

export type HistoryOutcome = "W" | "D" | "L";

export interface HistoryMatch {
  roundLabel: string;
  opponent: { id: string; name: string; nation: string; wcYear: number };
  score: [number, number];
  outcome: HistoryOutcome;
  penalties: boolean;
  extraTime: boolean;
}

export interface HistoryStats {
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
}

/** One saved tournament run: the team that played, its results, and its final outcome. */
export interface HistoryRecord {
  /** Tournament run id. */
  id: string;
  /** Timestamp of the run's last match (date the entry is grouped under). */
  playedAt: number;
  squadName: string;
  formation: Formation;
  /** Full user squad so the run's team can be re-shown. */
  squad: Squad;
  /** Final tournament outcome, or null while the run is still in progress. */
  outcome: TournamentOutcome | null;
  matches: HistoryMatch[];
  stats: HistoryStats;
}

const HISTORY_KEY = "wc:history:v2";
const MAX_RECORDS = 100;

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Storage unavailable: ignore silently.
  }
}

/** Save (or update) the current tournament as a dated history entry, keyed by its run id. */
export function upsertTournamentRecord(state: Tournament): void {
  const agg = aggregateStats(state);
  const record: HistoryRecord = {
    id: state.id,
    playedAt: Date.now(),
    squadName: state.userSquad.name,
    formation: state.userSquad.formation,
    squad: state.userSquad,
    outcome: state.outcome ?? null,
    matches: agg.matches.map((m) => ({
      roundLabel: m.roundLabel,
      opponent: {
        id: m.opponentId,
        name: m.opponentName,
        nation: m.opponentNation,
        wcYear: m.opponentYear,
      },
      score: [m.result.score[0], m.result.score[1]],
      outcome: m.outcome,
      penalties: m.result.penalties,
      extraTime: m.result.extraTime,
    })),
    stats: {
      played: agg.played,
      won: agg.won,
      drawn: agg.drawn,
      lost: agg.lost,
      points: agg.points,
      gf: agg.gf,
      ga: agg.ga,
      gd: agg.gd,
      cleanSheets: agg.cleanSheets,
      penaltyWins: agg.penaltyWins,
      biggestWin: agg.biggestWin,
      biggestLoss: agg.biggestLoss,
    },
  };
  const rest = loadHistory().filter((r) => r.id !== state.id);
  const next = [record, ...rest].slice(0, MAX_RECORDS);
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (quota, private mode): ignore silently.
  }
}