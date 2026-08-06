import type { Player } from "../types.js";
import { roleRating } from "./roles.js";

const STAT_KEYS = [
  "reflexes",
  "positioning",
  "distribution",
  "tackling",
  "aerial",
  "passing",
  "pace",
  "dribble",
  "workRate",
  "stamina",
  "finishing",
  "offBall",
  "composure",
] as const;

export const ELITE_RATING = 90;
export const STAR_RATING = 85;

export function playerRating(p: Player): number {
  return roleRating(p, p.bestPosition);
}

export function avgRating(p: Player): number {
  const vals = STAT_KEYS.map((k) => p[k]).filter(
    (v): v is number => typeof v === "number",
  );
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export type PlayerTier = "elite" | "star" | "standard";

export function playerTier(p: Player): PlayerTier {
  const avg = avgRating(p);
  if (avg >= ELITE_RATING) return "elite";
  if (avg >= STAR_RATING) return "star";
  return "standard";
}
