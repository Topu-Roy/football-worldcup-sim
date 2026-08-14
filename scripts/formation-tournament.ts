/**
 * Formation × strength tournament benchmark.
 *
 * For every formation (4-3-3, 4-4-2, 3-5-2, 4-2-3-1) and for each user-team
 * strength tier (weak / good / elite), simulate N 4-team tournaments. Each
 * group contains the user squad plus one weak, one good, and one elite
 * opponent (all using the tested formation). Top 2 advance to a knockout
 * final. Aggregates points, goal difference, and placement distribution to
 * show how each formation performs at each strength level.
 *
 * Usage:  bun scripts/formation-tournament.ts [N] [weak] [good] [elite] [--md]
 * --md    also write a markdown table to formation-tournament.md
 */
import { writeFileSync } from "node:fs";
import { simulateMatch } from "../src/lib/matchEngine.js";
import { playerRating } from "../src/lib/draft/rating.js";
import { FORMATIONS, type Formation, type Player, type Position } from "../src/lib/types.js";
import type { Squad } from "../src/lib/types.js";

const N = Number(process.argv[2] ?? 400);
const WEAK = Number(process.argv[3] ?? 60);
const GOOD = Number(process.argv[4] ?? 72);
const ELITE = Number(process.argv[5] ?? 85);
const WRITE_MD = process.argv.includes("--md");

/** Point tiers: [name, strength]. Band tiers: [name, min, max]. */
const TIERS: (string | number)[][] = [
  ["weak", WEAK],
  ["good", GOOD],
  ["elite", ELITE],
  ["elite90", 85, 90],
];

const ROLE_BY_DEPT: Record<Position, string> = {
  GK: "GK",
  DEF: "CB",
  MID: "CM",
  ATT: "ST",
};

/** Strength with a small deterministic-ish jitter, clamped to the 30–99 range. */
function jitter(strength: number): number {
  return Math.max(30, Math.min(99, strength + Math.floor(Math.random() * 13) - 6));
}

/** Uniform sample in [min, max], inclusive. */
function bandStat(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function makePlayer(
  id: number,
  position: Position,
  strength: number,
  min?: number,
  max?: number,
): Player {
  const stat = (s: number) =>
    min !== undefined && max !== undefined ? bandStat(min, max) : jitter(s);
  const role = ROLE_BY_DEPT[position];
  const p: Player = {
    id: `p${id}`,
    name: `P${id}`,
    nation: "TEST",
    wcYear: 2022,
    positions: [role],
    bestPosition: role,
    assignedPosition: role,
    composure: stat(strength),
  };
  switch (position) {
    case "GK":
      p.reflexes = stat(strength);
      p.positioning = stat(strength);
      p.distribution = stat(strength);
      break;
    case "DEF":
      p.tackling = stat(strength);
      p.aerial = stat(strength);
      p.passing = stat(strength);
      p.pace = stat(strength);
      break;
    case "MID":
      p.passing = stat(strength);
      p.dribble = stat(strength);
      p.workRate = stat(strength);
      p.stamina = stat(strength);
      break;
    case "ATT":
      p.finishing = stat(strength);
      p.dribble = stat(strength);
      p.pace = stat(strength);
      p.offBall = stat(strength);
      break;
  }
  return p;
}

/** Build a squad matching a formation's per-department player counts. */
export function makeFormationSquad(
  id: string,
  name: string,
  formation: Formation,
  strength: number,
  min?: number,
  max?: number,
): Squad {
  const players: Player[] = [];
  let n = 0;
  for (const [pos, count] of Object.entries(formation) as [Position, number][]) {
    for (let i = 0; i < count; i++) {
      players.push(makePlayer(n++, pos, strength, min, max));
    }
  }
  return {
    id,
    name,
    nation: "TEST",
    wcYear: 2022,
    formation,
    players,
    isHistorical: false,
  };
}

function roundRobin(teams: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) pairs.push([teams[i], teams[j]]);
  }
  return pairs;
}

interface GroupStanding {
  id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

/** Play the group, return sorted standings (points, GD, GF). */
function playGroup(squads: Record<string, Squad>, ids: string[]): GroupStanding[] {
  const table = new Map<string, GroupStanding>(
    ids.map((id) => [
      id,
      { id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
    ]),
  );
  for (const [home, away] of roundRobin(ids)) {
    const r = simulateMatch(squads[home], squads[away], { regulationOnly: true });
    const h = table.get(home)!;
    const a = table.get(away)!;
    h.played++;
    a.played++;
    h.gf += r.score[0];
    h.ga += r.score[1];
    a.gf += r.score[1];
    a.ga += r.score[0];
    if (r.score[0] > r.score[1]) {
      h.won++;
      a.lost++;
      h.points += 3;
    } else if (r.score[0] < r.score[1]) {
      a.won++;
      h.lost++;
      a.points += 3;
    } else {
      h.drawn++;
      a.drawn++;
      h.points += 1;
      a.points += 1;
    }
  }
  const gd = (s: GroupStanding) => s.gf - s.ga;
  return [...table.values()].sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    if (gd(y) !== gd(x)) return gd(y) - gd(x);
    return y.gf - x.gf;
  });
}

/** Simulate one tournament for a user squad; return the user's placement. */
export function simulateTournament(user: Squad, opps: Squad[]): {
  outcome: "champion" | "runners-up" | "eliminated";
  pts: number;
  gf: number;
  ga: number;
  won: number;
  drawn: number;
  lost: number;
} {
  const squads: Record<string, Squad> = { [user.id]: user };
  for (const o of opps) squads[o.id] = o;
  const ids = [user.id, ...opps.map((o) => o.id)];
  const group = playGroup(squads, ids);
  const userStanding = group.find((g) => g.id === user.id)!;
  const rank = group.indexOf(userStanding);

  let outcome: "champion" | "runners-up" | "eliminated";
  if (rank === 0) {
    // Knockout final always resolves a winner (ET + penalties if needed).
    const final = simulateMatch(squads[group[1].id], squads[user.id]);
    outcome = final.winner === 1 ? "champion" : "runners-up";
  } else if (rank === 1) {
    outcome = "runners-up";
  } else {
    outcome = "eliminated";
  }

  return {
    outcome,
    pts: userStanding.points,
    gf: userStanding.gf,
    ga: userStanding.ga,
    won: userStanding.won,
    drawn: userStanding.drawn,
    lost: userStanding.lost,
  };
}

interface Acc {
  pts: number;
  gf: number;
  ga: number;
  won: number;
  drawn: number;
  lost: number;
  champion: number;
  runnersUp: number;
  eliminated: number;
}

const mono = (s: string, w: number) => s.padStart(w).slice(0, w);
const pct = (n: number) => `${((n / N) * 100).toFixed(0)}%`;

/** Build a squad from a tier entry (point or band). */
export function buildTierSquad(
  id: string,
  name: string,
  formation: Formation,
  tier: (string | number)[],
): Squad {
  const [, a, b] = tier;
  return b !== undefined
    ? makeFormationSquad(id, name, formation, a as number, a as number, b as number)
    : makeFormationSquad(id, name, formation, a as number);
}

/** Mean playerRating of a squad. */
export function avgSquadRating(squad: Squad): number {
  return squad.players.length
    ? squad.players.reduce((sum, p) => sum + playerRating(p), 0) / squad.players.length
    : 0;
}

// Opponents stay the three point tiers so the group is always 4 teams;
// the elite90 band tier is added to the user tiers.
export const POINT_TIERS = TIERS.filter((t) => t.length === 2);
const USER_TIERS = TIERS;

function main() {
  const md: string[] = [
  "# Formation × Strength Tournament Benchmark",
  "",
  `Simulated ${N} tournaments per formation and strength tier. Each tournament is a 4-team group (user squad + one weak (${WEAK}), one good (${GOOD}), one elite (${ELITE}) opponent) with the top 2 advancing to a knockout final. The \`elite90\` tier is an all-85–90 rated squad (every stat in [85,90], so every player's overall rating lands 85–90).`,
  "",
  "| Formation | Tier | Rtg | Pts | W-D-L | GF | GA | GD | Champion | Runners-up | Eliminated |",
  "|---|---|---|---|---|---|---|---|---|---|---|",
];

for (const [fKey, formation] of Object.entries(FORMATIONS)) {
  console.log(`\n=== Formation ${fKey} ===`);
  console.log(
    `  tier      Rtg   pts   W-D-L       GF    GA    GD    champ  run-up  elim`,
  );
  for (const tier of USER_TIERS) {
    const [label] = tier;
    const user = buildTierSquad("user", "User", formation, tier);
    const opps = POINT_TIERS.map((t) =>
      buildTierSquad(`opp-${t[0]}`, `Opp-${t[0]}`, formation, t),
    );
    const rtg = avgSquadRating(user).toFixed(1);

    const acc: Acc = {
      pts: 0,
      gf: 0,
      ga: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      champion: 0,
      runnersUp: 0,
      eliminated: 0,
    };

    for (let i = 0; i < N; i++) {
      const r = simulateTournament(user, opps);
      acc.pts += r.pts;
      acc.gf += r.gf;
      acc.ga += r.ga;
      acc.won += r.won;
      acc.drawn += r.drawn;
      acc.lost += r.lost;
      if (r.outcome === "champion") acc.champion++;
      else if (r.outcome === "runners-up") acc.runnersUp++;
      else acc.eliminated++;
    }

    const avgPts = (acc.pts / N).toFixed(2);
    const avgGf = (acc.gf / N).toFixed(2);
    const avgGa = (acc.ga / N).toFixed(2);
    const gd = (acc.gf - acc.ga) / N;
    const wdl = `${(acc.won / N).toFixed(1)}-${(acc.drawn / N).toFixed(1)}-${(acc.lost / N).toFixed(1)}`;
    console.log(
      `  ${mono(label as string, 8)}  ${mono(rtg, 5)}  ${mono(avgPts, 6)}  ${mono(wdl, 11)}  ${mono(avgGf, 6)}  ${mono(avgGa, 6)}  ${mono(gd.toFixed(1), 5)}  ${mono(pct(acc.champion), 6)}  ${mono(pct(acc.runnersUp), 6)}  ${pct(acc.eliminated)}`,
    );
    md.push(
      `| ${fKey} | ${label} | ${rtg} | ${avgPts} | ${wdl} | ${avgGf} | ${avgGa} | ${gd.toFixed(1)} | ${pct(acc.champion)} | ${pct(acc.runnersUp)} | ${pct(acc.eliminated)} |`,
    );
  }
}

console.log(
  `\n(${N} tournaments per formation × tier; opponents = one weak(${WEAK}) / good(${GOOD}) / elite(${ELITE}) team)`,
);

if (WRITE_MD) {
  writeFileSync("formation-tournament.md", md.join("\n") + "\n", "utf8");
  console.log("Wrote formation-tournament.md");
}
}

if (import.meta.main) main();