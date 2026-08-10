import type { Squad } from "../types.js";
import { GROUP_STAGE_SQUADS } from "../../data/group-stage/index.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";
import { shuffle } from "../random.js";

/** Random sample of weaker group-stage squads for the user's group. */
export function drawWeak(count: number): Squad[] {
  return shuffle(GROUP_STAGE_SQUADS).slice(0, count);
}

/** Random sample of strong historical squads for knockout opponents. */
export function drawStrong(count: number): Squad[] {
  return shuffle(HISTORICAL_SQUADS).slice(0, count);
}
