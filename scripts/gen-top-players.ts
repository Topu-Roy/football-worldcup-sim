import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { playerRating } from "../src/lib/draft/rating.js";
import { ROLE_LABELS } from "../src/lib/draft/roles.js";
import { writeFileSync } from "node:fs";

const TOP_N = 15;
/** Positions listed with a rating floor (>= ATTACK_MIN) instead of a top-N slice. */
const FLOOR_POSITIONS = new Set(["LW", "RW", "ST", "CAM", "CM"]);
const ATTACK_MIN = 89;

interface Row {
  name: string;
  nation: string;
  year: number;
  rating: number;
}

const byPos = new Map<string, Row[]>();
let total = 0;

for (const squad of HISTORICAL_SQUADS) {
  for (const p of squad.players) {
    total++;
    const rating = playerRating(p);
    const pos = p.bestPosition;
    if (FLOOR_POSITIONS.has(pos) && rating < ATTACK_MIN) continue;
    if (!byPos.has(pos)) byPos.set(pos, []);
    byPos.get(pos)!.push({
      name: p.name,
      nation: p.nation,
      year: p.wcYear,
      rating,
    });
  }
}

let md = "# Highest-Rated Players by Position\n\n";
md += `Computed from ${HISTORICAL_SQUADS.length} historical squads (${total} player entries scanned).\n\n`;
md += `- Most positions: top ${TOP_N} by best-position rating (50–99).\n`;
md += `- Attacking/creative positions (LW, RW, ST, CAM, CM): all players rated ${ATTACK_MIN}+.\n\n`;

let listed = 0;
for (const pos of Object.keys(ROLE_LABELS)) {
  const all = (byPos.get(pos) ?? []).sort((a, b) => b.rating - a.rating);
  if (all.length === 0) continue;
  const rows = FLOOR_POSITIONS.has(pos) ? all : all.slice(0, TOP_N);

  const label = ROLE_LABELS[pos] ?? pos;
  md += `## ${label} (${pos})\n\n`;
  md += "| # | Name | Nation | Year | Rating |\n";
  md += "|---|------|--------|------|--------|\n";
  rows.forEach((r, i) => {
    listed++;
    md += `| ${i + 1} | ${r.name} | ${r.nation} | ${r.year} | ${r.rating} |\n`;
  });
  md += "\n";
}

writeFileSync(new URL("../top-players.md", import.meta.url), md);
console.log(
  `Wrote top-players.md (${byPos.size} positions, ${listed} players listed)`,
);
