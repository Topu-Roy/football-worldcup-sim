import type { Player } from "../lib/types.js";
import type { Locale } from "../i18n/config";
import { HISTORICAL_SQUADS } from "./historical/index.js";
import { jerseyNumbersFor } from "../lib/jersey.js";
import {
  playerRating,
  playerTier,
  canPlayRole,
  pitchSlots,
  canonicalRole,
} from "../lib/draft.js";

export interface PreviewPlayer {
  name: string;
  rating: number;
  tier: "elite" | "star" | "standard";
  jersey: number;
  x: number;
  y: number;
}

export interface PreviewSlide {
  id: string;
  nation: string;
  team: string;
  formationKey: string;
  formationLabel: string;
  players: PreviewPlayer[];
  topName: string;
  topRating: number;
}

const NATIONS: { codes: string[]; label: string }[] = [
  { codes: ["BRA"], label: "Brazil" },
  { codes: ["ARG"], label: "Argentina" },
  { codes: ["ESP"], label: "Spain" },
  { codes: ["FRA"], label: "France" },
  { codes: ["GER", "FRG"], label: "Germany" },
];

const NATION_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    Brazil: "Brazil",
    Argentina: "Argentina",
    Spain: "Spain",
    France: "France",
    Germany: "Germany",
  },
  de: {
    Brazil: "Brasilien",
    Argentina: "Argentinien",
    Spain: "Spanien",
    France: "Frankreich",
    Germany: "Deutschland",
  },
  fr: {
    Brazil: "Brésil",
    Argentina: "Argentine",
    Spain: "Espagne",
    France: "France",
    Germany: "Allemagne",
  },
  ja: {
    Brazil: "ブラジル",
    Argentina: "アルゼンチン",
    Spain: "スペイン",
    France: "フランス",
    Germany: "ドイツ",
  },
  es: {
    Brazil: "Brasil",
    Argentina: "Argentina",
    Spain: "España",
    France: "Francia",
    Germany: "Alemania",
  },
};

const FORMATIONS = ["4-3-3", "4-2-3-1", "4-4-2", "3-5-2"];

function rate(p: Player): number {
  return playerRating(p);
}

/** All distinct real players for a nation, one entry per name (highest-rated version). */
function poolFor(codes: string[]): Player[] {
  const set = new Set(codes);
  const bestByName = new Map<string, Player>();
  for (const squad of HISTORICAL_SQUADS) {
    if (!set.has(squad.nation)) continue;
    for (const p of squad.players) {
      const prev = bestByName.get(p.name);
      if (!prev || rate(p) > rate(prev)) bestByName.set(p.name, p);
    }
  }
  return [...bestByName.values()];
}

/**
 * Pick the strongest 11 from `remaining` for a formation, placing each player in
 * their natural/best position when possible (falls back only to fill gaps).
 */
function buildTeam(
  remaining: Player[],
  formationKey: string,
): { players: Player[]; slots: ReturnType<typeof pitchSlots> } | null {
  const slots = pitchSlots(formationKey);
  const n = slots.length;
  const assigned: (Player | null)[] = new Array(n).fill(null);
  const used = new Set<string>();

  const freeSlotsFor = (p: Player): number[] => {
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      if (assigned[i]) continue;
      if (canPlayRole(p, slots[i].role)) out.push(i);
    }
    return out;
  };

  // Pass 1 - highest-rated first, into a matching slot, preferring best position.
  const byRating = [...remaining].sort((a, b) => rate(b) - rate(a));
  for (const p of byRating) {
    if (used.has(p.id)) continue;
    const cands = freeSlotsFor(p);
    if (cands.length === 0) continue;
    const bestRole = canonicalRole(p.bestPosition);
    cands.sort((i, j) => {
      const bi = canonicalRole(slots[i].role) === bestRole ? 0 : 1;
      const bj = canonicalRole(slots[j].role) === bestRole ? 0 : 1;
      return bi - bj;
    });
    const idx = cands[0];
    assigned[idx] = p;
    used.add(p.id);
  }

  // Pass 2 - fill remaining slots, but ONLY with players who can actually play
  // the role. We never place a player out of position; if a slot can't be filled
  // naturally the formation is rejected (caller tries another formation).
  for (let i = 0; i < n; i++) {
    if (assigned[i]) continue;
    let best: Player | null = null;
    let bestR = -1;
    for (const p of remaining) {
      if (used.has(p.id) || !canPlayRole(p, slots[i].role)) continue;
      const r = rate(p);
      if (r > bestR) {
        bestR = r;
        best = p;
      }
    }
    if (!best) return null;
    assigned[i] = best;
    used.add(best.id);
  }

  if (assigned.some((x) => !x)) return null;
  return { players: assigned as Player[], slots };
}

/** Score a candidate team: how many players are at their best position, total rating, and a tier-weighted penalty for any out-of-position placement (elite stars must not be sacrificed). */
function evaluate(
  remaining: Player[],
  formationKey: string,
): {
  team: ReturnType<typeof buildTeam>;
  atBest: number;
  outPenalty: number;
  total: number;
} | null {
  const team = buildTeam(remaining, formationKey);
  if (!team) return null;
  let atBest = 0;
  let outPenalty = 0;
  let total = 0;
  team.players.forEach((p, i) => {
    const role = team.slots[i].role;
    const playable = canPlayRole(p, role);
    if (canonicalRole(role) === canonicalRole(p.bestPosition)) atBest++;
    if (!playable) {
      outPenalty +=
        playerTier(p) === "elite"
          ? 60000
          : playerTier(p) === "star"
            ? 25000
            : 5000;
    }
    total += rate(p);
  });
  return { team, atBest, outPenalty, total };
}

/**
 * Build the preview slides: one best XI per nation, in the formation that keeps
 * the most players in their natural position. Kept to one team per nation so
 * the home carousel stays short (5 slides) on every screen.
 */
export function buildPreviewSlides(lang: Locale = "en"): PreviewSlide[] {
  const slides: PreviewSlide[] = [];
  for (const nat of NATIONS) {
    const remaining = poolFor(nat.codes);

    // If the pool still has a winger (best position LW/RW), force 4-3-3 so
    // wingers always land on the wing (e.g. Neymar on LW).
    const hasWinger = remaining.some(
      (p) => p.bestPosition === "LW" || p.bestPosition === "RW",
    );
    const candidateFormations = hasWinger ? ["4-3-3"] : FORMATIONS;

    let chosen: ReturnType<typeof buildTeam> = null;
    let chosenKey = candidateFormations[0];
    let bestScore = -Infinity;
    for (const fk of candidateFormations) {
      const e = evaluate(remaining, fk);
      if (!e) continue;
      const score = e.atBest * 1000 - e.outPenalty + e.total;
      if (score > bestScore) {
        bestScore = score;
        chosen = e.team;
        chosenKey = fk;
      }
    }
    if (!chosen) continue;

    const numbers = jerseyNumbersFor(chosen.players, chosenKey);
    const players: PreviewPlayer[] = chosen.players.map((p, i) => ({
      name: p.name,
      rating: Math.round(rate(p)),
      tier: playerTier(p),
      jersey: numbers.get(p.id) ?? i + 1,
      x: chosen.slots[i].x,
      y: chosen.slots[i].y,
    }));

    const top = [...players].sort((a, b) => b.rating - a.rating)[0];

    const localizedNation = NATION_LABELS[lang][nat.label] ?? nat.label;

    slides.push({
      id: nat.label.toLowerCase().replace(/\s+/g, "-"),
      nation: localizedNation,
      team: localizedNation,
      formationKey: chosenKey,
      formationLabel: chosenKey,
      players,
      topName: top.name,
      topRating: top.rating,
    });
  }
  return slides;
}
