import type { Formation, Player, Squad } from "../types.js";

export function buildUserSquad(formation: Formation, drafted: Player[]): Squad {
  return {
    id: "user-squad",
    name: "Your XI",
    nation: "MIX",
    wcYear: 2026,
    formation,
    players: drafted.map((p) => ({ ...p, assignedPosition: p.bestPosition })),
    isHistorical: false,
  };
}
