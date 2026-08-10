import type { TournamentMatch } from "./tournament/types.js";

/**
 * Single-letter result badge for a user match: "W" | "L" | "D" | "".
 *
 * "W"/"L" are relative to the user's side (the squad with id `userId`),
 * "D" only when the winner is null (draw), "" when the match isn't played.
 */
export function outcomeBadge(
  match: TournamentMatch,
  userId: string,
): string {
  if (!match.result) return "";
  if (match.result.winner === null) return "D";
  const userHome = match.home === userId;
  return match.result.winner === (userHome ? 0 : 1) ? "W" : "L";
}

/** Human-readable label for a result badge: "WIN" | "LOSS" | "DRAW" | "". */
export function outcomeLabel(badge: string): string {
  if (badge === "W") return "WIN";
  if (badge === "L") return "LOSS";
  if (badge === "D") return "DRAW";
  return "";
}

/** Accent color for a result badge, used for both labels and table rows. */
export function outcomeColor(badge: string): string {
  if (badge === "W") return "var(--color-mint)";
  if (badge === "L") return "var(--color-pink)";
  return "var(--color-secondary)";
}