import type { Squad } from "../types.js";
import { GROUP_STAGE_SQUADS } from "../../data/group-stage/index.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";
import { shuffle } from "../random.js";

/** Random sample of weaker group-stage squads for the user's group, excluding given nations. */
export function drawWeak(
  count: number,
  excludeNations: string[] = [],
): Squad[] {
  return shuffle(
    GROUP_STAGE_SQUADS.filter((s) => !excludeNations.includes(s.nation)),
  ).slice(0, count);
}

/** Random sample of strong historical squads for knockout opponents, excluding given nations. */
export function drawStrong(
  count: number,
  excludeNations: string[] = [],
): Squad[] {
  return shuffle(
    HISTORICAL_SQUADS.filter((s) => !excludeNations.includes(s.nation)),
  ).slice(0, count);
}
