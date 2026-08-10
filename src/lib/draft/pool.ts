import type { Formation, Player } from "../types.js";
import { FORMATIONS } from "../types.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";

const pool: Player[] = HISTORICAL_SQUADS.flatMap((s) => s.players);

/** All players in the historical pool for a given nation and tournament year. */
export function squadOf(nation: string, year: number): Player[] {
  return pool.filter((p) => p.nation === nation && p.wcYear === year);
}

/** Tournament years a nation appears in the pool, ascending. */
export function nationYears(nation: string): number[] {
  return [
    ...new Set(pool.filter((p) => p.nation === nation).map((p) => p.wcYear)),
  ].sort();
}

/** Every nation represented in the pool. */
export function draftableNations(): string[] {
  return [...new Set(pool.map((p) => p.nation))];
}

/** Available formation configurations as key + formation pairs. */
export function formationOptions(): { key: string; formation: Formation }[] {
  return Object.entries(FORMATIONS).map(([key, formation]) => ({
    key,
    formation,
  }));
}
