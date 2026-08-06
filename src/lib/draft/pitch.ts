import type { Player } from "../types.js";
import { assignedRole, departmentOf, slotDepartment } from "./roles.js";

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

export function pitchSlots(formationKey: string): PitchSlot[] {
  return SLOTS[formationKey] ?? SLOTS["4-3-3"];
}

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
            assignedRole(p) === slot.role,
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
