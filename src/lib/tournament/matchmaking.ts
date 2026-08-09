import type { Squad } from "../types.js";
import { GROUP_STAGE_SQUADS } from "../../data/group-stage/index.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";
import { shuffle } from "../random.js";

export function drawWeak(count: number): Squad[] {
  return shuffle(GROUP_STAGE_SQUADS).slice(0, count);
}

export function drawStrong(count: number): Squad[] {
  return shuffle(HISTORICAL_SQUADS).slice(0, count);
}
