import type { Formation, Player, Squad } from "./types.js";
import type { Offer } from "./draft/offer.js";
import type { Tournament } from "./tournament/types.js";

export type GameStep = "draft" | "ready" | "tournament" | "results";

export interface SavedDraft {
  offer: Offer | null;
  offerHistory: Offer[];
  rerollsLeft: number;
  drafted: Player[];
}

export interface SavedGame {
  version: 1;
  formationKey: string;
  formation: Formation;
  step: GameStep;
  drafted: Player[];
  squad: Squad | null;
  tournament: Tournament | null;
  draft: SavedDraft | null;
}

const KEY = "wc:game:v1";

/** Load an in-progress game from localStorage, or null when absent/invalid. */
export function loadGame(): SavedGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedGame>;
    if (
      parsed.version !== 1 ||
      typeof parsed.formationKey !== "string" ||
      !parsed.formation ||
      !parsed.step
    ) {
      return null;
    }
    if (!["draft", "ready", "tournament", "results"].includes(parsed.step)) {
      return null;
    }
    if (!Array.isArray(parsed.drafted)) return null;
    if (parsed.step === "ready" && !parsed.squad) return null;
    if (
      (parsed.step === "tournament" || parsed.step === "results") &&
      !parsed.tournament
    ) {
      return null;
    }
    return parsed as SavedGame;
  } catch {
    return null;
  }
}

/** Persist the current game state. Storage failures are ignored. */
export function saveGame(game: SavedGame): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(game));
  } catch {
    // Quota or private mode: keep playing without persistence.
  }
}

/** Drop the in-progress game (history records are separate). */
export function clearGame(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: ignore.
  }
}
