export const SITE_URL = "https://elevenfantasy.com";
export const SITE_NAME = "Eleven Fantasy";

const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  ja: "ja_JP",
  es: "es_ES",
};

export function ogLocale(lang: string): string {
  return OG_LOCALES[lang] ?? lang;
}
