import type { Player } from "../lib/types.js";
import { HISTORICAL_SQUADS } from "./historical/index.js";
import { playerRating, playerTier } from "../lib/draft/rating.js";
import { canPlayRole, pitchSlots } from "../lib/draft/pitch.js";

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

const FORMATION_KEY = "4-3-3";

const ROMAN = ["", "I", "II", "III", "IV"];

function poolFor(codes: string[]): Player[] {
  const set = new Set(codes);
  return HISTORICAL_SQUADS.filter((s) => set.has(s.nation)).flatMap((s) => s.players);
}

function rate(p: Player): number {
  return playerRating(p);
}

/** Pick the strongest 11 from `remaining`, one per formation slot (greedy by rating). */
function buildTeam(remaining: Player[]): { players: Player[]; slots: ReturnType<typeof pitchSlots> } | null {
  const slots = pitchSlots(FORMATION_KEY);
  const used = new Set<string>();
  const picked: Player[] = [];
  for (const slot of slots) {
    let best: Player | null = null;
    let bestR = -1;
    for (const p of remaining) {
      if (used.has(p.id)) continue;
      if (!canPlayRole(p, slot.role)) continue;
      const r = rate(p);
      if (r > bestR) {
        bestR = r;
        best = p;
      }
    }
    if (!best) {
      for (const p of remaining) {
        if (used.has(p.id)) continue;
        const r = rate(p);
        if (r > bestR) {
          bestR = r;
          best = p;
        }
      }
    }
    if (!best) break;
    used.add(best.id);
    picked.push(best);
  }
  if (picked.length < 11) return null;
  return { players: picked, slots };
}

/** Build all preview slides: best XI per nation, with extra teams when a nation has too many elite/star players. */
export function buildPreviewSlides(): PreviewSlide[] {
  const slides: PreviewSlide[] = [];
  for (const n of NATIONS) {
    let remaining = poolFor(n.codes);
    const maxTeams = 3;
    for (let t = 1; t <= maxTeams; t++) {
      const team = buildTeam(remaining);
      if (!team) break;

      const players: PreviewPlayer[] = team.players.map((p, i) => ({
        name: p.name,
        rating: Math.round(rate(p)),
        tier: playerTier(p),
        jersey: p.jerseyNumber ?? i + 1,
        x: team.slots[i].x,
        y: team.slots[i].y,
      }));

      const top = [...players].sort((a, b) => b.rating - a.rating)[0];

      slides.push({
        id: `${n.label.toLowerCase().replace(/\s+/g, "-")}-${t}`,
        nation: n.label,
        team: t === 1 ? n.label : `${n.label} ${ROMAN[t]}`,
        formationKey: FORMATION_KEY,
        formationLabel: FORMATION_KEY,
        players,
        topName: top.name,
        topRating: top.rating,
      });

      const pickedIds = new Set(team.players.map((p) => p.id));
      remaining = remaining.filter((p) => !pickedIds.has(p.id));

      const qualityLeft = remaining.filter((p) => playerTier(p) !== "standard").length;
      if (t === maxTeams || remaining.length < 11 || qualityLeft < 8) break;
    }
  }
  return slides;
}
