import type { PenaltyKick, Player } from "../types.js";
import { logistic } from "../random.js";

export function penaltyTakers(players: Player[]): Player[] {
  return [...players]
    .filter((p) => p.position !== "GK")
    .sort(
      (a, b) =>
        0.5 * (b.composure ?? 0) +
        0.5 * (b.finishing ?? 0) -
        (0.5 * (a.composure ?? 0) + 0.5 * (a.finishing ?? 0)),
    )
    .slice(0, 5);
}

export function simPenalties(
  takersA: Player[],
  takersB: Player[],
  gkA: number,
  gkB: number,
  scale: number,
  penaltyBias: number,
): { score: [number, number]; kicks: PenaltyKick[] } {
  const score: [number, number] = [0, 0];
  const kicks: PenaltyKick[] = [];
  let phase = 5;
  let firstFullSet = true;
  while (true) {
    for (let round = 0; round < phase; round++) {
      const takerA = takersA[round];
      if (takerA) {
        const rating =
          0.5 * (takerA.composure ?? 0) + 0.5 * (takerA.finishing ?? 0);
        const scored =
          Math.random() < logistic((rating - gkB) / scale + penaltyBias);
        if (scored) score[0] += 1;
        kicks.push({
          team: 0,
          round: Math.floor(kicks.length / 2) + 1,
          takerId: takerA.id,
          takerName: takerA.name,
          scored,
        });
      }
      const takerB = takersB[round];
      if (takerB) {
        const rating =
          0.5 * (takerB.composure ?? 0) + 0.5 * (takerB.finishing ?? 0);
        const scored =
          Math.random() < logistic((rating - gkA) / scale + penaltyBias);
        if (scored) score[1] += 1;
        kicks.push({
          team: 1,
          round: Math.floor(kicks.length / 2) + 1,
          takerId: takerB.id,
          takerName: takerB.name,
          scored,
        });
      }
    }
    if (score[0] !== score[1]) return { score, kicks };
    if (firstFullSet) {
      firstFullSet = false;
      continue;
    }
    phase = 1;
  }
}
