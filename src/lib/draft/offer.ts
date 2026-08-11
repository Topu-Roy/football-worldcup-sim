import type { Formation, Player } from "../types.js";
import { pick, shuffle } from "../random.js";
import { draftableNations, nationYears, squadOf } from "./pool.js";
import { fits, slotsLeft, emptySlotRoles } from "./slots.js";
import { canonicalRole } from "./roles.js";

export interface Offer {
  nation: string;
  year: number;
  players: Player[];
}

interface Combo {
  nation: string;
  year: number;
}

function combosFor(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
): Combo[] {
  const roles = emptySlotRoles(formationKey, drafted);
  const canPlace = (p: Player): boolean =>
    p.positions.some((r) =>
      roles.some((role) => canonicalRole(role) === canonicalRole(r)),
    );

  const draftedNames = new Set(drafted.map((p) => p.name));
  const all = draftableNations()
    .flatMap((nation) =>
      nationYears(nation).map((year) => ({ nation, year })),
    )
    .filter(
      (c) =>
        !squadOf(c.nation, c.year).some((p) => draftedNames.has(p.name)),
    );

  const placeable = all.filter((c) => squadOf(c.nation, c.year).some(canPlace));
  const left = slotsLeft(formation, drafted);
  const byDept = all.filter((c) =>
    squadOf(c.nation, c.year).some((p) => fits(p, left)),
  );
  return placeable.length > 0 ? placeable : byDept;
}

function comboCoverage(c: Combo, roles: string[]): number {
  const covered = new Set<string>();
  for (const p of squadOf(c.nation, c.year)) {
    for (const r of p.positions) {
      const canon = canonicalRole(r);
      if (roles.some((role) => canonicalRole(role) === canon)) {
        covered.add(canon);
      }
    }
  }
  return covered.size;
}

function pickBest(combos: Combo[], roles: string[]): Combo {
  const scored = combos.map((c) => ({ c, cover: comboCoverage(c, roles) }));
  const max = Math.max(...scored.map((s) => s.cover));
  return pick(scored.filter((s) => s.cover === max)).c;
}

/** Draw a fresh offer: pick a nation/year combo that can fill open roles, preferring combos not already offered, and shuffle its players. */
export function makeOffer(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  history: Offer[] = [],
): Offer {
  const roles = emptySlotRoles(formationKey, drafted);
  const combos = combosFor(formationKey, formation, drafted);

  const fresh = combos.filter(
    (c) => !history.some((o) => o.nation === c.nation && o.year === c.year),
  );
  const usable = fresh.length > 0 ? fresh : combos;
  const chosen = pickBest(usable.length > 0 ? usable : combos, roles);

  return {
    nation: chosen.nation,
    year: chosen.year,
    players: shuffle(squadOf(chosen.nation, chosen.year)),
  };
}

/** Convenience wrapper around makeOffer that always consults the full offer history. */
export function rerollOffer(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  history: Offer[],
): Offer {
  return makeOffer(formationKey, formation, drafted, history);
}

function offerFor(nation: string, year: number): Offer {
  return { nation, year, players: shuffle(squadOf(nation, year)) };
}

/** Reroll within the same nation: pick a different, not-yet-seen year for it, or null if none qualifies. */
export function sameNationReroll(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const roles = emptySlotRoles(formationKey, drafted);
  const years = combosFor(formationKey, formation, drafted)
    .filter((c) => c.nation === current.nation)
    .filter(
      (c) =>
        c.year !== current.year &&
        !history.some((o) => o.nation === current.nation && o.year === c.year),
    );
  if (years.length === 0) return null;
  const chosen = pickBest(years, roles);
  return offerFor(chosen.nation, chosen.year);
}

/** Reroll to a different nation (any year), preferring combos not already offered; null if none qualify. */
export function newNationReroll(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const roles = emptySlotRoles(formationKey, drafted);
  const combos = combosFor(formationKey, formation, drafted).filter(
    (c) => c.nation !== current.nation,
  );
  const fresh = combos.filter(
    (c) => !history.some((o) => o.nation === c.nation && o.year === c.year),
  );
  const usable = fresh.length > 0 ? fresh : combos;
  if (usable.length === 0) return null;
  const chosen = pickBest(usable, roles);
  return offerFor(chosen.nation, chosen.year);
}