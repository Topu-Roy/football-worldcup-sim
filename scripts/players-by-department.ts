/**
 * List the highest-rated players (playerRating/OVR), grouped by department.
 *
 * Covers every squad in a tournament's opponent pool: the weak group-stage
 * squads plus the historical (strong/knockout) squads. The user's drafted
 * squad is excluded because it is player-generated, not static data.
 *
 * Usage:  bun scripts/players-by-department.ts
 */
import { writeFileSync } from "node:fs";
import { GROUP_STAGE_SQUADS } from "../src/data/group-stage/index.js";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { playerRating } from "../src/lib/draft/rating.js";
import { slotDepartment } from "../src/lib/draft/roles.js";
import type { Position } from "../src/lib/types.js";

const THRESHOLD = 89;

interface Entry {
  name: string;
  rating: number;
  bestPosition: string;
  squadName: string;
  nation: string;
  wcYear: number;
}

const DEPT_ORDER: Position[] = ["GK", "DEF", "MID", "ATT"];
const DEPT_LABELS: Record<Position, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  ATT: "Attackers",
};

const allSquads = [...GROUP_STAGE_SQUADS, ...HISTORICAL_SQUADS];
const byDept = new Map<Position, Entry[]>();
for (const dept of DEPT_ORDER) byDept.set(dept, []);

let total = 0;
for (const squad of allSquads) {
  for (const p of squad.players) {
    if (playerRating(p) < THRESHOLD) continue;
    const entry: Entry = {
      name: p.name,
      rating: playerRating(p),
      bestPosition: p.bestPosition,
      squadName: squad.name,
      nation: p.nation,
      wcYear: p.wcYear,
    };
    byDept.get(slotDepartment(p))!.push(entry);
    total++;
  }
}

for (const list of byDept.values()) {
  list.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
}

const avg = (list: Entry[]) =>
  list.reduce((n, e) => n + e.rating, 0) / (list.length || 1);

const lines: string[] = [];
lines.push("# Highest-rated players by department");
lines.push("");
lines.push(
  `All squads in the tournament opponent pool (${GROUP_STAGE_SQUADS.length} group-stage + ${HISTORICAL_SQUADS.length} historical), rated by OVR (\`playerRating\`) ≥ ${THRESHOLD}.`,
);
lines.push("");
lines.push(`- Players listed: ${total}`);
lines.push("");

for (const dept of DEPT_ORDER) {
  const list = byDept.get(dept)!;
  lines.push(`## ${DEPT_LABELS[dept]} (${list.length})`);
  lines.push("");
  lines.push(`Avg OVR **${avg(list).toFixed(1)}**`);
  lines.push("");
  lines.push("| # | Name | OVR | Best | Squad | Nation | Year |");
  lines.push("|---|---|---|---|---|---|---|");
  list.forEach((e, i) => {
    lines.push(
      `| ${i + 1} | ${e.name} | ${e.rating} | ${e.bestPosition} | ${e.squadName} | ${e.nation} | ${e.wcYear} |`,
    );
  });
  lines.push("");
}

writeFileSync("top-players-by-department.md", lines.join("\n"), "utf8");

console.log(`\n=== Highest-rated players by department ===`);
for (const dept of DEPT_ORDER) {
  const list = byDept.get(dept)!;
  console.log(
    `${dept.padEnd(3)} ${String(list.length).padEnd(4)} avg ${avg(list).toFixed(1)}  top: ${list[0]?.name ?? "—"} (${list[0]?.rating ?? 0})`,
  );
}
console.log(`\nWrote top-players-by-department.md (${lines.length} lines)`);
