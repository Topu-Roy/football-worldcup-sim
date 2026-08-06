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
  CF: "Centre-forward",
  SS: "Second striker",
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
  CF: "ATT",
  SS: "ATT",
  LW: "ATT",
  RW: "ATT",
};

export function departmentOf(role: string): Position {
  return DEPARTMENT_OF_ROLE[role] ?? "MID";
}

export function slotDepartment(p: Player): Position {
  return departmentOf(p.bestPosition);
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
  CF: [
    ["finishing", 0.35],
    ["offBall", 0.2],
    ["dribble", 0.15],
    ["passing", 0.15],
    ["composure", 0.15],
  ],
  SS: [
    ["finishing", 0.3],
    ["dribble", 0.2],
    ["passing", 0.2],
    ["offBall", 0.15],
    ["composure", 0.15],
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
  return Math.min(99, Math.max(50, Math.round(50 + (raw - 55) * 0.9)));
}
