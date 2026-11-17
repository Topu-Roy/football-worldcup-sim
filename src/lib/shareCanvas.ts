import type { ShareCardData } from "./shareCard.js";
import { fitFontSize, truncateToWidth } from "./shareCard.js";

export const SHARE_WIDTH = 1080;
export const SHARE_HEIGHT = 1350;

const PAD = 64;
const PITCH_X = 64;
const PITCH_Y = 360;
const PITCH_W = 952;
const PITCH_H = 700;
const STATS_Y = 1090;
const STATS_H = 100;
const FOOTER_Y = 1235;

const MINT = "#3cffd0";
const SECONDARY = "#949494";
const CANVAS = "#131313";

const regularFontUrl = new URL(
  "../assets/fonts/Inter-Regular.ttf",
  import.meta.url,
).href;
const boldFontUrl = new URL("../assets/fonts/Inter-Bold.ttf", import.meta.url)
  .href;

let fontPromise: Promise<void> | null = null;

const font = (weight: number, size: number): string =>
  `${weight} ${size}px ShareInter, Arial, Helvetica, sans-serif`;

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

function drawBackground(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  gradient.addColorStop(0, CANVAS);
  gradient.addColorStop(0.55, CANVAS);
  gradient.addColorStop(0.8, "#1b1030");
  gradient.addColorStop(1, "#25104a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
}

function drawHeader(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  ctx.fillStyle = MINT;
  ctx.fillRect(PAD, 64, 14, 14);

  ctx.fillStyle = MINT;
  ctx.font = font(700, 26);
  drawSpaced(ctx, "MY WORLD CUP XI", 94, 78, 5.5);

  ctx.textAlign = "right";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 18);
  ctx.fillText(`FORMATION ${data.formationKey}`, SHARE_WIDTH - PAD, 78);
}

function drawOutcome(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  ctx.textAlign = "left";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 18);
  drawSpaced(ctx, "TOURNAMENT COMPLETE", PAD, 170, 4);

  const titleSize = fitFontSize(
    data.outcomeTitle,
    SHARE_WIDTH - PAD * 2,
    112,
    (text, size) => measure(ctx, text, 700, size),
    52,
  );
  ctx.font = font(700, titleSize);
  ctx.fillStyle = data.outcomeAccent;
  ctx.fillText(data.outcomeTitle, PAD, 274);

  ctx.font = font(400, 24);
  ctx.fillStyle = SECONDARY;
  ctx.fillText(`YOUR DRAFTED XI · ${data.players.length} PLAYERS`, PAD, 318);
}

function drawPitch(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  roundRect(ctx, PITCH_X, PITCH_Y, PITCH_W, PITCH_H, 24);
  ctx.clip();

  ctx.fillStyle = "#207238";
  ctx.fillRect(PITCH_X, PITCH_Y, PITCH_W, PITCH_H);

  const stripes = 8;
  const stripeH = PITCH_H / stripes;
  ctx.fillStyle = "#278140";
  for (let i = 0; i < stripes; i += 2) {
    ctx.fillRect(PITCH_X, PITCH_Y + i * stripeH, PITCH_W, stripeH);
  }

  const inset = 30;
  const left = PITCH_X + inset;
  const top = PITCH_Y + inset;
  const right = PITCH_X + PITCH_W - inset;
  const bottom = PITCH_Y + PITCH_H - inset;
  const centerX = PITCH_X + PITCH_W / 2;
  const centerY = PITCH_Y + PITCH_H / 2;

  ctx.strokeStyle = "#7cb68d";
  ctx.fillStyle = "#7cb68d";
  ctx.lineWidth = 3;
  ctx.strokeRect(left, top, right - left, bottom - top);

  ctx.beginPath();
  ctx.moveTo(left, centerY);
  ctx.lineTo(right, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();

  const boxW = PITCH_W * 0.55;
  const boxH = PITCH_H * 0.16;
  const boxX = centerX - boxW / 2;
  ctx.strokeRect(boxX, top, boxW, boxH);
  ctx.strokeRect(boxX, bottom - boxH, boxW, boxH);

  const goalW = PITCH_W * 0.25;
  const goalH = PITCH_H * 0.06;
  const goalX = centerX - goalW / 2;
  ctx.strokeRect(goalX, top, goalW, goalH);
  ctx.strokeRect(goalX, bottom - goalH, goalW, goalH);

  ctx.beginPath();
  ctx.arc(centerX, top + boxH * 0.65, 4, 0, Math.PI * 2);
  ctx.arc(centerX, bottom - boxH * 0.65, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPlayers(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  for (const player of data.players) {
    const x = PITCH_X + (player.x / 100) * PITCH_W;
    // The keeper sits one line higher so the name and role fit inside the pitch.
    const yPercent = player.role === "GK" ? Math.min(player.y, 89) : player.y;
    const y = PITCH_Y + (yPercent / 100) * PITCH_H;

    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = player.color;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = font(700, 20);
    ctx.fillStyle = CANVAS;
    ctx.fillText(String(player.number), x, y + 1);

    ctx.textBaseline = "alphabetic";
    const nameSize = fitFontSize(
      player.name,
      170,
      24,
      (text, size) => measure(ctx, text, 700, size),
      18,
    );
    const nameY = y + 46;
    const roleY = y + 66;

    const nameText = truncateToWidth(player.name, 170, (text) =>
      measure(ctx, text, 700, nameSize),
    );
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.font = font(700, nameSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(nameText, x, nameY);

    ctx.font = monoFont(600, 15);
    ctx.fillStyle = player.color;
    ctx.fillText(player.role, x, roleY);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
}

function drawStats(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  const gap = 16;
  const tileW = (PITCH_W - gap * 3) / 4;
  const tiles = [
    {
      label: "RECORD",
      value: `${data.stats.won}-${data.stats.drawn}-${data.stats.lost}`,
    },
    { label: "GOALS", value: `${data.stats.gf}-${data.stats.ga}` },
    { label: "CLEAN SHEETS", value: String(data.stats.cleanSheets) },
    { label: "SHOOTOUT WINS", value: String(data.stats.penaltyWins) },
  ];

  tiles.forEach((tile, i) => {
    const x = PAD + i * (tileW + gap);
    roundRect(ctx, x, STATS_Y, tileW, STATS_H, 18);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.font = monoFont(600, 16);
    ctx.fillStyle = SECONDARY;
    ctx.fillText(tile.label, x + 18, STATS_Y + 34);

    ctx.font = font(700, 38);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(tile.value, x + 18, STATS_Y + 78);
  });
}

function drawFooter(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, FOOTER_Y);
  ctx.lineTo(SHARE_WIDTH - PAD, FOOTER_Y);
  ctx.stroke();

  ctx.fillStyle = MINT;
  ctx.font = monoFont(600, 18);
  drawSpaced(ctx, "DRAFT YOUR OWN XI", PAD, 1280, 3);

  ctx.textAlign = "right";
  ctx.fillStyle = SECONDARY;
  ctx.font = monoFont(600, 18);
  ctx.fillText("myworldcupxi.com", SHARE_WIDTH - PAD, 1280);
}

/** Draw the full result card onto a 1080×1350 canvas context. */
export function drawShareCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
): void {
  ctx.clearRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  ctx.textBaseline = "alphabetic";

  drawBackground(ctx);
  drawHeader(ctx, data);
  drawOutcome(ctx, data);
  drawPitch(ctx);
  drawPlayers(ctx, data);
  drawStats(ctx, data);
  drawFooter(ctx);
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
