import { describe, expect, test } from "bun:test";
import { simulateMatch } from "../src/lib/matchEngine.js";
import { makeSquad } from "../scripts/fixtures.js";

describe("calibration sanity", () => {
  test("balanced simulation stays in a plausible football range", () => {
    const a = makeSquad("A", 72, false);
    const b = makeSquad("B", 72, false);
    const n = 250;
    let goals = 0;
    let shots = 0;
    let onTarget = 0;

    for (let i = 0; i < n; i++) {
      const result = simulateMatch(a, b);
      goals += result.score[0] + result.score[1];
      shots += result.shots[0] + result.shots[1];
      onTarget += result.shotsOnTarget[0] + result.shotsOnTarget[1];
    }

    const avgGoals = goals / n;
    const avgShots = shots / n;
    const conversion = goals / Math.max(onTarget, 1);

    expect(avgGoals).toBeGreaterThan(1.5);
    expect(avgGoals).toBeLessThan(3.5);
    expect(avgShots).toBeGreaterThan(10);
    expect(avgShots).toBeLessThan(40);
    expect(conversion).toBeGreaterThan(0.15);
    expect(conversion).toBeLessThan(0.45);
  });
});
