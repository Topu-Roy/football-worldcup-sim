import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { clearGame, loadGame, saveGame } from "../src/lib/gameSession.js";
import type { SavedGame } from "../src/lib/gameSession.js";
import type { Player } from "../src/lib/types.js";

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

  test("preserves the one-rerun flag", () => {
    saveGame({ ...game, hasRerun: true });
    expect(loadGame()?.hasRerun).toBe(true);
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

  test("drops the old twelfth bench pick when loading", () => {
    const oldPlayers = Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      name: `P${i}`,
      nation: "BRA",
      wcYear: 1970,
      positions: ["ST"],
      bestPosition: "ST",
      composure: 80,
      assignedSlot: i,
    })) as Player[];
    saveGame({
      ...game,
      drafted: oldPlayers,
      draft: {
        offer: null,
        offerHistory: [],
        rerollsLeft: 3,
        drafted: oldPlayers,
      },
    });
    const loaded = loadGame();
    expect(loaded?.drafted).toHaveLength(11);
    expect(loaded?.draft?.drafted).toHaveLength(11);
  });
});
