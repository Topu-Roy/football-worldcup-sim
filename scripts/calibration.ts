import { simulateMatch } from "../src/lib/matchEngine.js";
import { makeSquad } from "./fixtures.js";

const N = Number(process.argv[2] ?? 500);
const STRENGTH = Number(process.argv[3] ?? 72);
const conversionBias =
  process.argv[4] !== undefined ? Number(process.argv[4]) : undefined;
const baseShots =
  process.argv[5] !== undefined ? Number(process.argv[5]) : undefined;
const chaos =
  process.argv[6] !== undefined ? Number(process.argv[6]) : undefined;
const desperation =
  process.argv[7] !== undefined ? Number(process.argv[7]) : undefined;
const clampMax =
  process.argv[8] !== undefined ? Number(process.argv[8]) : undefined;
const historical = process.argv.includes("--historical");

const a = makeSquad("A", STRENGTH, false);
const b = makeSquad("B", STRENGTH, historical);

let totalGoals = 0;
let within1 = 0;
let within2 = 0;
let cleanSheetA = 0;
let cleanSheetB = 0;
let highScoring = 0;
let et = 0;
let pens = 0;
let shotsSum = 0;
let sotSum = 0;
let convSum = 0;
let convN = 0;
const scorelines = new Map<string, number>();

const config =
  conversionBias !== undefined ||
  baseShots !== undefined ||
  chaos !== undefined ||
  desperation !== undefined ||
  clampMax !== undefined
    ? {
        conversionBias,
        baseMaxShots: baseShots,
        chaosFactor: chaos,
        desperationScale: desperation,
        maxShotsClamp:
          clampMax !== undefined
            ? ([0, clampMax] as [number, number])
            : undefined,
      }
    : {};

for (let i = 0; i < N; i++) {
  const r = simulateMatch(a, b, config);
  // result.score is regulation + extra time; shootout goals are separate.
  const total = r.score[0] + r.score[1];
  totalGoals += total;
  shotsSum += r.shots[0] + r.shots[1];
  sotSum += r.shotsOnTarget[0] + r.shotsOnTarget[1];
  convSum += total;
  convN += r.shotsOnTarget[0] + r.shotsOnTarget[1];
  if (total > 4) highScoring++;
  if (r.extraTime) et++;
  if (r.penalties) pens++;
  if (r.score[0] === 0) cleanSheetA++;
  if (r.score[1] === 0) cleanSheetB++;
  const margin = Math.abs(r.score[0] - r.score[1]);
  if (margin <= 1) within1++;
  if (margin <= 2) within2++;
  const key = `${r.score[0]}-${r.score[1]}`;
  scorelines.set(key, (scorelines.get(key) ?? 0) + 1);
}

const avg = totalGoals / N;
const sorted = [...scorelines.entries()]
  .sort((x, y) => y[1] - x[1])
  .slice(0, 8);

console.log(
  `\n=== Calibration: ${N} sims, strength ${STRENGTH}, convBias ${conversionBias ?? "d"}, baseShots ${baseShots ?? "d"}, chaos ${chaos ?? "d"}, despr ${desperation ?? "d"}, clamp ${clampMax ?? "d"}${historical ? " (vs historical AI)" : ""} ===`,
);
console.log(`Avg shots/match: ${(shotsSum / N).toFixed(1)}     (real ~10-25)`);
console.log(`Avg SOT/match:   ${(sotSum / N).toFixed(1)}     (real ~6-10)`);
console.log(
  `Avg goals/match: ${avg.toFixed(2)}        target 2.4-2.8 (excl. shootout)`,
);
console.log(
  `Conversion:      ${((convSum / Math.max(convN, 1)) * 100).toFixed(1)}%   (real ~30-35%)`,
);
console.log(
  `Within 1 goal:   ${((within1 / N) * 100).toFixed(1)}%    target 55-65%`,
);
console.log(
  `Within 2 goals:  ${((within2 / N) * 100).toFixed(1)}%    target 70-80%`,
);
console.log(
  `Clean sheets:    ${(((cleanSheetA + cleanSheetB) / (2 * N)) * 100).toFixed(1)}%  target 25-35%`,
);
console.log(
  `>4 goals:        ${((highScoring / N) * 100).toFixed(1)}%     target <10%`,
);
console.log(
  `Extra time:      ${((et / N) * 100).toFixed(1)}%    target 20-30%`,
);
console.log(
  `Penalties:       ${((pens / N) * 100).toFixed(1)}%    target 10-15%`,
);
console.log(`Top scorelines (incl shootout):`);
for (const [key, count] of sorted) {
  console.log(`  ${key}: ${((count / N) * 100).toFixed(1)}%`);
}
