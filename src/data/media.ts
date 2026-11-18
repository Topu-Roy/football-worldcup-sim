import type { ImageMetadata } from "astro";
import formation from "../assets/media/formation-picker.png";
import draft from "../assets/media/draft-board.png";
import chemistry from "../assets/media/chemistry-team.png";
import group from "../assets/media/group-table.png";
import bracket from "../assets/media/knockout-bracket.png";
import penalties from "../assets/media/penalty-shootout.png";
import result from "../assets/media/match-result.png";
import matchstats from "../assets/media/match-stats.png";
import squadcard from "../assets/media/squad-card.png";
import history from "../assets/media/history-view.png";
import cover from "../assets/media/blog-how-it-works-cover.png";

/**
 * Screenshot library. Captures come from the running app; replace a PNG at the
 * same path when the UI changes. Unused legacy entries stay listed until the
 * next content pass so the locale copy map keeps its stable keys.
 */
export const media = {
  formation,
  draft,
  chemistry,
  group,
  bracket,
  penalties,
  result,
  matchstats,
  squadcard,
  history,
  cover,
} satisfies Record<string, ImageMetadata>;

export type MediaId = keyof typeof media;
