/**
 * Content dates used by structured data.
 *
 * Keep these in one place so `datePublished` / `dateModified` cannot drift from
 * the dates shown to readers. Update `modified` whenever the copy changes.
 */
export const CONTENT_DATES = {
  about: { published: "2026-08-22", modified: "2026-11-17" },
  howToPlay: { published: "2026-08-22", modified: "2026-11-17" },
} as const;
