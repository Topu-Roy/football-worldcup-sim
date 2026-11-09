import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { clearGame, loadGame, saveGame } from "../src/lib/gameSession.js";
import type { SavedGame } from "../src/lib/gameSession.js";

let originalWindow: unknown;

function installStorage() {
  const store = new Map<string, string>();
  (globalThis as { window?: unknown }).window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    },
  };
}

beforeEach(() => {
  originalWindow = (globalThis as { window?: unknown }).window;
  installStorage();
});

afterEach(() => {
  (globalThis as { window?: unknown }).window = originalWindow;
});

const game: SavedGame = {
  version: 1,
  formationKey: "4-3-3",
  formation: { GK: 1, DEF: 4, MID: 3, ATT: 3 },
  step: "draft",
  drafted: [],
  squad: null,
  tournament: null,
  draft: null,
};

describe("game session persistence", () => {
  test("saves and reloads an in-progress game", () => {
    saveGame(game);
    expect(loadGame()).toEqual(game);
  });

  test("clears the saved game", () => {
    saveGame(game);
    clearGame();
    expect(loadGame()).toBeNull();
  });

  test("rejects an invalid saved step", () => {
    saveGame({ ...game, step: "nonsense" as SavedGame["step"] });
    expect(loadGame()).toBeNull();
  });
});
