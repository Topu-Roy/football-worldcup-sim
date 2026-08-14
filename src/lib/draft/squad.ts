import type { Formation, Player, Squad } from "../types.js";
import { BENCH_SLOT } from "./pitch.js";

/** Assemble the final user Squad from the drafted players: 11 starters plus the single bench player. */
export function buildUserSquad(formation: Formation, drafted: Player[]): Squad {
  const bench = drafted
    .filter((p) => p.assignedSlot === BENCH_SLOT)
    .map((p) => ({ ...p, assignedPosition: undefined }));
  const players = drafted
    .filter((p) => p.assignedSlot !== BENCH_SLOT)
    .map((p) => ({
      ...p,
      assignedPosition: p.assignedPosition ?? p.bestPosition,
    }));
  return {
    id: "user-squad",
    name: "Your team",
    nation: "MIX",
    wcYear: 2026,
    formation,
    players,
    bench,
    isHistorical: false,
  };
}
