import type { Player } from "../types.js";
import { formRoll } from "../random.js";

export function rollForms(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    form: p.position === "GK" ? formRoll(12) : formRoll(5),
  }));
}
