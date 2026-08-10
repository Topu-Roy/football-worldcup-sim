import type { Player, Position } from "../types.js";

export const ROLE_LABELS: Record<string, string> = {
  GK: "Goalkeeper",
  CB: "Centre-back",
  LB: "Left-back",
  RB: "Right-back",
  CDM: "Defensive midfielder",
  CM: "Centre midfielder",
  CAM: "Attacking midfielder",
  LM: "Left midfielder",
  RM: "Right midfielder",
  ST: "Striker",
  LW: "Left winger",
  RW: "Right winger",
};

const DEPARTMENT_OF_ROLE: Record<string, Position> = {
  GK: "GK",
  CB: "DEF",
  LB: "DEF",
  RB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  LM: "MID",
  RM: "MID",
  ST: "ATT",
  LW: "ATT",
  RW: "ATT",
};

/** Department (GK/DEF/MID/ATT) a role belongs to; defaults to MID for unknown roles. */
export function departmentOf(role: string): Position {
  return DEPARTMENT_OF_ROLE[role] ?? "MID";
}

/** Department of a player's natural best position. */
export function slotDepartment(p: Player): Position {
  return departmentOf(p.bestPosition);
}

/** Department of the role the player is actually assigned to. */
export function effectiveDepartment(p: Player): Position {
  return departmentOf(assignedRole(p));
}

/** Normalize role aliases (CF/SS → ST) so different labels compare equal. */
export function canonicalRole(role: string): string {
  if (role === "CF" || role === "SS") return "ST";
  return role;
}

const ROLE_WEIGHTS: Record<string, [keyof Player, number][]> = {
  GK: [
    ["reflexes", 0.4],
    ["positioning", 0.3],
    ["distribution", 0.15],
    ["composure", 0.15],
  ],
  CB: [
    ["tackling", 0.35],
    ["aerial", 0.3],
    ["passing", 0.15],
    ["composure", 0.2],
  ],
  LB: [
    ["pace", 0.3],
    ["tackling", 0.25],
    ["passing", 0.2],
    ["stamina", 0.15],
    ["composure", 0.1],
  ],
  RB: [
    ["pace", 0.3],
    ["tackling", 0.25],
    ["passing", 0.2],
    ["stamina", 0.15],
    ["composure", 0.1],
  ],
  CDM: [
    ["tackling", 0.3],
    ["passing", 0.25],
    ["workRate", 0.2],
    ["stamina", 0.15],
    ["composure", 0.1],
  ],
  CM: [
    ["passing", 0.35],
    ["workRate", 0.2],
    ["stamina", 0.15],
    ["dribble", 0.15],
    ["composure", 0.15],
  ],
  CAM: [
    ["passing", 0.3],
    ["dribble", 0.25],
    ["finishing", 0.15],
    ["workRate", 0.15],
    ["composure", 0.15],
  ],
  LM: [
    ["pace", 0.25],
    ["dribble", 0.25],
    ["passing", 0.25],
    ["workRate", 0.15],
    ["composure", 0.1],
  ],
  RM: [
    ["pace", 0.25],
    ["dribble", 0.25],
    ["passing", 0.25],
    ["workRate", 0.15],
    ["composure", 0.1],
  ],
  ST: [
    ["finishing", 0.45],
    ["offBall", 0.2],
    ["composure", 0.2],
    ["aerial", 0.15],
  ],
  LW: [
    ["pace", 0.3],
    ["dribble", 0.3],
    ["finishing", 0.2],
    ["composure", 0.2],
  ],
  RW: [
    ["pace", 0.3],
    ["dribble", 0.3],
    ["finishing", 0.2],
    ["composure", 0.2],
  ],
};

export const ROLE_LEVEL: Record<string, number> = {
  GK: 0,
  CB: 1,
  LB: 2,
  RB: 2,
  CDM: 3,
  CM: 4,
  LM: 4,
  RM: 4,
  CAM: 5,
  LW: 6,
  RW: 6,
  ST: 7,
};

type NerfMode = "both" | "forward";

const DEPT_NERF_MODE: Record<Position, NerfMode> = {
  GK: "both",
  DEF: "both",
  MID: "forward",
  ATT: "both",
};

/** Role the player is effectively playing: assigned position or their best position. */
export function assignedRole(p: Player): string {
  return p.assignedPosition ?? p.bestPosition;
}

/** Distance in role levels between best and assigned role (0 = natural position). */
export function roleGap(p: Player): number {
  const best = canonicalRole(p.bestPosition);
  const assigned = canonicalRole(assignedRole(p));
  if (best === assigned) return 0;
  const mode = DEPT_NERF_MODE[departmentOf(best)] ?? "forward";
  const diff = (ROLE_LEVEL[assigned] ?? 0) - (ROLE_LEVEL[best] ?? 0);
  return mode === "both" ? Math.abs(diff) : Math.max(0, diff);
}

/** Whether the player is currently playing out of position. */
export function outOfPosition(p: Player): boolean {
  return roleGap(p) > 0;
}

export interface NerfResult {
  factor: number;
  keys: Set<string>;
}

/** Performance multiplier (≤1) and the stat keys affected when a player plays out of position. */
export function roleNerf(p: Player): NerfResult {
  const gap = roleGap(p);
  if (gap <= 0) return { factor: 1, keys: new Set() };
  const pct = Math.min(10, gap * 7.5);
  const keys = new Set((ROLE_WEIGHTS[assignedRole(p)] ?? []).map(([k]) => k));
  return { factor: 1 - pct / 100, keys };
}

/** All role labels belonging to a department. */
export function rolesForDepartment(dept: Position): string[] {
  return (Object.keys(DEPARTMENT_OF_ROLE) as string[]).filter(
    (r) => DEPARTMENT_OF_ROLE[r] === dept,
  );
}

/** Weighted rating (50–99) for a player when playing a specific role. */
export function roleRating(p: Player, role: string): number {
  const weights = ROLE_WEIGHTS[role];
  if (!weights) return 0;
  const composure = p.composure ?? 60;
  let raw = 0;
  for (const [key, w] of weights) {
    const val =
      key === "composure"
        ? composure
        : ((p[key as keyof Player] as number | undefined) ?? composure);
    raw += val * w;
  }
  return Math.min(99, Math.max(50, Math.round(raw)));
}
