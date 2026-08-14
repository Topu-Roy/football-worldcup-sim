import { logistic, poisson } from "../random.js";
import {
  effectivePossessionShare,
  effectiveStats,
  maxShotsFor,
  type TeamState,
} from "./dynamics.js";

export interface SegmentShot {
  team: 0 | 1;
  attack: number;
  oppDefense: number;
  finishing: number;
  oppGk: number;
}

/** Build the shuffled list of shots for one segment, distributing drawn shot counts to each team. */
export function buildSegmentShots(
  states: [TeamState, TeamState],
  score: [number, number],
  minute: number,
  base: number,
  isET: boolean,
  desperationScale: number,
  maxShotsClamp: [number, number],
): SegmentShot[] {
  const t0 = states[0];
  const t1 = states[1];
  const possession = effectivePossessionShare(
    states,
    score,
    minute,
    isET,
    desperationScale,
  );

  const s0 = effectiveStats(
    t0.strengths,
    score[0] - score[1],
    minute,
    t0.stamina,
    t0.strengths.composure.MID,
    score[0] < score[1],
    isET,
    desperationScale,
  );
  const s1 = effectiveStats(
    t1.strengths,
    score[1] - score[0],
    minute,
    t1.stamina,
    t1.strengths.composure.MID,
    score[1] < score[0],
    isET,
    desperationScale,
  );

  const shots0 = Math.min(
    poisson(possession * maxShotsFor(s0.attack, s1.defense, base)),
    maxShotsClamp[1],
  );
  const shots1 = Math.min(
    poisson((1 - possession) * maxShotsFor(s1.attack, s0.defense, base)),
    maxShotsClamp[1],
  );

  const list: SegmentShot[] = [];
  for (let i = 0; i < shots0; i++) {
    list.push({
      team: 0,
      attack: s0.attack,
      oppDefense: s1.defense,
      finishing: s0.finishing,
      oppGk: s1.gk,
    });
  }
  for (let i = 0; i < shots1; i++) {
    list.push({
      team: 1,
      attack: s1.attack,
      oppDefense: s0.defense,
      finishing: s1.finishing,
      oppGk: s0.gk,
    });
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** Resolve on-target and goal outcomes for a list of shots via logistic rates, accumulating goals, on-target, and xG. */
export function simShots(
  shots: SegmentShot[],
  scale: number,
  onTargetBias: number,
  conversionBias: number,
): {
  goals: [number, number];
  onTarget: [number, number];
  xg: [number, number];
} {
  const goals: [number, number] = [0, 0];
  const onTarget: [number, number] = [0, 0];
  const xg: [number, number] = [0, 0];
  for (const s of shots) {
    const onTargetRate = logistic(
      (s.attack - s.oppDefense) / scale - onTargetBias,
    );
    const conversionRate = logistic(
      (s.finishing - s.oppGk) / scale - conversionBias,
    );
    xg[s.team] += onTargetRate * conversionRate;
    if (Math.random() < onTargetRate) {
      onTarget[s.team] += 1;
      if (Math.random() < conversionRate) {
        goals[s.team] += 1;
      }
    }
  }
  return { goals, onTarget, xg };
}
