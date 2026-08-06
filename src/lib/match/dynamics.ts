import type { TeamStrengths } from "../types.js";
import { clamp } from "../random.js";
import { CHAOS_FACTOR } from "./config.js";

export interface TeamState {
  strengths: TeamStrengths;
  decay: number;
  stamina: number;
}

export interface EffectiveStats {
  attack: number;
  defense: number;
  finishing: number;
  gk: number;
}

export function timeFactor(minute: number): number {
  if (minute < 30) return 0.5;
  if (minute >= 75) return 1.5;
  return 0.5 + (minute - 30) / 45;
}

export function desperation(
  goalDiff: number,
  minute: number,
  composure: number,
  trailing: boolean,
  scaleFactor = 1,
) {
  const tf = timeFactor(minute);
  const result = { shotsBonus: 0, defenseBonus: 0, finishingPenalty: 0 };

  if (goalDiff < 0) {
    const gap = -goalDiff;
    result.shotsBonus = clamp(0.15 + 0.05 * (gap - 1), 0, 0.4) * tf;
    result.defenseBonus = -clamp(0.1 + 0.05 * (gap - 1), 0, 0.3) * tf;
    result.finishingPenalty = 0.1;
    if (trailing && composure < 60) {
      result.shotsBonus += 0.1;
      result.finishingPenalty += 0.05;
    }
  } else if (goalDiff > 0) {
    result.shotsBonus = -0.15 * tf;
    result.defenseBonus = 0.1 * tf;
    if (!trailing && composure > 75) {
      result.defenseBonus += 0.05;
    }
  }
  if (scaleFactor !== 1) {
    result.shotsBonus *= scaleFactor;
    result.defenseBonus *= scaleFactor;
    result.finishingPenalty *= scaleFactor;
  }
  return result;
}

export function effectiveStats(
  strengths: TeamStrengths,
  scoreDiff: number,
  minute: number,
  stamina: number,
  composure: number,
  trailing: boolean,
  isET: boolean,
  desperationScale = 1,
): EffectiveStats {
  const d = desperation(
    scoreDiff,
    minute,
    composure,
    trailing,
    desperationScale,
  );
  const staminaMult = clamp(stamina, 0, 1);

  let finishing = strengths.finishing * (1 - d.finishingPenalty) * staminaMult;
  if (isET && stamina < 0.5) {
    const chaos = (1 - stamina) * CHAOS_FACTOR * (Math.random() * 2 - 1);
    finishing = finishing * (1 + chaos);
  }

  return {
    attack: strengths.attack * (1 + d.shotsBonus) * staminaMult,
    defense: strengths.defense * (1 + d.defenseBonus) * staminaMult,
    finishing,
    gk: strengths.gk * staminaMult,
  };
}

export function maxShotsFor(
  attack: number,
  oppDefense: number,
  base: number,
  clampRange: [number, number],
): number {
  const raw = base * (attack / Math.max(oppDefense, 1));
  return clamp(raw, clampRange[0], clampRange[1]);
}
