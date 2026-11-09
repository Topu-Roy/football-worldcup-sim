import type { Formation, Player, Position } from "../types.js";
import { DRAFT_ROUNDS } from "./constants.js";
import { slotDepartment } from "./roles.js";
import { assignSlots } from "./pitch.js";

/** Remaining open slots per department after the drafted players are placed. */
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
  for (const p of drafted) {
    left[slotDepartment(p)] -= 1;
  }
  return left;
}

/** Total remaining slots across all departments. */
export function candidateCount(left: Record<Position, number>): number {
  return left.GK + left.DEF + left.MID + left.ATT;
}

/** Whether a player fits an open slot in their department. */
export function fits(p: Player, left: Record<Position, number>): boolean {
  return left[slotDepartment(p)] > 0;
}

/** Roles of slots that are currently empty for the formation. */
export function emptySlotRoles(
  formationKey: string,
  drafted: Player[],
): string[] {
  return assignSlots(drafted, formationKey)
    .filter((s) => !s.player)
    .map((s) => s.slot.role);
}

/** True when the draft has all DRAFT_ROUNDS players and every formation slot is filled. */
export function validateDraft(
  formation: Formation,
  drafted: Player[],
): boolean {
  if (drafted.length !== DRAFT_ROUNDS) return false;
  const left = slotsLeft(formation, drafted);
  return candidateCount(left) === 0;
}
