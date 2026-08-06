import type { Player } from '../types.js';
import { clamp } from '../random.js';

export const CHEMISTRY_CAP = 0.1;
export const CHEMISTRY_CURVE: Record<number, number> = {
  2: 0.03,
  3: 0.05,
  4: 0.08,
  5: 0.1,
};

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

export function chemistryBonus(players: Player[], isHistorical: boolean): number {
  if (isHistorical) return 0.2;
  const n = countSameNation(players);
  return clamp(CHEMISTRY_CURVE[n] ?? 0, 0, CHEMISTRY_CAP);
}
