import type { MatchEvent, MatchResult, Player, Squad, TeamStrengths } from './types.js';
import { binomial, clamp, logistic, pick } from './random.js';
import {
  BASE_MAX_SHOTS,
  CHAOS_FACTOR,
  MAX_SHOTS_CLAMP,
  SCALE,
  computeTeamStrengths,
  decayRateFor,
  rollForms,
} from './team.js';

export interface EngineConfig {
  scale?: number;
  baseMaxShots?: number;
  chaosFactor?: number;
  maxShotsClamp?: [number, number];
  onTargetBias?: number;
  conversionBias?: number;
  desperationScale?: number;
  /** Stop at 90 minutes (no extra time or penalties). Draws allowed. */
  regulationOnly?: boolean;
}

const REGULATION_SEGMENTS = 6;
const REGULATION_MINUTES = 90;
const ET_SEGMENTS = 2;
const ET_MINUTES = 30;
const SEGMENT_MINUTES = REGULATION_MINUTES / REGULATION_SEGMENTS;
const ET_SEGMENT_MINUTES = ET_MINUTES / ET_SEGMENTS;

interface TeamState {
  strengths: TeamStrengths;
  decay: number;
  stamina: number;
}

interface EffectiveStats {
  attack: number;
  defense: number;
  finishing: number;
  gk: number;
}

function timeFactor(minute: number): number {
  if (minute < 30) return 0.5;
  if (minute >= 75) return 1.5;
  return 0.5 + (minute - 30) / 45;
}

function desperation(
  goalDiff: number,
  minute: number,
  composure: number,
  trailing: boolean,
  scaleFactor = 1,
) {
  const tf = timeFactor(minute);
  const result = { shotsBonus: 0, defenseBonus: 0, finishingPenalty: 0 };

  if (goalDiff < 0) {
    const gap = -goalDiff;
    result.shotsBonus = clamp(0.15 + 0.05 * (gap - 1), 0, 0.4) * tf;
    result.defenseBonus = -clamp(0.1 + 0.05 * (gap - 1), 0, 0.3) * tf;
    result.finishingPenalty = 0.1;
    if (trailing && composure < 60) {
      result.shotsBonus += 0.1;
      result.finishingPenalty += 0.05;
    }
  } else if (goalDiff > 0) {
    result.shotsBonus = -0.15 * tf;
    result.defenseBonus = 0.1 * tf;
    if (!trailing && composure > 75) {
      result.defenseBonus += 0.05;
    }
  }
  if (scaleFactor !== 1) {
    result.shotsBonus *= scaleFactor;
    result.defenseBonus *= scaleFactor;
    result.finishingPenalty *= scaleFactor;
  }
  return result;
}

function effectiveStats(
  strengths: TeamStrengths,
  scoreDiff: number,
  minute: number,
  stamina: number,
  composure: number,
  trailing: boolean,
  isET: boolean,
  desperationScale = 1,
): EffectiveStats {
  const d = desperation(scoreDiff, minute, composure, trailing, desperationScale);
  const staminaMult = clamp(stamina, 0, 1);

  let finishing = strengths.finishing * (1 - d.finishingPenalty) * staminaMult;
  if (isET && stamina < 0.5) {
    const chaos = (1 - stamina) * CHAOS_FACTOR * (Math.random() * 2 - 1);
    finishing = finishing * (1 + chaos);
  }

  return {
    attack: strengths.attack * (1 + d.shotsBonus) * staminaMult,
    defense: strengths.defense * (1 + d.defenseBonus) * staminaMult,
    finishing,
    gk: strengths.gk * staminaMult,
  };
}

function maxShotsFor(attack: number, oppDefense: number, base: number, clampRange: [number, number]): number {
  const raw = base * (attack / Math.max(oppDefense, 1));
  return clamp(raw, clampRange[0], clampRange[1]);
}

interface SegmentShot {
  team: 0 | 1;
  attack: number;
  oppDefense: number;
  finishing: number;
  oppGk: number;
}

function buildSegmentShots(
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
  const possession =
    (t0.strengths.creativity + t0.strengths.defPassing) /
    (t0.strengths.creativity + t0.strengths.defPassing + t1.strengths.creativity + t1.strengths.defPassing);

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

  const shots0 = Math.round(possession * maxShotsFor(s0.attack, s1.defense, base, maxShotsClamp));
  const shots1 = Math.round((1 - possession) * maxShotsFor(s1.attack, s0.defense, base, maxShotsClamp));

  const list: SegmentShot[] = [];
  for (let i = 0; i < shots0; i++) {
    list.push({ team: 0, attack: s0.attack, oppDefense: s1.defense, finishing: s0.finishing, oppGk: s1.gk });
  }
  for (let i = 0; i < shots1; i++) {
    list.push({ team: 1, attack: s1.attack, oppDefense: s0.defense, finishing: s1.finishing, oppGk: s0.gk });
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function simShots(
  shots: SegmentShot[],
  scale: number,
  onTargetBias: number,
  conversionBias: number,
): { goals: [number, number]; onTarget: [number, number] } {
  const goals: [number, number] = [0, 0];
  const onTarget: [number, number] = [0, 0];
  for (const s of shots) {
    if (Math.random() < logistic((s.attack - s.oppDefense) / scale - onTargetBias)) {
      onTarget[s.team] += 1;
      if (Math.random() < logistic((s.finishing - s.oppGk) / scale - conversionBias)) {
        goals[s.team] += 1;
      }
    }
  }
  return { goals, onTarget };
}

function penaltyTakers(players: Player[]): Player[] {
  return [...players]
    .filter((p) => p.position !== 'GK')
    .sort((a, b) => (0.5 * (b.composure ?? 0) + 0.5 * (b.finishing ?? 0)) - (0.5 * (a.composure ?? 0) + 0.5 * (a.finishing ?? 0)))
    .slice(0, 5);
}

function simPenalties(
  takersA: Player[],
  takersB: Player[],
  gkA: number,
  gkB: number,
  scale: number,
  penaltyBias: number,
): [number, number] {
  const score: [number, number] = [0, 0];
  let kicks = 5;
  let keeper = 0;
  while (true) {
    for (let round = 0; round < kicks; round++) {
      const taker = takersA[round];
      if (taker) {
        const rating = 0.5 * (taker.composure ?? 0) + 0.5 * (taker.finishing ?? 0);
        if (Math.random() < logistic((rating - gkB) / scale + penaltyBias)) score[0] += 1;
      }
      const takerB = takersB[round];
      if (takerB) {
        const rating = 0.5 * (takerB.composure ?? 0) + 0.5 * (takerB.finishing ?? 0);
        if (Math.random() < logistic((rating - gkA) / scale + penaltyBias)) score[1] += 1;
      }
    }
    if (score[0] !== score[1]) return score;
    if (keeper === 0) {
      keeper = 1;
      continue;
    }
    kicks = 1;
  }
}

export function simulateMatch(squadA: Squad, squadB: Squad, config: EngineConfig = {}): MatchResult {
  const scale = config.scale ?? SCALE;
  const base = config.baseMaxShots ?? BASE_MAX_SHOTS;
  const onTargetBias = config.onTargetBias ?? 0.6;
  const conversionBias = config.conversionBias ?? 0.9;
  const desperationScale = config.desperationScale ?? 0.5;
  const maxShotsClamp = config.maxShotsClamp ?? [2, 6];
  const regulationOnly = config.regulationOnly ?? false;

  const playersA = rollForms(squadA.players);
  const playersB = rollForms(squadB.players);
  const strengthsA = computeTeamStrengths(playersA, squadA.isHistorical);
  const strengthsB = computeTeamStrengths(playersB, squadB.isHistorical);

  const states: [TeamState, TeamState] = [
    { strengths: strengthsA, decay: decayRateFor(strengthsA.avgStamina), stamina: 1 },
    { strengths: strengthsB, decay: decayRateFor(strengthsB.avgStamina), stamina: 1 },
  ];

  const score: [number, number] = [0, 0];
  const shots: [number, number] = [0, 0];
  const shotsOnTarget: [number, number] = [0, 0];
  const events: MatchEvent[] = [];
  const possessionSum: [number, number] = [0, 0];

  function processSegment(minute: number, isET: boolean) {
    const segShots = buildSegmentShots(states, score, minute, base, isET, desperationScale, maxShotsClamp);
    const poss =
      (states[0].strengths.creativity + states[0].strengths.defPassing) /
      (states[0].strengths.creativity + states[0].strengths.defPassing + states[1].strengths.creativity + states[1].strengths.defPassing);
    possessionSum[0] += poss;
    possessionSum[1] += 1 - poss;

    const { goals, onTarget } = simShots(segShots, scale, onTargetBias, conversionBias);
    for (const t of [0, 1] as const) {
      shots[t] += segShots.filter((s) => s.team === t).length;
      shotsOnTarget[t] += onTarget[t];
      for (let i = 0; i < goals[t]; i++) {
        score[t] += 1;
        events.push({ minute, teamIndex: t, type: 'goal' });
      }
    }

    for (const t of [0, 1] as const) {
      states[t].stamina = Math.max(0, states[t].stamina - states[t].decay);
    }
  }

  for (let i = 0; i < REGULATION_SEGMENTS; i++) {
    const minute = Math.round(((i + 0.5) * REGULATION_MINUTES) / REGULATION_SEGMENTS);
    processSegment(minute, false);
  }

  let extraTime = false;
  let penalties = false;
  let penaltyScore: [number, number] | undefined;

  if (score[0] === score[1] && !regulationOnly) {
    extraTime = true;
    for (let i = 0; i < ET_SEGMENTS; i++) {
      const minute = REGULATION_MINUTES + Math.round(((i + 0.5) * ET_MINUTES) / ET_SEGMENTS);
      processSegment(minute, true);
    }
    if (score[0] === score[1]) {
      penalties = true;
      const takersA = penaltyTakers(playersA);
      const takersB = penaltyTakers(playersB);
      penaltyScore = simPenalties(takersA, takersB, strengthsA.gk, strengthsB.gk, scale, 1.1);
      score[0] += penaltyScore[0];
      score[1] += penaltyScore[1];
    }
  }

  const winner: 0 | 1 | null = score[0] === score[1] ? null : score[0] > score[1] ? 0 : 1;
  const totalPoss = possessionSum[0] + possessionSum[1];

  return {
    score,
    shots,
    shotsOnTarget,
    possession: [possessionSum[0] / totalPoss, possessionSum[1] / totalPoss],
    extraTime,
    penalties,
    penaltyScore,
    events,
    winner,
  };
}
