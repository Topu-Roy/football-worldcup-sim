import { writeFileSync } from "node:fs";
import { GROUP_STAGE_SQUADS } from "../src/data/group-stage/index.js";
import { playerRating } from "../src/lib/draft/rating.js";

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

const lines: string[] = [];
let total = 0;

const squads = [...GROUP_STAGE_SQUADS].sort(
  (a, b) => a.wcYear - b.wcYear || a.nation.localeCompare(b.nation),
);

for (const squad of squads) {
  const players = [...squad.players].sort(
    (a, b) => playerRating(b) - playerRating(a) || a.name.localeCompare(b.name),
  );
  total += players.length;
  lines.push(`## ${squad.name}`);
  lines.push("");
  for (const p of players) {
    const stats = STAT_KEYS.filter((k) => typeof p[k] === "number")
      .map((k) => `${LABELS[k]} ${p[k]}`)
      .join(" · ");
    lines.push(`${p.name} (${playerRating(p)}) - [${p.positions.join("/")}]`);
    lines.push(`Stats: ${stats}`);
    lines.push("");
  }
}

const content = `# All player stats — group stage\n\n${lines.join("\n")}`;
writeFileSync("group-stage-teams.md", content, "utf8");
console.log(
  `Wrote group-stage-teams.md (${squads.length} squads, ${total} players)`,
);
