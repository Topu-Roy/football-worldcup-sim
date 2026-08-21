// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

import partytown from "@astrojs/partytown";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [svelte(), partytown(), sitemap()],

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
