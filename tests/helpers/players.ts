import { FORMATIONS, type Player, type Squad } from "../../src/lib/types.js";

export function makePlayer(
  id: string,
  nation: string,
  overrides: Partial<Player> = {},
): Player {
  return {
    id,
    name: id,
    nation,
    wcYear: 2022,
    positions: ["CM"],
    bestPosition: "CM",
    composure: 80,
    reflexes: 80,
    positioning: 80,
    distribution: 80,
    tackling: 80,
    aerial: 80,
    passing: 80,
    pace: 80,
    dribble: 80,
    workRate: 80,
    stamina: 80,
    finishing: 80,
    offBall: 80,
    ...overrides,
  };
}

export function elevenPlayers(): Player[] {
  return Array.from({ length: 11 }, (_, index) =>
    makePlayer(`p${index}`, "BRA"),
  );
}

export const baseSquad: Squad = {
  id: "base-squad",
  name: "Base",
  nation: "MIX",
  wcYear: 2026,
  formation: FORMATIONS["4-3-3"],
  players: elevenPlayers(),
  isHistorical: false,
};
