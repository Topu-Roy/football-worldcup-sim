import type { PenaltyKick, Player } from "../types.js";
import { logistic } from "../random.js";
import { effectiveDepartment } from "../draft/roles.js";

/** Five best non-GK penalty takers, ranked by composure and finishing. */
export function penaltyTakers(players: Player[]): Player[] {
  return [...players]
    .filter((p) => effectiveDepartment(p) !== "GK")
    .sort(
      (a, b) =>
        0.5 * (b.composure ?? 0) +
        0.5 * (b.finishing ?? 0) -
        (0.5 * (a.composure ?? 0) + 0.5 * (a.finishing ?? 0)),
    )
    .slice(0, 5);
}

/**
 * Simulate a shootout: best-of-five, stopping as soon as the result is
 * mathematically decided, then one-kick-each sudden death.
 */
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
  if (takersA.length === 0 || takersB.length === 0) return { score, kicks };

  let takenA = 0;
  let takenB = 0;

  /** Take one kick for a side, rotating through its ranked takers. */
  function take(team: 0 | 1, round: number): void {
    const takers = team === 0 ? takersA : takersB;
    const index = team === 0 ? takenA : takenB;
    const taker = takers[index % takers.length];
    const oppGk = team === 0 ? gkB : gkA;
    const rating = 0.5 * (taker.composure ?? 0) + 0.5 * (taker.finishing ?? 0);
    const scored =
      Math.random() < logistic((rating - oppGk) / scale + penaltyBias);

    if (scored) score[team] += 1;
    if (team === 0) takenA += 1;
    else takenB += 1;
    kicks.push({
      team,
      round,
      takerId: taker.id,
      takerName: taker.name,
      scored,
    });
  }

  /** During the first five rounds, one side can already be out of reach. */
  function decidedInFirstFive(): boolean {
    const remainingA = 5 - takenA;
    const remainingB = 5 - takenB;
    return score[0] > score[1] + remainingB || score[1] > score[0] + remainingA;
  }

  for (let round = 1; round <= 5; round++) {
    take(0, round);
    if (decidedInFirstFive()) return { score, kicks };
    take(1, round);
    if (decidedInFirstFive()) return { score, kicks };
  }

  // Sudden death: one kick each per round until the scores differ.
  let round = 6;
  while (true) {
    take(0, round);
    take(1, round);
    if (score[0] !== score[1]) return { score, kicks };
    round++;
  }
}
