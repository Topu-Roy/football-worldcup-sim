/**
 * Shared signal for "leaving the page would discard real progress".
 *
 * The game lives in memory, so the site header must know when a draft or live
 * tournament is active. The flag is kept on <html> so Astro scripts and Svelte
 * components see the same value without a cross-bundle store.
 */
const RUN_ACTIVE_KEY = "runActive";

export function setRunActive(active: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset[RUN_ACTIVE_KEY] = active ? "true" : "false";
}

export function isRunActive(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset[RUN_ACTIVE_KEY] === "true"
  );
}

export interface NavigationGuardInput {
  href: string | null;
  active: boolean;
  target?: string | null;
  download?: boolean;
  modifier?: boolean;
  help?: boolean;
}

/**
 * True only for links that would unload the current page.
 *
 * New-tab, download, modifier-click and in-app help clicks keep the run alive,
 * so they must not be guarded.
 */
export function shouldGuardNavigation(input: NavigationGuardInput): boolean {
  if (!input.active || !input.href) return false;
  if (
    input.target === "_blank" ||
    input.download ||
    input.modifier ||
    input.help
  ) {
    return false;
  }
  if (input.href.startsWith("#")) return false;
  if (/^(mailto|tel|javascript):/i.test(input.href)) return false;

  try {
    const url = new URL(input.href, "https://myworldcupxi.com");
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
