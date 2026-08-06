import { HISTORICAL_SQUADS } from "../src/data/historical/index.js";
import type { Player } from "../src/lib/types.js";

const STAT_KEYS: Record<string, string[]> = {
  GK: ["reflexes", "positioning", "distribution"],
  DEF: ["tackling", "aerial", "passing", "pace"],
  MID: ["passing", "dribble", "workRate", "stamina"],
  ATT: ["finishing", "dribble", "pace", "offBall"],
};

let errors = 0;
const seenIds = new Set<string>();
const seenSquadIds = new Set<string>();

for (const squad of HISTORICAL_SQUADS) {
  const tag = `${squad.id} (${squad.name})`;
  if (seenSquadIds.has(squad.id)) {
    console.error(`DUP SQUAD ID: ${squad.id}`);
    errors++;
  }
  seenSquadIds.add(squad.id);

  if (squad.players.length !== 11) {
    console.error(`${tag}: has ${squad.players.length} players, expected 11`);
    errors++;
  }

  const counts: Record<string, number> = { GK: 0, DEF: 0, MID: 0, ATT: 0 };
  for (const p of squad.players) {
    if (seenIds.has(p.id)) {
      console.error(`${tag}: duplicate player id ${p.id}`);
      errors++;
    }
    seenIds.add(p.id);

    if (p.wcYear !== squad.wcYear) {
      console.error(
        `${tag}: ${p.name} wcYear ${p.wcYear} != squad ${squad.wcYear}`,
      );
      errors++;
    }

    counts[p.position]++;

    const required = STAT_KEYS[p.position];
    for (const key of required) {
      const v = p[key as keyof Player] as number | undefined;
      if (v === undefined) {
        console.error(`${tag}: ${p.name} (${p.position}) missing ${key}`);
        errors++;
      } else if (v < 1 || v > 99) {
        console.error(`${tag}: ${p.name} ${key}=${v} out of range 1-99`);
        errors++;
      }
    }
    if (p.composure === undefined || p.composure < 1 || p.composure > 99) {
      console.error(`${tag}: ${p.name} bad composure`);
      errors++;
    }
    if (p.position === "MID" || p.position === "ATT") {
      if (p.stamina === undefined || p.stamina < 1 || p.stamina > 99) {
        console.error(`${tag}: ${p.name} (${p.position}) bad stamina`);
        errors++;
      }
    }
  }

  const f = squad.formation;
  const ok =
    counts.GK === f.GK &&
    counts.DEF === f.DEF &&
    counts.MID === f.MID &&
    counts.ATT === f.ATT;
  if (!ok) {
    console.error(
      `${tag}: counts ${JSON.stringify(counts)} don't match formation ${JSON.stringify(f)}`,
    );
    errors++;
  }
}

console.log(`Total squads: ${HISTORICAL_SQUADS.length}`);
console.log(`Total players: ${seenIds.size}`);
if (errors === 0) {
  console.log("VALIDATION PASSED");
} else {
  console.error(`VALIDATION FAILED with ${errors} errors`);
  process.exit(1);
}
