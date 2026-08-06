import type { Player } from "../types.js";
import { roleRating } from "./roles.js";

export function playerRating(p: Player): number {
  return roleRating(p, p.bestPosition);
}
