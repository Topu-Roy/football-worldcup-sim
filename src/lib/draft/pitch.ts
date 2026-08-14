import type { Player } from "../types.js";
import {
  assignedRole,
  canonicalRole,
  departmentOf,
  slotDepartment,
} from "./roles.js";

/** Whether a player can play a given role (canonical roles compare equal, e.g. CF === ST). */
export function canPlayRole(p: Player, role: string): boolean {
  return p.positions.some((r) => canonicalRole(r) === canonicalRole(role));
}

export interface PitchSlot {
  role: string;
  x: number;
  y: number;
}

const SLOTS: Record<string, PitchSlot[]> = {
  "4-3-3": [
    { role: "GK", x: 50, y: 91 },
    { role: "LB", x: 12, y: 74 },
    { role: "CB", x: 38, y: 78 },
    { role: "CB", x: 62, y: 78 },
    { role: "RB", x: 88, y: 74 },
    { role: "CDM", x: 50, y: 58 },
    { role: "CM", x: 32, y: 46 },
    { role: "CAM", x: 68, y: 46 },
    { role: "LW", x: 18, y: 27 },
    { role: "ST", x: 50, y: 21 },
    { role: "RW", x: 82, y: 27 },
  ],
  "4-4-2": [
    { role: "GK", x: 50, y: 91 },
    { role: "LB", x: 12, y: 74 },
    { role: "CB", x: 38, y: 78 },
    { role: "CB", x: 62, y: 78 },
    { role: "RB", x: 88, y: 74 },
    { role: "LM", x: 18, y: 52 },
    { role: "CM", x: 38, y: 54 },
    { role: "CM", x: 62, y: 54 },
    { role: "RM", x: 82, y: 52 },
    { role: "ST", x: 40, y: 21 },
    { role: "ST", x: 60, y: 21 },
  ],
  "3-5-2": [
    { role: "GK", x: 50, y: 91 },
    { role: "CB", x: 25, y: 78 },
    { role: "CB", x: 50, y: 80 },
    { role: "CB", x: 75, y: 78 },
    { role: "CDM", x: 50, y: 60 },
    { role: "CM", x: 38, y: 48 },
    { role: "CM", x: 62, y: 48 },
    { role: "LM", x: 16, y: 38 },
    { role: "RM", x: 84, y: 38 },
    { role: "ST", x: 40, y: 19 },
    { role: "ST", x: 60, y: 19 },
  ],
  "4-2-3-1": [
    { role: "GK", x: 50, y: 91 },
    { role: "LB", x: 12, y: 74 },
    { role: "CB", x: 38, y: 78 },
    { role: "CB", x: 62, y: 78 },
    { role: "RB", x: 88, y: 74 },
    { role: "CDM", x: 38, y: 60 },
    { role: "CDM", x: 62, y: 60 },
    { role: "CAM", x: 50, y: 42 },
    { role: "LM", x: 18, y: 34 },
    { role: "RM", x: 82, y: 34 },
    { role: "ST", x: 50, y: 18 },
  ],
};

/** Static slot positions (percentage coords) for a formation key; falls back to 4-3-3. */
export function pitchSlots(formationKey: string): PitchSlot[] {
  return SLOTS[formationKey] ?? SLOTS["4-3-3"];
}

/** Sentinel assignedSlot index for the single bench slot (outside the pitch). */
export const BENCH_SLOT = 11;

/** Assign players to slots: explicit assignedSlot first, then role match, then department, then any free player. */
export function assignSlots(
  players: Player[],
  formationKey: string,
): { player: Player | null; slot: PitchSlot }[] {
  const slots = pitchSlots(formationKey);
  const used = new Set<string>();
  const committed = (p: Player) => p.assignedSlot !== undefined;
  return slots.map((slot, i) => {
    const explicit = players.find(
      (p) => !used.has(p.id) && p.assignedSlot === i,
    );
    const byRole = !explicit
      ? players.find(
          (p) =>
            !used.has(p.id) &&
            !committed(p) &&
            canonicalRole(assignedRole(p)) === canonicalRole(slot.role),
        )
      : undefined;
    const byDept =
      !explicit && !byRole
        ? players.find(
            (p) =>
              !used.has(p.id) &&
              !committed(p) &&
              slotDepartment(p) === departmentOf(slot.role),
          )
        : undefined;
    const fallback =
      !explicit && !byRole && !byDept
        ? players.find((p) => !used.has(p.id) && !committed(p))
        : undefined;
    const player = explicit ?? byRole ?? byDept ?? fallback ?? null;
    if (player) used.add(player.id);
    return { player, slot };
  });
}

/** Slots a player can swap into: empty compatible slots, plus occupied slots whose player can take the swapper's current role. Includes the bench slot when a bench player can take the swapper's role. */
export function swapTargetsFor(
  players: Player[],
  formationKey: string,
  playerId: string,
): number[] {
  const from = players.find((p) => p.id === playerId);
  if (!from || from.assignedSlot === undefined) return [];
  const current = assignedRole(from);
  const slots = pitchSlots(formationKey);
  const targets: number[] = [];
  const onBench = from.assignedSlot === BENCH_SLOT;
  slots.forEach((slot, i) => {
    if (i === from.assignedSlot) return;
    const occupant = players.find((p) => p.assignedSlot === i);
    const canTake = canPlayRole(from, slot.role);
    if (!canTake) return;
    if (!occupant) {
      targets.push(i);
      return;
    }
    if (canPlayRole(occupant, current)) targets.push(i);
  });
  const benchOccupant = onBench
    ? null
    : players.find((p) => p.assignedSlot === BENCH_SLOT);
  if (benchOccupant && canPlayRole(benchOccupant, current))
    targets.push(BENCH_SLOT);
  return targets;
}

/** Move the player at fromIndex into toIndex (swapping occupants when occupied). Handles the bench slot (index BENCH_SLOT); null if not legal. */
export function swapPlayers(
  players: Player[],
  formationKey: string,
  fromIndex: number,
  toIndex: number,
): Player[] | null {
  const from = players.find((p) => p.assignedSlot === fromIndex);
  if (!from || fromIndex === toIndex) return null;

  // Starter -> bench, bench player -> starter's slot. The bench has no role, so
  // only the bench player needs to fit the starter's slot.
  if (toIndex === BENCH_SLOT) {
    const target = players.find((p) => p.assignedSlot === BENCH_SLOT);
    if (!target) return null;
    const fromRole = pitchSlots(formationKey)[fromIndex]?.role;
    if (!fromRole || !canPlayRole(target, fromRole)) return null;
    return players.map((p) => {
      if (p.id === from.id)
        return { ...p, assignedPosition: undefined, assignedSlot: BENCH_SLOT };
      if (p.id === target.id)
        return { ...p, assignedPosition: fromRole, assignedSlot: fromIndex };
      return p;
    });
  }

  // Bench player -> starter's slot (swapping with the occupant, who needs no
  // role), or into an empty compatible slot (bench empties).
  if (fromIndex === BENCH_SLOT) {
    const targetRole = pitchSlots(formationKey)[toIndex]?.role;
    if (!targetRole || !canPlayRole(from, targetRole)) return null;
    const target = players.find((p) => p.assignedSlot === toIndex);
    if (!target) {
      return players.map((p) =>
        p.id === from.id
          ? { ...p, assignedPosition: targetRole, assignedSlot: toIndex }
          : p,
      );
    }
    return players.map((p) => {
      if (p.id === from.id)
        return { ...p, assignedPosition: targetRole, assignedSlot: toIndex };
      if (p.id === target.id)
        return { ...p, assignedPosition: undefined, assignedSlot: BENCH_SLOT };
      return p;
    });
  }

  const targetRole = pitchSlots(formationKey)[toIndex]?.role;
  if (!targetRole || !canPlayRole(from, targetRole)) return null;
  const target = players.find((p) => p.assignedSlot === toIndex);
  if (!target) {
    return players.map((p) =>
      p.id === from.id
        ? { ...p, assignedPosition: targetRole, assignedSlot: toIndex }
        : p,
    );
  }
  const fromRole = assignedRole(from);
  if (!canPlayRole(target, fromRole)) return null;
  return players.map((p) => {
    if (p.id === from.id)
      return { ...p, assignedPosition: targetRole, assignedSlot: toIndex };
    if (p.id === target.id)
      return { ...p, assignedPosition: fromRole, assignedSlot: fromIndex };
    return p;
  });
}
