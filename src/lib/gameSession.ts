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
  /** True once the same squad has been replayed after a loss. */
  hasRerun?: boolean;
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
    // Older saves may contain the removed twelfth pick at slot 11.
    const starters = (players: unknown): Player[] =>
      Array.isArray(players)
        ? (players as Player[]).filter((p) => p.assignedSlot !== 11)
        : [];
    const saved = parsed as SavedGame;
    return {
      ...saved,
      drafted: starters(saved.drafted),
      draft: saved.draft
        ? { ...saved.draft, drafted: starters(saved.draft.drafted) }
        : null,
    };
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
