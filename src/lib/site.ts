export const SITE_URL = "https://my-world-cup-xi.topuroy143333.workers.dev"; // "https://myworldcupxi.com"; - Will be updated when i buy the domain name
export const SITE_NAME = "My World Cup XI";

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
