import type { Formation, Player, TeamStrengths } from "../types.js";
import { chemistryBonus } from "./chemistry.js";
import { roleNerf, slotDepartment } from "../draft/roles.js";

function applyChemistryAndForm(player: Player, bonus: number): Player {
  const chemistryMul = 1 + bonus;
  const form = player.form ?? 0;
  const { factor, keys } = roleNerf(player);
  const applyNerf = (v: number | undefined, key: string) =>
    v === undefined ? undefined : keys.has(key) ? v * factor : v;
  const withForm = (v?: number) => (v === undefined ? undefined : v + form);
  const withChemAndForm = (v?: number) =>
    v === undefined ? undefined : v * chemistryMul + form;
  return {
    ...player,
    reflexes: applyNerf(withForm(player.reflexes), "reflexes"),
    positioning: applyNerf(withForm(player.positioning), "positioning"),
    distribution: applyNerf(withForm(player.distribution), "distribution"),
    tackling: applyNerf(withForm(player.tackling), "tackling"),
    aerial: applyNerf(withForm(player.aerial), "aerial"),
    passing: applyNerf(withChemAndForm(player.passing), "passing"),
    pace: applyNerf(withForm(player.pace), "pace"),
    dribble: applyNerf(withForm(player.dribble), "dribble"),
    workRate: applyNerf(withForm(player.workRate), "workRate"),
    stamina: applyNerf(withForm(player.stamina), "stamina"),
    finishing: applyNerf(withForm(player.finishing), "finishing"),
    offBall: applyNerf(withChemAndForm(player.offBall), "offBall"),
    composure: applyNerf((player.composure ?? 0) + form, "composure"),
  };
}

export function validateFormation(
  players: Player[],
  formation: Formation,
): boolean {
  const counts: Record<string, number> = { GK: 0, DEF: 0, MID: 0, ATT: 0 };
  for (const p of players) counts[slotDepartment(p)] += 1;
  return (
    counts.GK === formation.GK &&
    counts.DEF === formation.DEF &&
    counts.MID === formation.MID &&
    counts.ATT === formation.ATT
  );
}

export function computeTeamStrengths(
  players: Player[],
  isHistorical: boolean,
): TeamStrengths {
  const bonus = chemistryBonus(players, isHistorical);
  const boosted = players.map((p) => applyChemistryAndForm(p, bonus));
  const avg = (vals: number[]) =>
    vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const byPos = (pos: string) =>
    boosted.filter((p) => slotDepartment(p) === pos);

  const gk = byPos("GK");
  const def = byPos("DEF");
  const mid = byPos("MID");
  const att = byPos("ATT");

  return {
    attack: avg(
      att.map((p) =>
        avg([p.finishing ?? 0, p.dribble ?? 0, p.pace ?? 0, p.offBall ?? 0]),
      ),
    ),
    defense: avg(
      def.map((p) => avg([p.tackling ?? 0, p.aerial ?? 0, p.pace ?? 0])),
    ),
    creativity: avg(
      mid.map((p) => avg([p.passing ?? 0, p.dribble ?? 0, p.workRate ?? 0])),
    ),
    finishing: avg(att.map((p) => p.finishing ?? 0)),
    defPassing: avg(def.map((p) => p.passing ?? 0)),
    gk: avg(
      gk.map((p) =>
        avg([p.reflexes ?? 0, p.positioning ?? 0, p.distribution ?? 0]),
      ),
    ),
    composure: {
      GK: avg(gk.map((p) => p.composure ?? 0)),
      DEF: avg(def.map((p) => p.composure ?? 0)),
      MID: avg(mid.map((p) => p.composure ?? 0)),
      ATT: avg(att.map((p) => p.composure ?? 0)),
    },
    avgStamina: avg(
      boosted.map((p) => {
        const dept = slotDepartment(p);
        return dept === "GK"
          ? 80
          : dept === "DEF"
            ? 75
            : (p.stamina ?? 70);
      }),
    ),
  };
}
