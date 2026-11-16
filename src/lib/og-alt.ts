import { meta } from "../i18n/meta";
import { blog } from "../i18n/content/blog";

const en = meta.en;

/**
 * Alt text for OG images.
 *
 * Every OG image is generated from English copy and shared by all locales, so
 * using the localized page title as alt text would describe an image that is
 * not actually served. This maps a page path to the English title baked into
 * its image.
 */
export function ogAltFor(path: string, fallback: string): string {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";

  if (clean.startsWith("/blog/")) {
    const slug = clean.slice("/blog/".length);
    return blog.en.posts.find((p) => p.slug === slug)?.title ?? en.home.title;
  }

  const byPath: Record<string, string> = {
    "/": en.home.title,
    // /game, /404 and /500 reuse the home image.
    "/game": en.home.title,
    "/404": en.home.title,
    "/500": en.home.title,
    "/about": en.about.title,
    "/how-to-play": en.howToPlay.title,
    "/contact": en.contact.title,
    "/privacy": en.privacy.title,
    "/terms-and-conditions": en.terms.title,
    "/teams": en.teams(0).title,
    "/blog": blog.en.index.seoTitle,
    "/history": "Match History — Your Fantasy World Cup Results",
  };

  return byPath[clean] ?? fallback;
}
