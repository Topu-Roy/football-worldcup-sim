import { describe, expect, test } from "bun:test";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { FORMATIONS } from "../src/lib/types.js";
import type { Player } from "../src/lib/types.js";
import {
  DRAFT_ROUNDS,
  buildUserSquad,
  swapPlayers,
  swapTargetsFor,
  validateDraft,
} from "../src/lib/draft/index.js";
import { startingXI } from "../src/lib/team/index.js";

function starters(): Player[] {
  const squad = HISTORICAL_SQUADS.find((s) => s.id === "bra-1970");
  if (!squad) throw new Error("Brazil 1970 missing");
  return startingXI(squad).map((p, i) => ({
    ...p,
    assignedSlot: i,
    assignedPosition: p.bestPosition,
  }));
}

describe("bench removal", () => {
  test("the draft is eleven rounds", () => {
    expect(DRAFT_ROUNDS).toBe(11);
  });

  test("a completed draft builds eleven starters with no bench", () => {
    const drafted = starters();
    expect(validateDraft(FORMATIONS["4-3-3"], drafted)).toBe(true);
    const squad = buildUserSquad(FORMATIONS["4-3-3"], drafted);
    expect(squad.players).toHaveLength(11);
    expect("bench" in squad).toBe(false);
  });

  test("swap targets never include a bench index", () => {
    const drafted = starters();
    const targets = swapTargetsFor(drafted, "4-3-3", drafted[0].id);
    expect(targets).not.toContain(11);
    expect(swapPlayers(drafted, "4-3-3", 0, 11)).toBeNull();
  });
});
