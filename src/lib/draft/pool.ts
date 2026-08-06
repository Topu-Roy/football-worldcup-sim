import type { Formation, Player } from "../types.js";
import { FORMATIONS } from "../types.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";

const pool: Player[] = HISTORICAL_SQUADS.flatMap((s) => s.players);

export function squadOf(nation: string, year: number): Player[] {
  return pool
    .filter((p) => p.nation === nation && p.wcYear === year)
    .slice(0, 11);
}

export function nationYears(nation: string): number[] {
  return [
    ...new Set(pool.filter((p) => p.nation === nation).map((p) => p.wcYear)),
  ].sort();
}

export function draftableNations(): string[] {
  return [...new Set(pool.map((p) => p.nation))];
}

export function formationOptions(): { key: string; formation: Formation }[] {
  return Object.entries(FORMATIONS).map(([key, formation]) => ({
    key,
    formation,
  }));
}
