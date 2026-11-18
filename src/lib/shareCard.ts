import type { Position } from "./types.js";
import type {
  AggregateStats,
  Tournament,
  TournamentOutcome,
} from "./tournament/types.js";
import { assignSlots } from "./draft/pitch.js";
import { playerRating } from "./draft/rating.js";
import { departmentOf } from "./draft/roles.js";
import { jerseyNumbersFor } from "./jersey.js";
import { shortName } from "./shortName.js";

/** Accent colors used by the share card, matching the design tokens. */
const CHAMPION_ACCENT = "#3cffd0";
const EXIT_ACCENT = "#ff3c9e";

const DEPARTMENT_COLORS: Record<Position, string> = {
  GK: "#3cffd0",
  DEF: "#3c9dff",
  MID: "#ffd23c",
  ATT: "#ff8a3c",
};

export interface ShareCardPlayer {
  id: string;
  /** Compact name used by the roster column. */
  name: string;
  /** Full name; the pitch derives a shorter surname label from it. */
  fullName: string;
  role: string;
  number: number;
  /** Role-weighted overall rating, 0-99. */
  rating: number;
  /** Slot position as a percentage of the pitch box. */
  x: number;
  y: number;
  color: string;
}

export interface ShareCardStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  cleanSheets: number;
  penaltyWins: number;
}

export interface ShareCardData {
  outcomeTitle: string;
  outcomeSlug: string;
  outcomeAccent: string;
  /** Short caption under the placement, e.g. "7 matches · lifted the trophy". */
  outcomeNote: string;
  formationKey: string;
  /** Average XI rating, the headline number on the card. */
  teamRating: number;
  /** Scoreline of the highest-margin win, ordered from the user's side. */
  biggestWinScore: string | null;
  avgGoalsFor: number;
  players: ShareCardPlayer[];
  stats: ShareCardStats;
}

/** Headline placement text for a finished tournament. */
export function outcomeTitle(outcome: TournamentOutcome | undefined): string {
  if (outcome === "champion") return "CHAMPION";
  if (outcome === "runners-up") return "RUNNERS-UP";
  if (outcome === "semi-final-exit") return "SEMI-FINAL EXIT";
  if (outcome === "quarter-final-exit") return "QUARTER-FINAL EXIT";
  if (outcome === "round-of-16-exit") return "ROUND OF 16 EXIT";
  return "ELIMINATED IN GROUP STAGE";
}

/** Stable slug used in shared filenames. */
export function outcomeSlug(outcome: TournamentOutcome | undefined): string {
  if (outcome === "champion") return "champion";
  if (outcome === "runners-up") return "runners-up";
  if (outcome === "semi-final-exit") return "semi-final-exit";
  if (outcome === "quarter-final-exit") return "quarter-final-exit";
  if (outcome === "round-of-16-exit") return "round-of-16-exit";
  return "group-stage-exit";
}

/** Champion gets mint; every exit gets pink. */
export function outcomeAccent(outcome: TournamentOutcome | undefined): string {
  return outcome === "champion" ? CHAMPION_ACCENT : EXIT_ACCENT;
}

/** Short caption under the result, e.g. "7 matches · lifted the trophy". */
export function outcomeNote(
  outcome: TournamentOutcome | undefined,
  played: number,
): string {
  const matches = `${played} match${played === 1 ? "" : "es"}`;
  if (outcome === "champion") return `${matches} · lifted the trophy`;
  if (outcome === "runners-up") return `${matches} · lost the final`;
  if (outcome === "semi-final-exit") return `${matches} · lost the semi-final`;
  if (outcome === "quarter-final-exit")
    return `${matches} · lost the quarter-final`;
  if (outcome === "round-of-16-exit")
    return `${matches} · lost in the round of 16`;
  return `${matches} · out before the knockouts`;
}

/** Highest-margin win, with the score ordered from the user's side. */
function findBiggestWinScore(
  tournament: Tournament,
  stats: AggregateStats,
): string | null {
  let best: { margin: number; score: string } | null = null;

  for (const match of stats.matches) {
    if (match.outcome !== "W") continue;
    const source = tournament.matches.find((item) => item.id === match.id);
    const userHome = source ? source.home === tournament.userSquad.id : true;
    const [home, away] = match.result.score;
    const gf = userHome ? home : away;
    const ga = userHome ? away : home;
    const margin = gf - ga;

    if (!best || margin > best.margin) {
      best = { margin, score: `${gf}-${ga}` };
    }
  }

  return best?.score ?? null;
}

/** Build the data the canvas renderer needs from the finished tournament. */
export function buildShareCardData(
  tournament: Tournament,
  formationKey: string,
  stats: AggregateStats,
): ShareCardData {
  const squad = tournament.userSquad;
  const slots = assignSlots(squad.players, formationKey);
  const numbers = jerseyNumbersFor(squad.players, formationKey);

  const players: ShareCardPlayer[] = [];
  for (const { player, slot } of slots) {
    if (!player) continue;
    players.push({
      id: player.id,
      name: shortName(player.name, 14),
      fullName: player.name,
      role: slot.role,
      number: numbers.get(player.id) ?? 0,
      rating: Math.round(playerRating(player)),
      x: slot.x,
      y: slot.y,
      color: DEPARTMENT_COLORS[departmentOf(slot.role)],
    });
  }

  const teamRating = players.length
    ? Math.round(
        players.reduce((sum, player) => sum + player.rating, 0) /
          players.length,
      )
    : 0;

  return {
    outcomeTitle: outcomeTitle(tournament.outcome),
    outcomeSlug: outcomeSlug(tournament.outcome),
    outcomeAccent: outcomeAccent(tournament.outcome),
    outcomeNote: outcomeNote(tournament.outcome, stats.played),
    formationKey,
    teamRating,
    biggestWinScore: findBiggestWinScore(tournament, stats),
    avgGoalsFor: stats.avgGoalsFor,
    players,
    stats: {
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      gf: stats.gf,
      ga: stats.ga,
      cleanSheets: stats.cleanSheets,
      penaltyWins: stats.penaltyWins,
    },
  };
}

/** Compact surname-biased player label drawn under the pitch marker. */
export function pitchLabel(name: string): string {
  return shortName(name, 9);
}

/** Share-sheet title. */
export function shareTitle(data: ShareCardData): string {
  return `My World Cup XI · ${data.outcomeTitle}`;
}

/** Share-sheet body copy. */
export function shareText(data: ShareCardData): string {
  const result: Record<string, string> = {
    champion: "My XI won the World Cup.",
    "runners-up": "My XI finished as runners-up.",
    "semi-final-exit": "My XI reached the semi-finals.",
    "quarter-final-exit": "My XI reached the quarter-finals.",
    "round-of-16-exit": "My XI reached the round of 16.",
    "group-stage-exit": "My XI went out in the group stage.",
  };
  return `${result[data.outcomeSlug] ?? "My XI finished the run."} Draft yours at myworldcupxi.com.`;
}

/** Download filename, dated so repeat shares do not overwrite each other. */
export function shareFilename(
  data: ShareCardData,
  date: Date = new Date(),
): string {
  const day = date.toISOString().slice(0, 10);
  return `my-world-cup-xi-${data.outcomeSlug}-${day}.png`;
}

/**
 * Shrink a single line of text until it fits `maxWidth`.
 *
 * `measure` receives the candidate size so callers can reuse the active canvas
 * font. The loop steps by 2px to keep resize work small.
 */
export function fitFontSize(
  text: string,
  maxWidth: number,
  startingSize: number,
  measure: (text: string, size: number) => number,
  minSize = 24,
): number {
  let size = startingSize;
  while (size > minSize && measure(text, size) > maxWidth) {
    size -= 2;
  }
  return size;
}

/** Trim a line to `maxWidth`, appending an ellipsis when it does not fit. */
export function truncateToWidth(
  text: string,
  maxWidth: number,
  measure: (text: string) => number,
): string {
  if (measure(text) <= maxWidth) return text;

  const ellipsis = "…";
  let shortened = text;
  while (shortened.length > 0 && measure(shortened + ellipsis) > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return shortened ? `${shortened.trimEnd()}${ellipsis}` : ellipsis;
}
