import type { TeamStrengths } from "../types.js";
import { clamp } from "../random.js";
import {
  CHAOS_FACTOR,
  POSSESSION_CHAOS,
  POSSESSION_LEAD_COMPOSURE_BONUS,
  POSSESSION_SWING_BASE,
  POSSESSION_SWING_MAX,
  POSSESSION_SWING_PER_GAP,
} from "./config.js";

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

/** Pace multiplier that rises through the match (slow early, frantic late). */
export function timeFactor(minute: number): number {
  if (minute < 30) return 0.5;
  if (minute >= 75) return 1.5;
  return 0.5 + (minute - 30) / 45;
}

/** Game-state effects on a team's output: trailing teams push harder, leaders defend their lead. */
export function desperation(
  goalDiff: number,
  minute: number,
  composure: number,
  trailing: boolean,
  scaleFactor = 1,
) {
  const tf = timeFactor(minute);
  const result = {
    shotsBonus: 0,
    defenseBonus: 0,
    finishingPenalty: 0,
    possessionBonus: 0,
  };

  if (goalDiff < 0) {
    const gap = -goalDiff;
    result.shotsBonus = clamp(0.15 + 0.05 * (gap - 1), 0, 0.4) * tf;
    result.defenseBonus = -clamp(0.1 + 0.05 * (gap - 1), 0, 0.3) * tf;
    result.finishingPenalty = 0.1;
    result.possessionBonus =
      clamp(
        POSSESSION_SWING_BASE + POSSESSION_SWING_PER_GAP * (gap - 1),
        0,
        POSSESSION_SWING_MAX,
      ) * tf;
    if (trailing && composure < 60) {
      result.shotsBonus += 0.1;
      result.finishingPenalty += 0.05;
      result.possessionBonus = 0;
    }
  } else if (goalDiff > 0) {
    result.shotsBonus = -0.15 * tf;
    result.defenseBonus = 0.1 * tf;
    result.possessionBonus =
      -clamp(
        POSSESSION_SWING_BASE + POSSESSION_SWING_PER_GAP * (goalDiff - 1),
        0,
        POSSESSION_SWING_MAX,
      ) * tf;
    if (!trailing && composure > 75) {
      result.defenseBonus += 0.05;
      result.possessionBonus -= POSSESSION_LEAD_COMPOSURE_BONUS * tf;
    }
  }
  if (scaleFactor !== 1) {
    result.shotsBonus *= scaleFactor;
    result.defenseBonus *= scaleFactor;
    result.finishingPenalty *= scaleFactor;
    result.possessionBonus *= scaleFactor;
  }
  return result;
}

/** Effective match stats after applying desperation, stamina drain, and ET chaos. */
export function effectiveStats(
  strengths: TeamStrengths,
  scoreDiff: number,
  minute: number,
  stamina: number,
  composure: number,
  trailing: boolean,
  isET: boolean,
  desperationScale = 1,
  chaosFactor = CHAOS_FACTOR,
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
    const chaos = (1 - stamina) * chaosFactor * (Math.random() * 2 - 1);
    finishing = finishing * (1 + chaos);
  }

  return {
    attack: strengths.attack * (1 + d.shotsBonus) * staminaMult,
    defense: strengths.defense * (1 + d.defenseBonus) * staminaMult,
    finishing,
    gk: strengths.gk * staminaMult,
  };
}

/** Baseline shot count for a team from its attack vs the opposition's defense. */
export function maxShotsFor(
  attack: number,
  oppDefense: number,
  base: number,
): number {
  return base * (attack / Math.max(oppDefense, 1));
}

/** Team 0's share of possession (0–1) from creativity/defPassing, adjusted by game state, stamina, and ET chaos. */
export function effectivePossessionShare(
  states: [TeamState, TeamState],
  score: [number, number],
  minute: number,
  isET: boolean,
  desperationScale = 1,
): number {
  const power = states.map((state, i) => {
    const goalDiff = score[i] - score[1 - i];
    const staminaMult = clamp(state.stamina, 0, 1);
    const d = desperation(
      goalDiff,
      minute,
      state.strengths.composure.MID,
      goalDiff < 0,
      desperationScale,
    );
    let p =
      (state.strengths.creativity + state.strengths.defPassing) *
      staminaMult *
      (1 + d.possessionBonus);
    if (isET && state.stamina < 0.5) {
      const chaos =
        (1 - state.stamina) * POSSESSION_CHAOS * (Math.random() * 2 - 1);
      p = p * (1 + chaos);
    }
    return p;
  });
  const total = power[0] + power[1];
  return total === 0 ? 0.5 : power[0] / total;
}
