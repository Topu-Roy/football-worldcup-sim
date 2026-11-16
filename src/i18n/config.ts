export const locales = ["en", "de", "fr", "ja", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const languages: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  es: "Español",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

/**
 * Canonical paths that are built for the default locale only.
 * hreflang tags and the locale switcher must never advertise translations
 * of these pages because they would 404.
 */
export const SINGLE_LOCALE_PATHS: readonly string[] = [
  "/game",
  "/history",
  "/privacy",
  "/terms-and-conditions",
  // Error pages are English-only and must never advertise translated URLs.
  "/404",
  "/500",
];
