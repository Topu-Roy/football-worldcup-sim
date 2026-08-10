import type { Player } from "../types.js";
import { formRoll } from "../random.js";
import { effectiveDepartment } from "../draft/roles.js";

/** Roll a per-player form modifier, with goalkeepers getting a wider swing. */
export function rollForms(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    form: effectiveDepartment(p) === "GK" ? formRoll(12) : formRoll(5),
  }));
}
