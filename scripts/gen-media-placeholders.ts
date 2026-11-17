import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

interface Placeholder {
  file: string;
  width: number;
  height: number;
  label: string;
}

/**
 * Placeholder screenshots. Real captures replace these files at the same path.
 * Run with `bun scripts/gen-media-placeholders.ts --force` to overwrite.
 */
const PLACEHOLDERS: Placeholder[] = [
  {
    file: "formation-picker.png",
    width: 1600,
    height: 1000,
    label: "FORMATION PICKER",
  },
  { file: "draft-board.png", width: 1600, height: 1000, label: "DRAFT BOARD" },
  {
    file: "chemistry-team.png",
    width: 1600,
    height: 1000,
    label: "CHEMISTRY / TEAM READY",
  },
  { file: "group-table.png", width: 1600, height: 1000, label: "GROUP TABLE" },
  {
    file: "knockout-bracket.png",
    width: 1600,
    height: 1000,
    label: "KNOCKOUT BRACKET",
  },
  {
    file: "penalty-shootout.png",
    width: 1600,
    height: 1000,
    label: "PENALTY SHOOTOUT",
  },
  {
    file: "match-result.png",
    width: 1600,
    height: 1000,
    label: "MATCH RESULT",
  },
  {
    file: "match-stats.png",
    width: 1600,
    height: 1000,
    label: "LIVE MATCH STATS",
  },
  { file: "squad-card.png", width: 1600, height: 1000, label: "SQUAD CARD" },
  {
    file: "history-view.png",
    width: 1600,
    height: 1000,
    label: "MATCH HISTORY",
  },
  {
    file: "blog-how-it-works-cover.png",
    width: 1200,
    height: 675,
    label: "BLOG COVER",
  },
];

const force = process.argv.includes("--force");
const outDir = path.join(process.cwd(), "src", "assets", "media");
fs.mkdirSync(outDir, { recursive: true });

function svgFor({ file, width, height, label }: Placeholder): string {
  const scale = width / 1600;
  const titleSize = Math.round(64 * scale);
  const bodySize = Math.round(26 * scale);
  const smallSize = Math.round(20 * scale);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#131313" />
  <rect x="${20 * scale}" y="${20 * scale}" width="${width - 40 * scale}" height="${height - 40 * scale}" rx="${28 * scale}" fill="#1b1b1b" stroke="#313131" stroke-width="${3 * scale}" />
  <rect x="${80 * scale}" y="${height / 2 - 150 * scale}" width="${120 * scale}" height="${10 * scale}" fill="#3cffd0" />
  <text x="${80 * scale}" y="${height / 2 - 70 * scale}" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900">${label}</text>
  <text x="${80 * scale}" y="${height / 2 + 10 * scale}" fill="#3cffd0" font-family="Courier New, monospace" font-size="${bodySize}" font-weight="700">PLACEHOLDER — ${width} × ${height}</text>
  <text x="${80 * scale}" y="${height / 2 + 60 * scale}" fill="#949494" font-family="Helvetica, Arial, sans-serif" font-size="${smallSize}">Replace src/assets/media/${file} with a real capture.</text>
  <text x="${80 * scale}" y="${height - 90 * scale}" fill="#949494" font-family="Courier New, monospace" font-size="${smallSize}">MY WORLD CUP XI / SCREENSHOT STUDIO</text>
</svg>`;
}

let written = 0;
for (const item of PLACEHOLDERS) {
  const out = path.join(outDir, item.file);
  if (!force && fs.existsSync(out)) {
    console.log(`skip ${item.file} (exists)`);
    continue;
  }

  const png = new Resvg(svgFor(item), {
    fitTo: { mode: "width", value: item.width },
  })
    .render()
    .asPng();

  fs.writeFileSync(out, png);
  written += 1;
  console.log(`wrote ${item.file} (${png.length} bytes)`);
}

console.log(`${written} placeholder(s) written to src/assets/media`);
