import type { Player } from "../types.js";
import { clamp } from "../random.js";

export const CHEMISTRY_CAP = 0.1;
export const CHEMISTRY_CURVE: Record<number, number> = {
  2: 0.03,
  3: 0.05,
  4: 0.08,
  5: 0.1,
};

/** Number of players sharing the most-common nation in the set. */
export function countSameNation(players: Player[]): number {
  const counts = new Map<string, number>();
  for (const p of players) {
    counts.set(p.nation, (counts.get(p.nation) ?? 0) + 1);
  }
  let max = 0;
  for (const c of counts.values()) {
    if (c > max) max = c;
  }
  return max;
}

export interface NationCluster {
  nation: string;
  players: Player[];
  /** Multiplier-eligible bonus for this cluster (0 when too small). */
  bonus: number;
}

/** Cluster bonus for a same-nation group: 2→+3%, 3→+5%, 4→+8%, 5+→+10%. */
function clusterBonus(size: number): number {
  return clamp(CHEMISTRY_CURVE[Math.min(size, 5)] ?? 0, 0, CHEMISTRY_CAP);
}

/** Group players by nation, sorted by cluster size desc (then nation), with each cluster's boost. */
export function nationClusters(players: Player[]): NationCluster[] {
  const byNation = new Map<string, Player[]>();
  for (const p of players) {
    const list = byNation.get(p.nation) ?? [];
    list.push(p);
    byNation.set(p.nation, list);
  }
  return [...byNation.entries()]
    .map(([nation, list]) => ({
      nation,
      players: list,
      bonus: clusterBonus(list.length),
    }))
    .sort(
      (a, b) =>
        b.players.length - a.players.length ||
        a.nation.localeCompare(b.nation),
    );
}

/** Stat multiplier a single player receives from their own nation cluster. */
export function playerBonus(
  player: Player,
  players: Player[],
  isHistorical: boolean,
): number {
  if (isHistorical) return 0.2;
  const cluster = nationClusters(players).find((c) =>
    c.players.some((p) => p.id === player.id),
  );
  return cluster?.bonus ?? 0;
}

/** Stat multiplier from squad chemistry: historical squads get a flat bonus, drafted squads scale with same-nation count. */
export function chemistryBonus(
  players: Player[],
  isHistorical: boolean,
): number {
  if (isHistorical) return 0.2;
  const n = countSameNation(players);
  return clamp(CHEMISTRY_CURVE[Math.min(n, 5)] ?? 0, 0, CHEMISTRY_CAP);
}
