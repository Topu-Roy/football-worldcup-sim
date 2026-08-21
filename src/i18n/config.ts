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
