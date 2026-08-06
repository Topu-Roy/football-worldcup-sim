import type { Player, Position } from "../types.js";

const RATING_SCALE: Record<Position, number> = {
  GK: 1.065,
  DEF: 1.162,
  MID: 1.053,
  ATT: 1.018,
};

const RATING_WEIGHTS: Record<Position, [keyof Player, number][]> = {
  GK: [
    ["reflexes", 0.4],
    ["positioning", 0.3],
    ["distribution", 0.15],
    ["composure", 0.15],
  ],
  DEF: [
    ["tackling", 0.3],
    ["aerial", 0.2],
    ["passing", 0.2],
    ["pace", 0.15],
    ["composure", 0.15],
  ],
  MID: [
    ["passing", 0.3],
    ["dribble", 0.25],
    ["workRate", 0.2],
    ["stamina", 0.15],
    ["composure", 0.1],
  ],
  ATT: [
    ["finishing", 0.35],
    ["dribble", 0.25],
    ["pace", 0.2],
    ["offBall", 0.1],
    ["composure", 0.1],
  ],
};

export function playerRating(p: Player): number {
  const weights = RATING_WEIGHTS[p.position];
  const composure = p.composure ?? 60;
  let raw = 0;
  for (const [key, w] of weights) {
    const val =
      key === "composure"
        ? composure
        : ((p[key as keyof Player] as number | undefined) ?? composure);
    raw += val * w;
  }
  return Math.min(
    99,
    Math.max(50, Math.round(50 + (raw - 50) * RATING_SCALE[p.position])),
  );
}
