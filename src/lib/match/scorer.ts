import type { Player } from "../types.js";
import { effectiveDepartment } from "../draft/roles.js";

const POSITION_GOAL_WEIGHT: Record<string, number> = {
  ATT: 5,
  MID: 2.5,
  DEF: 0.6,
  GK: 0,
};

export function pickScorer(team: Player[]): Player {
  const candidates = team.filter((p) => effectiveDepartment(p) !== "GK");
  if (candidates.length === 0) return team[0];
  const weight = (p: Player) =>
    POSITION_GOAL_WEIGHT[effectiveDepartment(p)] *
    (0.5 + (p.finishing ?? 60) / 200) *
    (0.5 + (p.composure ?? 60) / 200);
  const total = candidates.reduce((n, p) => n + weight(p), 0);
  let r = Math.random() * total;
  for (const p of candidates) {
    r -= weight(p);
    if (r <= 0) return p;
  }
  return candidates[candidates.length - 1];
}
