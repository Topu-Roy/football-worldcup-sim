import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import type { Player, Squad } from "../src/lib/types.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MD_PATH = path.join(ROOT, "jersey-numbers.md");
const DATA_DIR = path.join(ROOT, "src", "data", "historical");
const IMPORT_PATH = "../../../lib/types.js";
const APPLY = process.argv.includes("--apply");

interface TeamMd {
  players: Map<string, number>;
  removed: Set<string>;
  added: Map<string, number>;
  isAddedTeam: boolean;
}

function norm(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function parseMd(): Map<string, TeamMd> {
  const teams = new Map<string, TeamMd>();
  let cur: TeamMd | null = null;
  for (const raw of fs.readFileSync(MD_PATH, "utf8").split(/\r?\n/)) {
    const h = raw.match(/^## (\w+)\s+\((\d{4})\)(?:\s+-\s+\[([^\]]+)\])?\s*$/);
    if (h) {
      const key = `${h[1]}-${h[2]}`;
      cur = { players: new Map(), removed: new Set(), added: new Map(), isAddedTeam: Boolean(h[3]) };
      teams.set(key, cur);
      continue;
    }
    if (!cur) continue;
    const added = raw.match(/^-\s+(.+?)\s+-\s+(\d+)\s+\([Aa]dded\)\s*$/);
    const num = raw.match(/^-\s+(.+?)\s+-\s+(\d+)\s*$/);
    const rm = raw.match(/^-\s+(.+?)\s+-\s+not in team\s*$/);
    if (added) {
      const n = parseInt(added[2], 10);
      cur.players.set(added[1], n);
      cur.added.set(added[1], n);
    } else if (num) {
      cur.players.set(num[1], parseInt(num[2], 10));
    } else if (rm) {
      cur.removed.add(rm[1]);
    }
  }
  return teams;
}

function fmtScalar(v: unknown): string {
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map((x) => JSON.stringify(x)).join(", ")}]`;
  if (v && typeof v === "object") {
    return `{ ${Object.entries(v as Record<string, unknown>)
      .map(([k, x]) => `${k}: ${fmtScalar(x)}`)
      .join(", ")} }`;
  }
  return String(v);
}

function fmtPlayer(p: Player): string {
  const out: string[] = ["    {"];
  for (const k of Object.keys(p)) {
    if (k === "jerseyNumber") continue;
    const val = p[k as keyof Player];
    if (val === undefined) continue;
    out.push(`      ${k}: ${fmtScalar(val)},`);
    if (k === "bestPosition" && typeof p.jerseyNumber === "number") {
      out.push(`      jerseyNumber: ${p.jerseyNumber},`);
    }
  }
  out.push("    },");
  return out.join("\n");
}

function fmtSquad(squad: Squad, constName: string): string {
  const out: string[] = [];
  out.push(`import type { Squad } from "${IMPORT_PATH}";`);
  out.push("");
  out.push(`export const ${constName}: Squad = {`);
  for (const k of ["id", "name", "nation", "wcYear", "formation", "isHistorical"] as const) {
    out.push(`  ${k}: ${fmtScalar(squad[k])},`);
  }
  out.push("  players: [");
  for (const p of squad.players) out.push(fmtPlayer(p));
  out.push("  ],");
  out.push("};");
  return out.join("\n") + "\n";
}

async function main() {
  const teams = parseMd();
  const warnings: string[] = [];
  const removedCounts = new Map<string, string[]>();
  const missingCounts = new Map<string, string[]>();
  let filesChanged = 0;
  let numbersApplied = 0;

  for (const year of fs.readdirSync(DATA_DIR).sort()) {
    const dir = path.join(DATA_DIR, year);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith(".ts") || file === "index.ts") continue;
      const full = path.join(dir, file);
      const text = fs.readFileSync(full, "utf8");
      const m = text.match(/export const (\w+): Squad = \{/);
      if (!m) {
        warnings.push(`no const in ${full}`);
        continue;
      }
      const constName = m[1];
      const mod = await import(pathToFileURL(full).href);
      const squad = mod[constName] as Squad;
      const key = `${squad.nation}-${squad.wcYear}`;
      const md = teams.get(key);
      if (!md) {
        warnings.push(`no md section for ${key}`);
        continue;
      }
      const normPlayers = new Map<string, number>();
      for (const [name, num] of md.players) normPlayers.set(norm(name), num);
      const normRemoved = new Set<string>();
      for (const name of md.removed) normRemoved.add(norm(name));
      const dataNorms = new Set(squad.players.map((p) => norm(p.name)));
      const kept: Player[] = [];
      const removed: string[] = [];
      for (const p of squad.players) {
        if (normRemoved.has(norm(p.name))) {
          removed.push(p.name);
          continue;
        }
        const num = normPlayers.get(norm(p.name));
        if (num === undefined) {
          if (md.isAddedTeam) {
            removed.push(p.name);
            continue;
          }
          warnings.push(`${key}: player '${p.name}' not in md`);
          kept.push(p);
          continue;
        }
        (p as Player & { jerseyNumber?: number }).jerseyNumber = num;
        numbersApplied++;
        kept.push(p);
      }
      const missing: string[] = [];
      for (const [name, num] of md.players) {
        if (!dataNorms.has(norm(name))) {
          missing.push(`${name} (#${num})`);
        }
      }
      if (removed.length) removedCounts.set(key, removed);
      if (missing.length) missingCounts.set(key, missing);
      squad.players = kept;
      const content = fmtSquad(squad, constName);
      if (content !== text) {
        filesChanged++;
        if (APPLY) fs.writeFileSync(full, content);
      }
    }
  }

  console.log(`Numbers applied: ${numbersApplied}`);
  console.log(`Files changed: ${filesChanged}${APPLY ? "" : " (dry run)"}`);
  if (removedCounts.size) {
    console.log("\n-- removed from data --");
    for (const [key, names] of removedCounts) console.log(`${key}: ${names.join(", ")}`);
  }
  if (missingCounts.size) {
    console.log("\n-- in md but not in data (added players -> Phase B) --");
    for (const [key, names] of missingCounts) console.log(`${key}: ${names.join("; ")}`);
  }
  if (warnings.length) {
    console.log("\n-- warnings --");
    for (const w of warnings) console.log(w);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
