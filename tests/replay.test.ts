import { describe, expect, test } from "bun:test";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { FORMATIONS } from "../src/lib/types.js";
import type { Squad } from "../src/lib/types.js";
import { simulateMatchScript } from "../src/lib/match/script.js";
import { registerUserResult } from "../src/lib/tournament/results.js";
import type { Tournament } from "../src/lib/tournament/types.js";

function userSquad(): Squad {
  const squad = HISTORICAL_SQUADS.find((s) => s.id === "bra-1970");
  if (!squad) throw new Error("Brazil 1970 missing");
  const players = squad.players.slice(0, 11);
  return {
    id: "user-squad",
    name: "Your team",
    nation: "MIX",
    wcYear: 2026,
    formation: FORMATIONS["4-3-3"],
    players,
    isHistorical: false,
  };
}

describe("match replay storage", () => {
  test("registering a result keeps the exact script for replay", () => {
    const user = userSquad();
    const opponent = HISTORICAL_SQUADS.find((s) => s.id === "esp-2010");
    if (!opponent) throw new Error("Spain 2010 missing");

    const script = simulateMatchScript(user, opponent, {
      regulationOnly: true,
    });
    const state = {
      id: "test-run",
      phase: "group",
      userSquad: user,
      squads: { [user.id]: user, [opponent.id]: opponent },
      group: [user.id, opponent.id],
      matches: [
        {
          id: "m1",
          round: "group",
          home: user.id,
          away: opponent.id,
          result: null,
          isUser: true,
        },
      ],
    } as Tournament;

    registerUserResult(state, "m1", script.result, script);
    expect(state.matches[0].result).not.toBeNull();
    expect(state.matches[0].script).toBe(script);
  });
});
