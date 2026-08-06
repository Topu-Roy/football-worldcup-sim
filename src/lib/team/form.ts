import type { Player } from "../types.js";
import { formRoll } from "../random.js";
import { slotDepartment } from "../draft/roles.js";

export function rollForms(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    form: slotDepartment(p) === "GK" ? formRoll(12) : formRoll(5),
  }));
}
