import { clamp } from "../random.js";

const HIGH_STAMINA_DECAY = 0.04;
const LOW_STAMINA_DECAY = 0.08;

export function decayRateFor(avgStamina: number): number {
  return clamp(
    HIGH_STAMINA_DECAY +
      (70 - avgStamina) * ((LOW_STAMINA_DECAY - HIGH_STAMINA_DECAY) / 30),
    HIGH_STAMINA_DECAY,
    LOW_STAMINA_DECAY,
  );
}
