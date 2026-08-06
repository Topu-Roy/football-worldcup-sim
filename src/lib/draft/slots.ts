import type { Formation, Player, Position } from "../types.js";
import { DRAFT_ROUNDS } from "./constants.js";

export function slotsLeft(
  formation: Formation,
  drafted: Player[],
): Record<Position, number> {
  const left: Record<Position, number> = {
    GK: formation.GK,
    DEF: formation.DEF,
    MID: formation.MID,
    ATT: formation.ATT,
  };
  for (const p of drafted) left[p.position] -= 1;
  return left;
}

export function candidateCount(left: Record<Position, number>): number {
  return left.GK + left.DEF + left.MID + left.ATT;
}

export function fits(p: Player, left: Record<Position, number>): boolean {
  return left[p.position] > 0;
}

export function validateDraft(
  formation: Formation,
  drafted: Player[],
): boolean {
  if (drafted.length !== DRAFT_ROUNDS) return false;
  const left = slotsLeft(formation, drafted);
  return candidateCount(left) === 0;
}
