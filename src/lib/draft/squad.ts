import type { Formation, Player, Squad } from "../types.js";

/** Assemble the final user Squad from the drafted players, filling assigned roles with best positions. */
export function buildUserSquad(formation: Formation, drafted: Player[]): Squad {
  return {
    id: "user-squad",
    name: "Your XI",
    nation: "MIX",
    wcYear: 2026,
    formation,
    players: drafted.map((p) => ({
      ...p,
      assignedPosition: p.assignedPosition ?? p.bestPosition,
    })),
    isHistorical: false,
  };
}
