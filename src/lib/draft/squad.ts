import type { Formation, Player, Squad } from "../types.js";

/** Assemble the final user Squad from the eleven drafted starters. */
export function buildUserSquad(formation: Formation, drafted: Player[]): Squad {
  const players = drafted.map((p) => ({
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
    isHistorical: false,
  };
}
