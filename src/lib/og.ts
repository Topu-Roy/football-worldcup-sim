import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import type { FontOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;

function loadFont(file: string): Buffer {
  return fs.readFileSync(
    path.join(process.cwd(), "src", "assets", "fonts", file),
  );
}

let fontsCache: FontOptions[] | undefined;

function fonts(): FontOptions[] {
  if (!fontsCache) {
    fontsCache = [
      {
        name: "Inter",
        data: loadFont("Inter-Regular.ttf"),
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: loadFont("Inter-Bold.ttf"),
        weight: 700,
        style: "normal",
      },
    ];
  }
  return fontsCache;
}

function titleSize(title: string): number {
  if (title.length <= 36) return 76;
  if (title.length <= 64) return 58;
  if (title.length <= 96) return 46;
  return 38;
}

export async function renderOgPng(title: string): Promise<Buffer> {
  const element = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: "#131313",
        backgroundImage:
          "linear-gradient(135deg, #131313 45%, #1b1030 75%, #25104a 100%)",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "16px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#3cffd0",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    color: "#3cffd0",
                    fontSize: "24px",
                    fontWeight: 700,
                    letterSpacing: "6px",
                    textTransform: "uppercase",
                  },
                  children: "World Cup Draft Simulator",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              color: "#ffffff",
              fontSize: `${titleSize(title)}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: "1050px",
            },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    color: "#949494",
                    fontSize: "28px",
                    fontWeight: 400,
                  },
                  children: "Draft historical squads. Simulate the cup.",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    color: "#3cffd0",
                    fontSize: "28px",
                    fontWeight: 700,
                  },
                  children: "Free · Browser · No download",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: fonts(),
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });

  return resvg.render().asPng();
}

export function ogSeg(localizedPath: string): string {
  const seg = localizedPath.replace(/^\/+/, "").replace(/\/+$/, "");
  return seg === "" ? "index" : seg;
}

// avoid file/dir collisions in dist: every image lives at "<seg>/index",
// only the root home page is plain "index"
export function ogFile(localizedPath: string): string {
  const seg = ogSeg(localizedPath);
  if (seg === "index") return seg;
  return `${seg}/index`;
}

/**
 * Map any page (any locale) to one of the 11 shared en OG images.
 * Team detail pages share the generic teams image.
 */
export function ogImageFor(pagePath: string): string {
  const seg = ogSeg(pagePath);
  if (seg === "index") return "/og/index.png";
  if (seg.startsWith("teams")) return "/og/teams/index.png";
  return `/og/${ogFile(pagePath)}.png`;
}
