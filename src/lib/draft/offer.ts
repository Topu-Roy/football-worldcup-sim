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
