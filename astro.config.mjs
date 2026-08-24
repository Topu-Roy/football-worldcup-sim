// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const buildDate = new Date().toISOString();

/** @param {string} url */
function pathOf(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/** @param {string} path */
function priorityFor(path) {
  if (
    path === "/" ||
    path === "/game" ||
    path === "/teams" ||
    path === "/teams/"
  )
    return 0.9;
  if (path.startsWith("/blog")) return 0.7;
  if (
    path.startsWith("/how-to-play") ||
    path.startsWith("/about") ||
    path.startsWith("/contact")
  )
    return 0.6;
  return 0.5;
}

// https://astro.build/config
export default defineConfig({
  site: "https://elevenfantasy.com",
  output: "static",
  integrations: [
    svelte(),
    partytown(),
    sitemap({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      serialize(item) {
        const path = pathOf(item.url);
        return {
          ...item,
          lastmod: buildDate,
          changefreq: "weekly",
          priority: priorityFor(path),
        };
      },
    }),
  ],

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr", "ja", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  redirects: {
    "/terms": "/terms-and-conditions",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
