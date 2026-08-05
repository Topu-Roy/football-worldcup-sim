import type { Formation, Player, TeamStrengths } from './types.js';
import { clamp, formRoll } from './random.js';

export const SCALE = 20;
export const BASE_MAX_SHOTS = 3.5;
export const MAX_SHOTS_CLAMP: [number, number] = [2, 6];
export const CHAOS_FACTOR = 0.3;
export const CHEMISTRY_CAP = 0.1;
export const CHEMISTRY_CURVE: Record<number, number> = {
  2: 0.03,
  3: 0.05,
  4: 0.08,
  5: 0.1,
};

const HIGH_STAMINA_DECAY = 0.04;
const LOW_STAMINA_DECAY = 0.08;

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

function applyChemistryAndForm(player: Player, bonus: number): Player {
  const chemistryMul = 1 + bonus;
  const form = player.form ?? 0;
  const withForm = (v?: number) => (v === undefined ? undefined : v + form);
  const withChemAndForm = (v?: number) =>
    v === undefined ? undefined : v * chemistryMul + form;
  return {
    ...player,
    reflexes: withForm(player.reflexes),
    positioning: withForm(player.positioning),
    distribution: withForm(player.distribution),
    tackling: withForm(player.tackling),
    aerial: withForm(player.aerial),
    passing: withChemAndForm(player.passing),
    pace: withForm(player.pace),
    dribble: withForm(player.dribble),
    workRate: withForm(player.workRate),
    stamina: withForm(player.stamina),
    finishing: withForm(player.finishing),
    offBall: withChemAndForm(player.offBall),
    composure: (player.composure ?? 0) + form,
  };
}

export function validateFormation(players: Player[], formation: Formation): boolean {
  const counts: Record<string, number> = { GK: 0, DEF: 0, MID: 0, ATT: 0 };
  for (const p of players) counts[p.position] += 1;
  return (
    counts.GK === formation.GK &&
    counts.DEF === formation.DEF &&
    counts.MID === formation.MID &&
    counts.ATT === formation.ATT
  );
}

export function computeTeamStrengths(players: Player[], isHistorical: boolean): TeamStrengths {
  const bonus = chemistryBonus(players, isHistorical);
  const boosted = players.map((p) => applyChemistryAndForm(p, bonus));
  const avg = (vals: number[]) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
  const byPos = (pos: string) => boosted.filter((p) => p.position === pos);

  const gk = byPos('GK');
  const def = byPos('DEF');
  const mid = byPos('MID');
  const att = byPos('ATT');

  return {
    attack: avg(att.map((p) => avg([p.finishing ?? 0, p.dribble ?? 0, p.pace ?? 0, p.offBall ?? 0]))),
    defense: avg(def.map((p) => avg([p.tackling ?? 0, p.aerial ?? 0, p.pace ?? 0]))),
    creativity: avg(mid.map((p) => avg([p.passing ?? 0, p.dribble ?? 0, p.workRate ?? 0]))),
    finishing: avg(att.map((p) => p.finishing ?? 0)),
    defPassing: avg(def.map((p) => p.passing ?? 0)),
    gk: avg(gk.map((p) => avg([p.reflexes ?? 0, p.positioning ?? 0, p.distribution ?? 0]))),
    composure: {
      GK: avg(gk.map((p) => p.composure ?? 0)),
      DEF: avg(def.map((p) => p.composure ?? 0)),
      MID: avg(mid.map((p) => p.composure ?? 0)),
      ATT: avg(att.map((p) => p.composure ?? 0)),
    },
    avgStamina: avg(
      boosted.map((p) =>
        p.position === 'GK' ? 80 : p.position === 'DEF' ? 75 : p.stamina ?? 70,
      ),
    ),
  };
}

export function rollForms(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    form: p.position === 'GK' ? formRoll(12) : formRoll(5),
  }));
}

export function decayRateFor(avgStamina: number): number {
  return clamp(
    HIGH_STAMINA_DECAY + (70 - avgStamina) * ((LOW_STAMINA_DECAY - HIGH_STAMINA_DECAY) / 30),
    HIGH_STAMINA_DECAY,
    LOW_STAMINA_DECAY,
  );
}
