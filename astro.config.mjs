// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { SITE_URL } from "./src/lib/site";
import { defaultLocale, locales } from "./src/i18n/config";

/** @param {string} url */
function pathOf(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/**
 * Canonical path without a trailing slash and without a locale prefix, so
 * `/de/teams/`, `/teams/` and `/teams` all compare as `/teams`.
 * @param {string} pathname
 */
function canonicalPath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const segments = clean.split("/").filter(Boolean);
  if (
    segments.length > 0 &&
    /** @type {readonly string[]} */ (locales).includes(segments[0])
  ) {
    segments.shift();
  }
  return `/${segments.join("/")}`;
}

/** @param {string} pathname */
function priorityFor(pathname) {
  const path = canonicalPath(pathname);
  if (path === "/" || path === "/game" || path === "/teams") return 0.9;
  if (path === "/blog" || path.startsWith("/blog/")) return 0.7;
  if (
    path === "/history" ||
    path.startsWith("/how-to-play") ||
    path.startsWith("/about") ||
    path.startsWith("/contact")
  ) {
    return 0.6;
  }
  if (path.startsWith("/privacy") || path.startsWith("/terms")) return 0.3;
  return 0.5;
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    svelte(),
    sitemap({
      /**
       * Drop pages that are intentionally noindex. `/history` shows local,
       * personalized runs and is excluded from search by design.
       * @param {string} page
       */
      filter: (page) => canonicalPath(pathOf(page)) !== "/history",
      /** @param {import("@astrojs/sitemap").SitemapItem} item */
      serialize(item) {
        return {
          ...item,
          priority: priorityFor(pathOf(item.url)),
        };
      },
    }),
  ],

  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
