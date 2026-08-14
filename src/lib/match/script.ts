import type {
  MatchEvent,
  MatchResult,
  MatchScript,
  PenaltyKick,
  SegmentSnapshot,
  Squad,
} from "../types.js";
import {
  applyTeamModifiers,
  computeTeamStrengths,
  decayRateFor,
  pickXI,
  rollForms,
} from "../team/index.js";
import { BASE_MAX_SHOTS, MAX_SHOTS_CLAMP, SCALE } from "./config.js";
import { effectivePossessionShare, type TeamState } from "./dynamics.js";
import { buildSegmentShots, simShots } from "./shots.js";
import { pickScorer } from "./scorer.js";
import { penaltyTakers, simPenalties } from "./penalties.js";

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

/** Simulate a full match: regulation (and ET + penalties unless regulationOnly), returning the segmented script for playback. */
export function simulateMatchScript(
  squadA: Squad,
  squadB: Squad,
  config: EngineConfig = {},
): MatchScript {
  const scale = config.scale ?? SCALE;
  const base = config.baseMaxShots ?? BASE_MAX_SHOTS;
  const onTargetBias = config.onTargetBias ?? 0.6;
  const conversionBias = config.conversionBias ?? 0.9;
  const desperationScale = config.desperationScale ?? 0.5;
  const maxShotsClamp = config.maxShotsClamp ?? MAX_SHOTS_CLAMP;
  const regulationOnly = config.regulationOnly ?? false;

  const playersA = applyTeamModifiers(
    rollForms(pickXI(squadA.players, squadA.formation)),
    squadA.isHistorical,
  );
  const playersB = applyTeamModifiers(
    rollForms(pickXI(squadB.players, squadB.formation)),
    squadB.isHistorical,
  );
  const strengthsA = computeTeamStrengths(playersA);
  const strengthsB = computeTeamStrengths(playersB);

  const states: [TeamState, TeamState] = [
    {
      strengths: strengthsA,
      decay: decayRateFor(strengthsA.avgStamina),
      stamina: 1,
    },
    {
      strengths: strengthsB,
      decay: decayRateFor(strengthsB.avgStamina),
      stamina: 1,
    },
  ];

  const score: [number, number] = [0, 0];
  const shots: [number, number] = [0, 0];
  const shotsOnTarget: [number, number] = [0, 0];
  const xg: [number, number] = [0, 0];
  const events: MatchEvent[] = [];
  const possessionSum: [number, number] = [0, 0];

  function processSegment(minute: number, isET: boolean): SegmentSnapshot {
    const segShots = buildSegmentShots(
      states,
      score,
      minute,
      base,
      isET,
      desperationScale,
      maxShotsClamp,
    );
    const poss = effectivePossessionShare(
      states,
      score,
      minute,
      isET,
      desperationScale,
    );
    possessionSum[0] += poss;
    possessionSum[1] += 1 - poss;

    const {
      goals,
      onTarget,
      xg: segXg,
    } = simShots(segShots, scale, onTargetBias, conversionBias);
    const segEvents: MatchEvent[] = [];
    for (const t of [0, 1] as const) {
      shots[t] += segShots.filter((s) => s.team === t).length;
      shotsOnTarget[t] += onTarget[t];
      xg[t] += segXg[t];
      for (let i = 0; i < goals[t]; i++) {
        score[t] += 1;
        const scorer = pickScorer(t === 0 ? playersA : playersB);
        const ev: MatchEvent = {
          minute,
          teamIndex: t,
          type: "goal",
          scorerId: scorer.id,
          scorerName: scorer.name,
        };
        events.push(ev);
        segEvents.push(ev);
      }
    }

    for (const t of [0, 1] as const) {
      states[t].stamina = Math.max(0, states[t].stamina - states[t].decay);
    }

    return {
      minute,
      isET,
      score: [score[0], score[1]],
      shots: [shots[0], shots[1]],
      shotsOnTarget: [shotsOnTarget[0], shotsOnTarget[1]],
      xg: [xg[0], xg[1]],
      possession: [poss, 1 - poss],
      events: segEvents,
    };
  }

  const regulation: SegmentSnapshot[] = [];
  for (let i = 0; i < REGULATION_SEGMENTS; i++) {
    const minute = Math.round(
      ((i + 0.5) * REGULATION_MINUTES) / REGULATION_SEGMENTS,
    );
    regulation.push(processSegment(minute, false));
  }

  let extraTime: SegmentSnapshot[] | undefined;
  let penalties: PenaltyKick[] | undefined;
  let penaltyScore: [number, number] | undefined;

  if (score[0] === score[1] && !regulationOnly) {
    extraTime = [];
    for (let i = 0; i < ET_SEGMENTS; i++) {
      const minute =
        REGULATION_MINUTES + Math.round(((i + 0.5) * ET_MINUTES) / ET_SEGMENTS);
      extraTime.push(processSegment(minute, true));
    }
    if (score[0] === score[1]) {
      const takersA = penaltyTakers(playersA);
      const takersB = penaltyTakers(playersB);
      const shootout = simPenalties(
        takersA,
        takersB,
        strengthsA.gk,
        strengthsB.gk,
        scale,
        1.1,
      );
      penalties = shootout.kicks;
      penaltyScore = shootout.score;
    }
  }

  let winner: 0 | 1 | null;
  if (score[0] !== score[1]) {
    winner = score[0] > score[1] ? 0 : 1;
  } else if (penaltyScore) {
    winner = penaltyScore[0] > penaltyScore[1] ? 0 : 1;
  } else {
    winner = null;
  }
  const totalPoss = possessionSum[0] + possessionSum[1];

  const result: MatchResult = {
    score,
    shots,
    shotsOnTarget,
    xg,
    possession: [possessionSum[0] / totalPoss, possessionSum[1] / totalPoss],
    extraTime: extraTime !== undefined,
    penalties: penalties !== undefined,
    penaltyScore,
    events,
    winner,
  };

  return { regulation, extraTime, penalties, result };
}

/** Simulate a match and return just the final result (no playback script). */
export function simulateMatch(
  squadA: Squad,
  squadB: Squad,
  config: EngineConfig = {},
): MatchResult {
  return simulateMatchScript(squadA, squadB, config).result;
}
