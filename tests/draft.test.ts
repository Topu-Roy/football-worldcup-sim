import { describe, expect, test } from "bun:test";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { FORMATIONS } from "../src/lib/types.js";
import { makeOffer } from "../src/lib/draft/index.js";
import type { Player } from "../src/lib/types.js";

const formation = FORMATIONS["4-3-3"];

function pele(): Player {
  const squad = HISTORICAL_SQUADS.find((s) => s.id === "bra-1970");
  const player = squad?.players.find((p) => p.name === "Pelé");
  if (!player) throw new Error("Pelé missing");
  return player;
}

describe("draft offers", () => {
  test("drafted players are excluded from later offers", () => {
    const drafted = [{ ...pele(), assignedSlot: 9, assignedPosition: "ST" }];
    for (let i = 0; i < 250; i++) {
      const offer = makeOffer("4-3-3", formation, drafted);
      expect(offer.players.some((p) => p.name === "Pelé")).toBe(false);
    }
  });

  test("teammates from the same historical squad remain available", () => {
    const drafted = [{ ...pele(), assignedSlot: 9, assignedPosition: "ST" }];
    let found = false;
    for (let i = 0; i < 3000; i++) {
      const offer = makeOffer("4-3-3", formation, drafted);
      if (offer.nation === "BRA" && offer.year === 1970) {
        expect(offer.players.some((p) => p.name === "Jairzinho")).toBe(true);
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
