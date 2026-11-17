import type { Formation, Player, Squad, TeamStrengths } from "../types.js";
import { playerBonus } from "./chemistry.js";
import {
  effectiveDepartment,
  roleNerf,
  roleRating,
  slotDepartment,
} from "../draft/roles.js";

/** Whether this is the player's drafted XI. Older saves only carry the id. */
export function isUserSquad(squad: Squad): boolean {
  return squad.isUser === true || squad.id === "user-squad";
}

function applyChemistryAndForm(
  player: Player,
  bonus: number,
  boostAllStats: boolean,
): Player {
  const chemistryMul = 1 + bonus;
  const form = player.form ?? 0;
  const { factor, keys } = roleNerf(player);
  const applyNerf = (v: number | undefined, key: string) =>
    v === undefined ? undefined : keys.has(key) ? v * factor : v;
  const withForm = (v?: number) => (v === undefined ? undefined : v + form);
  const withChem = (v?: number) =>
    v === undefined ? undefined : v * chemistryMul + form;
  // Non-passing/offBall stats get chemistry only in all-stat mode.
  const base = boostAllStats ? withChem : withForm;
  return {
    ...player,
    reflexes: applyNerf(base(player.reflexes), "reflexes"),
    positioning: applyNerf(base(player.positioning), "positioning"),
    distribution: applyNerf(base(player.distribution), "distribution"),
    tackling: applyNerf(base(player.tackling), "tackling"),
    aerial: applyNerf(base(player.aerial), "aerial"),
    passing: applyNerf(withChem(player.passing), "passing"),
    pace: applyNerf(base(player.pace), "pace"),
    dribble: applyNerf(base(player.dribble), "dribble"),
    workRate: applyNerf(base(player.workRate), "workRate"),
    stamina: applyNerf(base(player.stamina), "stamina"),
    finishing: applyNerf(base(player.finishing), "finishing"),
    offBall: applyNerf(withChem(player.offBall), "offBall"),
    composure:
      applyNerf(base(player.composure ?? 0), "composure") ?? player.composure,
  };
}

/** Whether the players match the formation's slot counts per department. */
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

/**
 * Bake per-player chemistry bonus, out-of-position nerfs, and per-player form into each player's stats.
 * `boostAllStats` extends user chemistry to every stat (never for historical squads).
 */
export function applyTeamModifiers(
  players: Player[],
  isHistorical: boolean,
  boostAllStats = false,
): Player[] {
  return players.map((p) =>
    applyChemistryAndForm(
      p,
      playerBonus(p, players, isHistorical),
      boostAllStats && !isHistorical,
    ),
  );
}

/** Select the best-rated XI fitting the formation's per-department counts. */
export function pickXI(players: Player[], formation: Formation): Player[] {
  const byDept: Record<string, Player[]> = {
    GK: [],
    DEF: [],
    MID: [],
    ATT: [],
  };
  for (const p of players) byDept[effectiveDepartment(p)].push(p);
  const xi: Player[] = [];
  for (const dept of ["GK", "DEF", "MID", "ATT"]) {
    const need = formation[dept as keyof Formation];
    const sorted = [...byDept[dept]].sort(
      (a, b) => roleRating(b, b.bestPosition) - roleRating(a, a.bestPosition),
    );
    xi.push(...sorted.slice(0, need));
  }
  return xi;
}

/**
 * The XI that takes the pitch: a user squad is already exactly its starters,
 * while historical squads carry larger tournament rosters and need selection.
 */
export function startingXI(squad: Squad): Player[] {
  return squad.isHistorical
    ? pickXI(squad.players, squad.formation)
    : squad.players;
}

/** Derive match-facing team strength averages (attack, defense, GK, composure, stamina) from players in their effective roles. */
export function computeTeamStrengths(players: Player[]): TeamStrengths {
  const avg = (vals: number[]) =>
    vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const byPos = (pos: string) =>
    players.filter((p) => effectiveDepartment(p) === pos);
  const stat = (value: number | undefined, player: Player): number =>
    value ?? player.composure ?? 60;

  const gk = byPos("GK");
  const def = byPos("DEF");
  const mid = byPos("MID");
  const att = byPos("ATT");

  return {
    attack: avg(
      att.map((p) =>
        avg([
          stat(p.finishing, p),
          stat(p.dribble, p),
          stat(p.pace, p),
          stat(p.offBall, p),
        ]),
      ),
    ),
    defense: avg(
      def.map((p) =>
        avg([stat(p.tackling, p), stat(p.aerial, p), stat(p.pace, p)]),
      ),
    ),
    creativity: avg(
      mid.map((p) =>
        avg([stat(p.passing, p), stat(p.dribble, p), stat(p.workRate, p)]),
      ),
    ),
    finishing: avg(att.map((p) => stat(p.finishing, p))),
    defPassing: avg(def.map((p) => stat(p.passing, p))),
    gk: avg(
      gk.map((p) =>
        avg([
          stat(p.reflexes, p),
          stat(p.positioning, p),
          stat(p.distribution, p),
        ]),
      ),
    ),
    composure: {
      GK: avg(gk.map((p) => p.composure ?? 0)),
      DEF: avg(def.map((p) => p.composure ?? 0)),
      MID: avg(mid.map((p) => p.composure ?? 0)),
      ATT: avg(att.map((p) => p.composure ?? 0)),
    },
    avgStamina: avg(
      players.map((p) => {
        const dept = effectiveDepartment(p);
        return dept === "GK" ? 80 : dept === "DEF" ? 75 : (p.stamina ?? 70);
      }),
    ),
  };
}
