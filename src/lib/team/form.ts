import type { Player } from "../types.js";
import { formRoll } from "../random.js";
import { effectiveDepartment } from "../draft/roles.js";

export function rollForms(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    form: effectiveDepartment(p) === "GK" ? formRoll(12) : formRoll(5),
  }));
}
