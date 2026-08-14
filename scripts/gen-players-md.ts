import { writeFileSync } from "node:fs";
import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import { playerRating } from "../src/lib/draft/rating.js";

const THRESHOLD = 85;

const STAT_KEYS = [
  "reflexes",
  "positioning",
  "distribution",
  "tackling",
  "aerial",
  "passing",
  "pace",
  "dribble",
  "workRate",
  "stamina",
  "finishing",
  "offBall",
  "composure",
] as const;

const LABELS: Record<string, string> = {
  reflexes: "Reflexes",
  positioning: "Positioning",
  distribution: "Distribution",
  tackling: "Tackling",
  aerial: "Aerial",
  passing: "Passing",
  pace: "Pace",
  dribble: "Dribble",
  workRate: "Work Rate",
  stamina: "Stamina",
  finishing: "Finishing",
  offBall: "Off Ball",
  composure: "Composure",
};

interface Entry {
  name: string;
  rating: number;
  elite: boolean;
  positions: string[];
  best: string;
  jersey: number | "—";
  squadName: string;
  stats: Record<string, number>;
}

const byYear = new Map<number, Map<string, Entry[]>>();

for (const squad of HISTORICAL_SQUADS) {
  for (const p of squad.players) {
    const rating = playerRating(p);
    if (rating < THRESHOLD) continue;
    const stats: Record<string, number> = {};
    for (const key of STAT_KEYS) {
      const v = p[key];
      if (typeof v === "number") stats[key] = v;
    }
    if (!byYear.has(p.wcYear)) byYear.set(p.wcYear, new Map());
    const nations = byYear.get(p.wcYear)!;
    if (!nations.has(p.nation)) nations.set(p.nation, []);
    nations.get(p.nation)!.push({
      name: p.name,
      rating,
      elite: rating >= 90,
      positions: p.positions,
      best: p.bestPosition,
      jersey: p.jerseyNumber ?? "—",
      squadName: squad.name,
      stats,
    });
  }
}

const years = [...byYear.keys()].sort((a, b) => a - b);
const total = [...byYear.values()].reduce(
  (n, m) => n + [...m.values()].reduce((a, e) => a + e.length, 0),
  0,
);

const header = [
  "Name",
  "OVR",
  "Best",
  "Positions",
  "#",
  ...STAT_KEYS.map((k) => LABELS[k]),
];

const lines: string[] = [];
lines.push("# Good players by tournament year");
lines.push("");
lines.push(`Draft pool (historical squads), rating ≥ ${THRESHOLD}.`);
lines.push(
  "**★** = elite (≥90, gold card) · no ★ = star (85–89, yellow card).",
);
lines.push("");
lines.push(`- Players listed: ${total}`);
lines.push(`- Years covered: ${years.length}`);
lines.push("");

for (const year of years) {
  const nations = byYear.get(year)!;
  const nationNames = [...nations.keys()].sort();
  const yearTotal = nationNames.reduce(
    (n, nat) => n + nations.get(nat)!.length,
    0,
  );
  lines.push(
    `## WC ${year} — ${yearTotal} player${yearTotal === 1 ? "" : "s"}`,
  );
  lines.push("");

  for (const nat of nationNames) {
    const entries = [...nations.get(nat)!].sort(
      (a, b) => b.rating - a.rating || a.name.localeCompare(b.name),
    );
    lines.push(`### ${entries[0].squadName}`);
    lines.push("");
    lines.push(`| ${header.join(" | ")} |`);
    lines.push(`| ${header.map(() => "---").join(" | ")} |`);
    for (const e of entries) {
      const row = [
        `${e.elite ? "★" : ""}${e.name}`,
        String(e.rating),
        e.best,
        e.positions.join("/"),
        String(e.jersey),
        ...STAT_KEYS.map((k) =>
          e.stats[k] !== undefined ? String(e.stats[k]) : "",
        ),
      ];
      lines.push(`| ${row.join(" | ")} |`);
    }
    lines.push("");
  }
}

writeFileSync("good-players-by-year.md", lines.join("\n"), "utf8");
console.log(`Wrote good-players-by-year.md (${lines.length} lines)`);
