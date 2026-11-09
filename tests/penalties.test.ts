import { describe, expect, test } from "bun:test";
import { simPenalties } from "../src/lib/match/penalties.js";
import type { Player } from "../src/lib/types.js";

function takers(count = 5): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `t${i}`,
    name: `Taker ${i}`,
    nation: "BRA",
    wcYear: 1970,
    positions: ["ST"],
    bestPosition: "ST",
    composure: 99,
    finishing: 99,
  }));
}

function withRandom<T>(values: number[], fn: () => T): T {
  const original = Math.random;
  let index = 0;
  Math.random = () => values[Math.min(index++, values.length - 1)];
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

describe("penalty shootout", () => {
  test("stops as soon as the first five rounds are decided", () => {
    const sequence = Array.from({ length: 20 }, (_, i) =>
      i % 2 === 0 ? 0 : 0.99,
    );
    const result = withRandom(sequence, () =>
      simPenalties(takers(), takers(), 50, 50, 20, 1.1),
    );
    expect(result.score).toEqual([3, 0]);
    expect(result.kicks).toHaveLength(6);
  });

  test("goes to sudden death after a tied five kicks", () => {
    const sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.99];
    const result = withRandom(sequence, () =>
      simPenalties(takers(), takers(), 50, 50, 20, 1.1),
    );
    expect(result.score).toEqual([6, 5]);
    expect(result.kicks).toHaveLength(12);
    expect(result.kicks[result.kicks.length - 1].round).toBe(6);
  });
});
