import type { Formation, Player } from "../types.js";
import { pick, shuffle } from "../random.js";
import { draftableNations, nationYears, squadOf } from "./pool.js";
import { fits, slotsLeft } from "./slots.js";

export interface Offer {
  nation: string;
  year: number;
  players: Player[];
}

export function makeOffer(
  formation: Formation,
  drafted: Player[],
  history: Offer[] = [],
): Offer {
  const left = slotsLeft(formation, drafted);

  const pickable = (nation: string, year: number): boolean =>
    squadOf(nation, year).some((p) => fits(p, left));

  const combos = draftableNations().flatMap((nation) =>
    nationYears(nation).map((year) => ({ nation, year })),
  );

  const fresh = combos.filter(
    (c) =>
      !history.some((o) => o.nation === c.nation && o.year === c.year) &&
      pickable(c.nation, c.year),
  );
  const usable =
    fresh.length > 0 ? fresh : combos.filter((c) => pickable(c.nation, c.year));
  const chosen = pick(usable);

  return {
    nation: chosen.nation,
    year: chosen.year,
    players: shuffle(squadOf(chosen.nation, chosen.year)),
  };
}

export function rerollOffer(
  formation: Formation,
  drafted: Player[],
  history: Offer[],
): Offer {
  return makeOffer(formation, drafted, history);
}

function offerFor(nation: string, year: number): Offer {
  return { nation, year, players: shuffle(squadOf(nation, year)) };
}

export function sameNationReroll(
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const left = slotsLeft(formation, drafted);
  const years = nationYears(current.nation).filter(
    (y) =>
      y !== current.year &&
      !history.some((o) => o.nation === current.nation && o.year === y) &&
      squadOf(current.nation, y).some((p) => fits(p, left)),
  );
  if (years.length === 0) return null;
  return offerFor(current.nation, pick(years));
}

export function newNationReroll(
  formation: Formation,
  drafted: Player[],
  current: Offer,
  history: Offer[],
): Offer | null {
  const left = slotsLeft(formation, drafted);
  const combos = draftableNations()
    .filter((n) => n !== current.nation)
    .flatMap((nation) => nationYears(nation).map((year) => ({ nation, year })));
  const pickable = (c: { nation: string; year: number }): boolean =>
    squadOf(c.nation, c.year).some((p) => fits(p, left));
  const fresh = combos.filter(
    (c) =>
      !history.some((o) => o.nation === c.nation && o.year === c.year) &&
      pickable(c),
  );
  const usable = fresh.length > 0 ? fresh : combos.filter(pickable);
  if (usable.length === 0) return null;
  const chosen = pick(usable);
  return offerFor(chosen.nation, chosen.year);
}
