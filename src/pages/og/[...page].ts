import type { APIRoute } from "astro";
import { defaultLocale } from "../../i18n/config";
import { meta } from "../../i18n/meta";
import { blog } from "../../i18n/content/blog";
import { ogFile, renderOgPng } from "../../lib/og";

export interface OgPageProps {
  title: string;
}

// 11 shared en-only OG images; every locale + team page reuses one of these
function buildPaths() {
  const m = meta[defaultLocale];
  const routes: [string, string][] = [
    ["/", m.home.title],
    ["/how-to-play", m.howToPlay.title],
    ["/about", m.about.title],
    ["/contact", m.contact.title],
    ["/privacy", m.privacy.title],
    ["/terms-and-conditions", m.terms.title],
    ["/history", "Match History - Your Fantasy World Cup Results"],
    ["/teams", m.teams(0).title],
    ["/blog", blog[defaultLocale].index.seoTitle],
  ];

  for (const post of blog[defaultLocale].posts) {
    routes.push([`/blog/${post.slug}`, post.title]);
  }

  return routes.map(([basePath, title]) => ({
    params: { page: `${ogFile(basePath)}.png` },
    props: { title },
  }));
}

export function getStaticPaths() {
  return buildPaths();
}

export const GET: APIRoute<OgPageProps> = async ({ props }) => {
  const png = await renderOgPng(props.title);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
