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

  const all = draftableNations().flatMap((nation) =>
    nationYears(nation).map((year) => ({ nation, year })),
  );

  const placeable = all.filter((c) => squadOf(c.nation, c.year).some(canPlace));
  const left = slotsLeft(formation, drafted);
  const byDept = all.filter((c) =>
    squadOf(c.nation, c.year).some((p) => fits(p, left)),
  );
  return placeable.length > 0 ? placeable : byDept;
}

export function makeOffer(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  history: Offer[] = [],
): Offer {
  const combos = combosFor(formationKey, formation, drafted);

  const fresh = combos.filter(
    (c) => !history.some((o) => o.nation === c.nation && o.year === c.year),
  );
  const usable = fresh.length > 0 ? fresh : combos;
  const chosen = pick(usable.length > 0 ? usable : combos);

  return {
    nation: chosen.nation,
    year: chosen.year,
    players: shuffle(squadOf(chosen.nation, chosen.year)),
  };
}

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

export function sameNationReroll(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const years = combosFor(formationKey, formation, drafted)
    .filter((c) => c.nation === current.nation)
    .map((c) => c.year)
    .filter(
      (y) =>
        y !== current.year &&
        !history.some((o) => o.nation === current.nation && o.year === y),
    );
  if (years.length === 0) return null;
  return offerFor(current.nation, pick(years));
}

export function newNationReroll(
  formationKey: string,
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const combos = combosFor(formationKey, formation, drafted).filter(
    (c) => c.nation !== current.nation,
  );
  const fresh = combos.filter(
    (c) => !history.some((o) => o.nation === c.nation && o.year === c.year),
  );
  const usable = fresh.length > 0 ? fresh : combos;
  if (usable.length === 0) return null;
  const chosen = pick(usable);
  return offerFor(chosen.nation, chosen.year);
}