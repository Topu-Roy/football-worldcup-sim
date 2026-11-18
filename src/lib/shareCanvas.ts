import type { ShareCardData } from "./shareCard.js";
import { fitFontSize, pitchLabel, truncateToWidth } from "./shareCard.js";

export const SHARE_WIDTH = 1080;
export const SHARE_HEIGHT = 1350;

const PAD = 64;
const CONTENT_W = SHARE_WIDTH - PAD * 2;
const BODY_TOP = 414;
const BODY_BOTTOM = 1230;
const BODY_H = BODY_BOTTOM - BODY_TOP;
const LEFT_W = 420;
const COL_GAP = 28;
const PITCH_H = 600;
const TOP_CARD_H = 96;
const MINI_H = 70;
const BANNER_H = 178;

const SECONDARY = "#949494";
const INK = "#171021";

const regularFontUrl = new URL(
  "../assets/fonts/Inter-Regular.ttf",
  import.meta.url,
).href;
const boldFontUrl = new URL("../assets/fonts/Inter-Bold.ttf", import.meta.url)
  .href;

let fontPromise: Promise<void> | null = null;

const font = (weight: number, size: number): string =>
  `${weight} ${size}px ShareInter, Arial, Helvetica, sans-serif`;

const displayFont = (size: number): string =>
  `${size}px Impact, "Arial Black", sans-serif`;

const monoFont = (weight: number, size: number): string =>
  `${weight} ${size}px ui-monospace, "Courier New", monospace`;

/** Load the card fonts once. Failure falls back to the system stack. */
export function loadShareFonts(): Promise<void> {
  if (fontPromise) return fontPromise;

  fontPromise = (async () => {
    if (
      typeof document === "undefined" ||
      !document.fonts ||
      typeof FontFace === "undefined"
    )
      return;

    const faces = [
      new FontFace("ShareInter", `url(${regularFontUrl})`, { weight: "400" }),
      new FontFace("ShareInter", `url(${boldFontUrl})`, { weight: "700" }),
    ];
    const loaded = await Promise.all(faces.map((face) => face.load()));
    for (const face of loaded) document.fonts.add(face);
    await document.fonts.ready;
  })().catch(() => {
    // System fonts are an acceptable fallback; the card still renders.
  });

  return fontPromise;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function measure(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: number,
  size: number,
): number {
  ctx.font = font(weight, size);
  return ctx.measureText(text).width;
}

/** Draw text one glyph at a time so the compact mono labels keep their tracking. */
function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
): void {
  ctx.textAlign = "left";
  let cursor = x;
  for (const glyph of text) {
    ctx.fillText(glyph, cursor, y);
    cursor += ctx.measureText(glyph).width + spacing;
  }
}

function spacedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  spacing: number,
): number {
  let width = 0;
  for (const glyph of text) width += ctx.measureText(glyph).width + spacing;
  return Math.max(0, width - spacing);
}

function drawSpacedCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number,
): void {
  const width = spacedWidth(ctx, text, spacing);
  drawSpaced(ctx, text, cx - width / 2, y, spacing);
}

/** Convert a #rrggbb token to rgba so department tints can be layered. */
function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  color = "rgba(255, 255, 255, 0.1)",
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

/** Format a signed number with a true minus sign. */
function formatSigned(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `−${Math.abs(n)}`;
  return "0";
}

function drawBackground(ctx: CanvasRenderingContext2D, accent: string): void {
  const gradient = ctx.createLinearGradient(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  gradient.addColorStop(0, "#131313");
  gradient.addColorStop(0.64, "#171020");
  gradient.addColorStop(1, "#1c0e33");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);

  const glow = ctx.createRadialGradient(880, 130, 0, 880, 130, 640);
  glow.addColorStop(0, withAlpha(accent, 0.18));
  glow.addColorStop(1, withAlpha(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
}

function drawHeader(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  ctx.fillStyle = data.outcomeAccent;
  ctx.fillRect(PAD, 64, 14, 14);

  ctx.fillStyle = data.outcomeAccent;
  ctx.font = monoFont(700, 24);
  drawSpaced(ctx, "MY WORLD CUP XI", 94, 86, 5.5);

  ctx.textAlign = "right";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 18);
  ctx.fillText("TEAM SHEET", SHARE_WIDTH - PAD, 86);
  ctx.textAlign = "left";
}

function drawBanner(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  ctx.textAlign = "left";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 16);
  drawSpaced(ctx, "FINAL PLACEMENT", PAD, 132, 4);

  const titleSize = fitFontSize(
    data.outcomeTitle,
    728,
    70,
    (text, size) => {
      ctx.font = displayFont(size);
      return ctx.measureText(text).width;
    },
    46,
  );
  ctx.font = displayFont(titleSize);
  ctx.fillStyle = data.outcomeAccent;
  ctx.fillText(data.outcomeTitle, PAD, 222);

  ctx.font = monoFont(600, 17);
  ctx.fillStyle = SECONDARY;
  ctx.fillText(data.outcomeNote, PAD, 250);

  const chipText = `FORMATION ${data.formationKey}`;
  ctx.font = monoFont(600, 11);
  const chipW = ctx.measureText(chipText).width + 24;
  const chipY = 122 + BANNER_H - 28;
  roundRect(ctx, PAD, chipY, chipW, 28, 999);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#e9e9e9";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chipText, PAD + chipW / 2, chipY + 15);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  const cx = 921;
  const cy = 218;
  const radius = 70;

  ctx.font = monoFont(600, 10);
  ctx.fillStyle = SECONDARY;
  drawSpacedCentered(ctx, "TEAM RATING", cx, 132, 1.8);

  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = data.outcomeAccent;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * (data.teamRating / 100),
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius - 18, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = data.outcomeAccent;
  ctx.font = displayFont(56);
  ctx.fillText(String(data.teamRating), cx, cy - 2);
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 9);
  ctx.fillText("OVR", cx, cy + 30);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
}

function drawStats(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  const top = 318;
  const height = 76;
  line(ctx, PAD, SHARE_WIDTH - PAD, top);
  line(ctx, PAD, SHARE_WIDTH - PAD, top + height);

  const labels = ["RECORD", "GOALS F-A", "CLEAN SHEETS", "BIGGEST WIN"];
  const values = [
    `${data.stats.won}-${data.stats.drawn}-${data.stats.lost}`,
    `${data.stats.gf}-${data.stats.ga}`,
    String(data.stats.cleanSheets),
    data.biggestWinScore ?? "—",
  ];
  const colW = CONTENT_W / 4;

  labels.forEach((label, i) => {
    const colX = PAD + i * colW;
    if (i > 0) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(colX, top);
      ctx.lineTo(colX, top + height);
      ctx.stroke();
    }

    const tx = colX + (i === 0 ? 0 : 24);
    ctx.textAlign = "left";
    ctx.fillStyle = SECONDARY;
    ctx.font = monoFont(600, 12);
    ctx.fillText(label, tx, top + 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = displayFont(30);
    ctx.fillText(values[i], tx, top + 64);
  });
}

function drawPitch(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  const x = PAD;
  const y = BODY_TOP;
  const w = LEFT_W;
  const h = PITCH_H;

  ctx.save();
  roundRect(ctx, x, y, w, h, 18);
  ctx.clip();

  ctx.fillStyle = "#1d6935";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#23773e";
  for (let i = 1; i * 58 < h; i += 2) {
    ctx.fillRect(x, y + i * 58, w, 58);
  }

  ctx.strokeStyle = "rgba(226, 255, 233, 0.42)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 18, y + 18, w - 36, h - 36);

  ctx.beginPath();
  ctx.moveTo(x + 18, y + h / 2);
  ctx.lineTo(x + w - 18, y + h / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, 35, 0, Math.PI * 2);
  ctx.stroke();

  const boxW = w * 0.54;
  const boxH = h * 0.13;
  const boxX = x + (w - boxW) / 2;
  ctx.strokeRect(boxX, y + 18, boxW, boxH);
  ctx.strokeRect(boxX, y + h - 18 - boxH, boxW, boxH);

  // Marker and label sizes scale with the pitch, so a wider card keeps the
  // same visual balance instead of turning names into oversized stickers.
  const markerR = Math.max(11, Math.round(w * 0.031));
  const numberSize = Math.max(9, Math.round(w * 0.023));
  const nameSize = Math.max(11, Math.min(15, Math.round(w * 0.034)));
  const nameMaxW = w * 0.18;
  const nameGap = Math.max(3, Math.round(w * 0.01));
  const nameBaseline = (py: number, above: boolean) =>
    above
      ? py - markerR - nameGap - nameSize / 2
      : py + markerR + nameGap + nameSize / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  // Labels first: a later marker must never cover an earlier name.
  for (const player of data.players) {
    const px = x + (player.x / 100) * w;
    const py = y + (player.y / 100) * h;
    const label = truncateToWidth(
      pitchLabel(player.fullName),
      nameMaxW,
      (text) => {
        ctx.font = font(700, nameSize);
        return ctx.measureText(text).width;
      },
    );
    // The keeper sits closest to the bottom line, so keep that label above
    // the dot instead of squeezing it into the goal area.
    const nameY = nameBaseline(py, player.y >= 88);

    ctx.font = font(700, nameSize);
    ctx.lineWidth = Math.max(2, Math.round(nameSize * 0.22));
    ctx.strokeStyle = "rgba(8, 35, 18, 0.9)";
    ctx.strokeText(label, px, nameY);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, px, nameY);
  }

  for (const player of data.players) {
    const px = x + (player.x / 100) * w;
    const py = y + (player.y / 100) * h;

    ctx.beginPath();
    ctx.arc(px, py, markerR, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = player.color;
    ctx.stroke();

    ctx.font = monoFont(700, numberSize);
    ctx.fillStyle = "#131313";
    ctx.fillText(String(player.number), px, py + 1);
  }

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.restore();
}

function drawTopPlayer(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
  y: number,
): void {
  const top = [...data.players].sort((a, b) => b.rating - a.rating)[0];
  if (!top) return;

  roundRect(ctx, PAD, y, LEFT_W, TOP_CARD_H, 16);
  ctx.fillStyle = withAlpha(top.color, 0.09);
  ctx.fill();
  ctx.strokeStyle = withAlpha(top.color, 0.4);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 10);
  ctx.fillText("TOP RATED", PAD + 18, y + 23);

  ctx.fillStyle = "#ffffff";
  ctx.font = font(700, 24);
  ctx.fillText(top.name, PAD + 18, y + 51);

  ctx.fillStyle = top.color;
  ctx.font = monoFont(600, 10);
  ctx.fillText(`${top.role} · #${top.number}`, PAD + 18, y + 69);

  ctx.textAlign = "right";
  ctx.fillStyle = top.color;
  ctx.font = displayFont(38);
  ctx.fillText(String(top.rating), PAD + LEFT_W - 18, y + 62);
  ctx.textAlign = "left";
}

function drawMiniStats(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
  y: number,
): void {
  const gap = 8;
  const tileW = (LEFT_W - gap * 2) / 3;
  const labels = ["GOAL DIFF", "GOALS / GAME", "PEN WINS"];
  const values = [
    formatSigned(data.stats.gf - data.stats.ga),
    data.avgGoalsFor.toFixed(1),
    String(data.stats.penaltyWins),
  ];

  labels.forEach((label, i) => {
    const x = PAD + i * (tileW + gap);
    roundRect(ctx, x, y, tileW, MINI_H, 12);
    ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = SECONDARY;
    ctx.font = monoFont(600, 10);
    ctx.fillText(label, x + 12, y + 22);

    ctx.fillStyle = "#ffffff";
    ctx.font = displayFont(24);
    ctx.fillText(values[i], x + 12, y + 50);
  });
}

function drawRoster(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  const x = PAD + LEFT_W + COL_GAP;
  const w = CONTENT_W - LEFT_W - COL_GAP;
  const top = BODY_TOP;
  const headBottom = top + 26;
  const noX = x;
  const nameX = x + 44;
  const nameW = w - 44 - 46 - 54 - 42;
  const roleRight = x + w - 68;
  const ratingX = x + w - 46;

  ctx.textAlign = "left";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 12);
  ctx.fillText("NO.", noX, top + 18);
  ctx.fillText("PLAYER", nameX, top + 18);
  ctx.textAlign = "right";
  ctx.fillText("ROLE", roleRight, top + 18);
  ctx.fillText("OVR", x + w, top + 18);
  line(ctx, x, x + w, headBottom, "rgba(255, 255, 255, 0.14)");

  const count = data.players.length;
  if (count === 0) return;

  const rowH = (BODY_BOTTOM - headBottom) / count;
  ctx.textBaseline = "middle";

  data.players.forEach((player, i) => {
    const cy = headBottom + (i + 0.5) * rowH;

    ctx.textAlign = "left";
    ctx.fillStyle = player.color;
    ctx.font = monoFont(700, 20);
    ctx.fillText(String(player.number), noX, cy + 1);

    ctx.fillStyle = "#ffffff";
    ctx.font = font(700, 22);
    const name = truncateToWidth(player.name, nameW, (text) =>
      measure(ctx, text, 700, 22),
    );
    ctx.fillText(name, nameX, cy + 1);

    ctx.textAlign = "right";
    ctx.fillStyle = player.color;
    ctx.font = monoFont(600, 11);
    ctx.fillText(player.role, roleRight, cy + 1);

    const elite = player.rating >= 94;
    roundRect(ctx, ratingX, cy - 16, 46, 32, 8);
    ctx.fillStyle = elite
      ? withAlpha(data.outcomeAccent, 0.1)
      : "rgba(255, 255, 255, 0.02)";
    ctx.fill();
    ctx.strokeStyle = elite
      ? withAlpha(data.outcomeAccent, 0.45)
      : "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = elite ? data.outcomeAccent : "#ffffff";
    ctx.font = displayFont(20);
    ctx.fillText(String(player.rating), ratingX + 23, cy + 1);

    line(
      ctx,
      x,
      x + w,
      headBottom + (i + 1) * rowH,
      "rgba(255, 255, 255, 0.07)",
    );
  });

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
}

function drawFooter(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  line(ctx, PAD, SHARE_WIDTH - PAD, 1248, "rgba(255, 255, 255, 0.12)");

  ctx.fillStyle = data.outcomeAccent;
  ctx.font = monoFont(600, 17);
  drawSpaced(ctx, "DRAFT YOUR OWN XI", PAD, 1280, 2.6);

  ctx.textAlign = "right";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 17);
  ctx.fillText("myworldcupxi.com", SHARE_WIDTH - PAD, 1280);
  ctx.textAlign = "left";
}

/** Draw the full result card onto a 1080×1350 canvas context. */
export function drawShareCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
): void {
  ctx.clearRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  const gap = (BODY_H - PITCH_H - TOP_CARD_H - MINI_H) / 2;

  drawBackground(ctx, data.outcomeAccent);
  drawHeader(ctx, data);
  drawBanner(ctx, data);
  drawStats(ctx, data);
  drawPitch(ctx, data);
  drawTopPlayer(ctx, data, BODY_TOP + PITCH_H + gap);
  drawMiniStats(ctx, data, BODY_TOP + PITCH_H + TOP_CARD_H + gap * 2);
  drawRoster(ctx, data);
  drawFooter(ctx, data);
}

/** Render the result card to a PNG blob using the native Canvas API. */
export async function renderSharePng(data: ShareCardData): Promise<Blob> {
  await loadShareFonts();

  const canvas = document.createElement("canvas");
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is unavailable");

  drawShareCard(ctx, data);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not encode the share image"));
    }, "image/png");
  });
}

/** Download a rendered share image without a server round trip. */
export function downloadShareImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
