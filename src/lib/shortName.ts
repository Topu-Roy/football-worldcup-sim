/**
 * Shortens a player's display name for compact UI (e.g. pitch chips).
 *
 * Rules:
 * - Single-word names are returned unchanged.
 * - Two-word names are kept whole when short (total length <= threshold),
 *   otherwise only the last word (surname) is used.
 * - Names with more than two words keep the last two words, unless those two
 *   still exceed the threshold, in which case only the last word is used.
 *
 * Casing of the source string is preserved.
 *
 * @param name - Full player name (e.g. "Lionel Messi", "Paulo Cézar Caju").
 * @param threshold - Max total characters before a name is shortened.
 * @returns Shortened name suitable for tight layouts.
 *
 * @example
 * shortName("Lionel Messi");      // "Lionel Messi" (<= 12 chars, kept)
 * shortName("Kylian Mbappe");     // "Mbappe"
 * shortName("Eden Cole");         // "Eden Cole"
 * shortName("Paulo Cézar Caju");  // "Cézar Caju"
 */
export function shortName(name: string, threshold = 12): string {
  const words = name.trim().split(/\s+/);

  if (words.length <= 1) return name;

  if (words.length === 2) {
    return name.length <= threshold ? name : words[1];
  }

  const lastTwo = words.slice(-2).join(" ");
  return lastTwo.length <= threshold ? lastTwo : words[words.length - 1];
}
