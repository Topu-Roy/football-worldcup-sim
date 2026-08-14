/**
 * Hard-coded best possible XI (4-3-3) tournament benchmark.
 *
 * Picks the highest-rated real player in each 4-3-3 slot from the historical
 * squad data, then simulates N 4-team tournaments (user + one weak / one
 * good / one elite opponent) and reports the dream team's results.
 *
 * Usage:  bun scripts/best-team.ts [N] [weak] [good] [elite] [--md]
 */
import { writeFileSync } from "node:fs";
import { playerRating } from "../src/lib/draft/rating.js";
import { simulateMatch } from "../src/lib/matchEngine.js";
import type { Squad } from "../src/lib/types.js";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import {
  avgSquadRating,
  buildTierSquad,
  POINT_TIERS,
  simulateTournament,
} from "./formation-tournament.js";

const N = Number(process.argv[2] ?? 400);
const WEAK = Number(process.argv[3] ?? 60);
const GOOD = Number(process.argv[4] ?? 72);
const ELITE = Number(process.argv[5] ?? 85);
const WRITE_MD = process.argv.includes("--md");

const FORMATION = { GK: 1, DEF: 4, MID: 3, ATT: 3 };

/** Best possible XI: name + the squad to source it from (disambiguates players who appear in multiple squads). */
const BEST_XI: { name: string; squad: string }[] = [
  { name: "Oliver Kahn", squad: "Germany 2002" },
  { name: "Andreas Brehme", squad: "West Germany 1990" },
  { name: "Franz Beckenbauer", squad: "West Germany 1974" },
  { name: "Fabio Cannavaro", squad: "Italy 2006" },
  { name: "Cafu", squad: "Brazil 1998" },
  { name: "Lothar Matthäus", squad: "West Germany 1990" },
  { name: "Johan Cruyff", squad: "Netherlands 1974" },
  { name: "Diego Maradona", squad: "Argentina 1986" },
  { name: "Kylian Mbappé", squad: "France 2022" },
  { name: "Pelé", squad: "Brazil 1970" },
  { name: "Lionel Messi", squad: "Argentina 2014" },
];

/** Resolve the hard-coded XI to real Player records from the historical data. */
function resolveBestXI(): { player: import("../src/lib/types.js").Player; slot: string }[] {
  const slots = ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "CAM", "LW", "ST", "RW"];
  return BEST_XI.map((entry, i) => {
    const squad = HISTORICAL_SQUADS.find((s) => s.name === entry.squad);
    const player = squad?.players.find((p) => p.name === entry.name);
    if (!player) throw new Error(`Player not found: ${entry.name} (${entry.squad})`);
    return { player, slot: slots[i] };
  });
}

function buildDreamTeam(): Squad {
  const players = resolveBestXI().map(({ player, slot }) => ({
    ...player,
    assignedPosition: slot,
  }));
  return {
    id: "dream-team",
    name: "Dream Team",
    nation: "MIX",
    wcYear: 2026,
    formation: FORMATION,
    players,
    isHistorical: true,
  };
}

const dream = buildDreamTeam();

console.log("\n=== Dream Team (hard-coded best XI, 4-3-3) ===");
for (const { player, slot } of resolveBestXI()) {
  const entry = BEST_XI.find((e) => e.name === player.name)!;
  console.log(
    `  ${slot.padEnd(3)}  ${player.name.padEnd(20)} ${playerRating(player)}  (${entry.squad})`,
  );
}
console.log(`  avg OVR ${avgSquadRating(dream).toFixed(1)}`);

const opps = POINT_TIERS.map((t) =>
  buildTierSquad(`opp-${t[0]}`, `Opp-${t[0]}`, FORMATION, t),
);

// Per-opponent head-to-head averages.
console.log("\n=== Head-to-head vs each opponent tier ===");
for (const opp of opps) {
  let gf = 0;
  let ga = 0;
  let w = 0;
  let d = 0;
  let l = 0;
  for (let i = 0; i < N; i++) {
    const r = simulateMatch(dream, opp, { regulationOnly: true });
    gf += r.score[0];
    ga += r.score[1];
    if (r.winner === 0) w++;
    else if (r.winner === null) d++;
    else l++;
  }
  console.log(
    `  ${opp.name.padEnd(8)}  W${w}-D${d}-L${l}   avg ${(gf / N).toFixed(2)}–${(ga / N).toFixed(2)}   GD ${((gf - ga) / N).toFixed(1)}`,
  );
}

// Tournament aggregate.
const acc = {
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
  const r = simulateTournament(dream, opps);
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

const pct = (n: number) => `${((n / N) * 100).toFixed(0)}%`;
console.log("\n=== Tournament (vs weak/good/elite group) ===");
console.log(`  avg pts ${(acc.pts / N).toFixed(2)}   W-D-L ${(acc.won / N).toFixed(1)}-${(acc.drawn / N).toFixed(1)}-${(acc.lost / N).toFixed(1)}`);
console.log(`  avg GF ${(acc.gf / N).toFixed(2)}  GA ${(acc.ga / N).toFixed(2)}  GD ${((acc.gf - acc.ga) / N).toFixed(1)}`);
console.log(`  champion ${pct(acc.champion)} · runners-up ${pct(acc.runnersUp)} · eliminated ${pct(acc.eliminated)}`);

if (WRITE_MD) {
  const md: string[] = [
    "# Dream Team (Best Possible XI) Benchmark",
    "",
    `Hard-coded best 4-3-3 XI picked by rating from the historical squads, simulated over ${N} tournaments against a weak (${WEAK}) / good (${GOOD}) / elite (${ELITE}) group.`,
    "",
    "| Slot | Player | OVR | Squad |",
    "|---|---|---|---|",
  ];
  for (const { player, slot } of resolveBestXI()) {
    const entry = BEST_XI.find((e) => e.name === player.name)!;
    md.push(`| ${slot} | ${player.name} | ${playerRating(player)} | ${entry.squad} |`);
  }
  md.push(
    "",
    `**Avg OVR: ${avgSquadRating(dream).toFixed(1)}**`,
    "",
    "| Metric | Value |",
    "|---|---|",
    `| Avg points | ${(acc.pts / N).toFixed(2)} |`,
    `| W-D-L | ${(acc.won / N).toFixed(1)}-${(acc.drawn / N).toFixed(1)}-${(acc.lost / N).toFixed(1)} |`,
    `| Avg GF | ${(acc.gf / N).toFixed(2)} |`,
    `| Avg GA | ${(acc.ga / N).toFixed(2)} |`,
    `| Avg GD | ${((acc.gf - acc.ga) / N).toFixed(1)} |`,
    `| Champion | ${pct(acc.champion)} |`,
    `| Runners-up | ${pct(acc.runnersUp)} |`,
    `| Eliminated | ${pct(acc.eliminated)} |`,
  );
  writeFileSync("best-team.md", md.join("\n") + "\n", "utf8");
  console.log("\nWrote best-team.md");
}