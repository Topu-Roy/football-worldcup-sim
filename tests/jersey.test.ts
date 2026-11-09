import { describe, expect, test } from "bun:test";
import { jerseyNumbersFor } from "../src/lib/jersey.js";
import type { Player } from "../src/lib/types.js";

function player(
  id: string,
  bestPosition: string,
  jerseyNumber?: number,
): Player {
  return {
    id,
    name: id,
    nation: "BRA",
    wcYear: 1970,
    positions: [bestPosition],
    bestPosition,
    composure: 80,
    ...(jerseyNumber ? { jerseyNumber } : {}),
  };
}

describe("jersey numbers", () => {
  test("explicit numbers win and fall back to conventional role numbers", () => {
    const players = [
      player("gk", "GK"),
      player("cb1", "CB"),
      player("cb2", "CB"),
      player("st", "ST", 10),
    ];
    const numbers = jerseyNumbersFor(players, "4-3-3");
    expect(numbers.get("gk")).toBe(1);
    expect(numbers.get("cb1")).toBe(4);
    expect(numbers.get("cb2")).toBe(5);
    expect(numbers.get("st")).toBe(10);
  });

  test("never assigns the same fallback number twice", () => {
    const players = [
      player("cb1", "CB"),
      player("cb2", "CB"),
      player("cb3", "CB"),
    ];
    const numbers = jerseyNumbersFor(players, "4-3-3");
    expect(new Set(numbers.values()).size).toBe(3);
  });
});
