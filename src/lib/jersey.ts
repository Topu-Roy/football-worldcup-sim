import type { Player } from "./types.js";
import { pitchSlots } from "./draft/pitch.js";

/**
 * Conventional shirt numbers by role, used only when a player has no explicit
 * jersey number. The first unused number in the list is assigned so a squad
 * never shows two players with the same fallback number.
 */
const ROLE_NUMBERS: Record<string, number[]> = {
  GK: [1],
  RB: [2],
  CB: [4, 5],
  LB: [3],
  CDM: [6],
  CM: [8],
  CAM: [10],
  LM: [11],
  RM: [7],
  CF: [9],
  SS: [9],
  ST: [9],
  LW: [11],
  RW: [7],
};

/** Map every player to a unique display number, preferring explicit data. */
export function jerseyNumbersFor(
  players: Player[],
  formationKey: string,
): Map<string, number> {
  const numbers = new Map<string, number>();
  const used = new Set<number>();

  // Explicit numbers win, unless another player in this XI already claimed it.
  for (const player of players) {
    if (player.jerseyNumber && !used.has(player.jerseyNumber)) {
      numbers.set(player.id, player.jerseyNumber);
      used.add(player.jerseyNumber);
    }
  }

  const slots = pitchSlots(formationKey);
  for (const player of players) {
    if (numbers.has(player.id)) continue;
    const slot =
      player.assignedSlot !== undefined
        ? slots[player.assignedSlot]
        : undefined;
    const role = slot?.role ?? player.bestPosition;
    const preferred = ROLE_NUMBERS[role] ?? [];
    let number = preferred.find((n) => !used.has(n));

    if (number === undefined) {
      number = 12;
      while (used.has(number)) number += 1;
    }

    numbers.set(player.id, number);
    used.add(number);
  }

  return numbers;
}
