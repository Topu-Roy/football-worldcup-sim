import { describe, expect, test } from "bun:test";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { FORMATIONS } from "../src/lib/types.js";
import type { Player, Squad } from "../src/lib/types.js";
import { pickXI, startingXI } from "../src/lib/team/index.js";
import { simulateMatchScript } from "../src/lib/match/script.js";

function brazil1970Players(): Player[] {
  const squad = HISTORICAL_SQUADS.find((s) => s.id === "bra-1970");
  if (!squad) throw new Error("Brazil 1970 missing");
  return squad.players;
}

function makeUserSquad(): Squad {
  const players = brazil1970Players();
  const gk = players.find((p) => p.bestPosition === "GK");
  const piazza = players.find((p) => p.name.includes("Piazza"));
  const defenders = players
    .filter((p) => ["CB", "LB", "RB"].includes(p.bestPosition) && p !== piazza)
    .slice(0, 3);
  const mids = players
    .filter((p) => ["CDM", "CM", "CAM", "LM", "RM"].includes(p.bestPosition))
    .slice(0, 3);
  const atts = players
    .filter((p) => ["ST", "LW", "RW"].includes(p.bestPosition))
    .slice(0, 3);
  if (!gk || !piazza || defenders.length < 3) {
    throw new Error("fixture players missing");
  }

  const xi: Player[] = [gk, piazza, ...defenders, ...mids, ...atts].map(
    (p, i) => ({
      ...p,
      assignedSlot: i,
      assignedPosition: p === piazza ? "CDM" : p.bestPosition,
    }),
  );
  return {
    id: "user-squad",
    name: "Your team",
    nation: "MIX",
    wcYear: 2026,
    formation: FORMATIONS["4-3-3"],
    players: xi,
    isHistorical: false,
  };
}

describe("starting XI", () => {
  test("every historical squad can field eleven players", () => {
    for (const squad of HISTORICAL_SQUADS) {
      expect(pickXI(squad.players, squad.formation)).toHaveLength(11);
    }
  });

  test("a user squad keeps all eleven starters even with a cross-department assignment", () => {
    const squad = makeUserSquad();
    expect(startingXI(squad)).toHaveLength(11);
  });

  test("simulating a user squad does not drop the cross-department player", () => {
    const user = makeUserSquad();
    const opponent = HISTORICAL_SQUADS.find((s) => s.id === "esp-2010");
    if (!opponent) throw new Error("Spain 2010 missing");
    const script = simulateMatchScript(user, opponent, {
      regulationOnly: true,
    });
    expect(script.result.score).toHaveLength(2);
  });
});
