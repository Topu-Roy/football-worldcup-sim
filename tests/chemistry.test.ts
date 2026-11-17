import { describe, expect, test } from "bun:test";
import { buildUserSquad } from "../src/lib/draft/squad.js";
import { FORMATIONS } from "../src/lib/types.js";
import { chemistryBonus, playerBonus } from "../src/lib/team/chemistry.js";
import { isUserSquad } from "../src/lib/team/index.js";
import { applyTeamModifiers } from "../src/lib/team/strengths.js";
import { baseSquad, elevenPlayers, makePlayer } from "./helpers/players.js";

describe("user squad identity", () => {
  test("buildUserSquad marks the drafted XI as the user squad", () => {
    const squad = buildUserSquad(FORMATIONS["4-3-3"], elevenPlayers());
    expect(squad.isUser).toBe(true);
  });

  test("isUserSquad recognizes the new flag and the legacy id", () => {
    expect(isUserSquad({ ...baseSquad, id: "x", isUser: true })).toBe(true);
    expect(isUserSquad({ ...baseSquad, id: "user-squad" })).toBe(true);
    expect(isUserSquad({ ...baseSquad, id: "bra-1970" })).toBe(false);
  });
});

test("historical squads get a flat 10% chemistry", () => {
  const p = makePlayer("a", "BRA");
  expect(playerBonus(p, [p], true)).toBe(0.1);
  expect(chemistryBonus([p], true)).toBe(0.1);
});

test("user chemistry applies to all stats", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, false, true);
  expect(a.passing).toBeCloseTo(82.4);
  expect(a.tackling).toBeCloseTo(82.4);
  expect(a.pace).toBeCloseTo(82.4);
  expect(a.composure).toBeCloseTo(82.4);
});

test("historical chemistry stays on passing and offBall", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, true, false);
  expect(a.passing).toBeCloseTo(88);
  expect(a.offBall).toBeCloseTo(88);
  expect(a.tackling).toBe(80);
});

test("group-stage AI keeps two-stat chemistry", () => {
  const players = [makePlayer("a", "USA"), makePlayer("b", "USA")];
  const [a] = applyTeamModifiers(players, false, false);
  expect(a.passing).toBeCloseTo(82.4);
  expect(a.tackling).toBe(80);
});

test("historical squads ignore the all-stat flag", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, true, true);
  expect(a.passing).toBeCloseTo(88);
  expect(a.tackling).toBe(80);
});

test("out-of-position nerf applies after chemistry", () => {
  const players = [
    makePlayer("a", "BRA", {
      form: 5,
      positions: ["CB", "LB"],
      bestPosition: "CB",
      assignedPosition: "LB",
    }),
    makePlayer("b", "BRA"),
  ];
  const [a] = applyTeamModifiers(players, false, true);
  expect(a.tackling).toBeCloseTo((80 * 1.03 + 5) * 0.95);
  expect(a.finishing).toBeCloseTo(80 * 1.03 + 5);
});
