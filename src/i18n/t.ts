import { getRelativeLocaleUrl } from "astro:i18n";
import { defaultLocale, isLocale, type Locale } from "./config";

export function getLocale(value: string | undefined): Locale {
  if (value) {
    const seg = value.split("/").filter(Boolean)[0];
    if (seg && isLocale(seg)) return seg;
  }
  return defaultLocale;
}

export function localizedPath(path: string, locale: Locale): string {
  return getRelativeLocaleUrl(locale, path);
}

export function stripLocale(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) return pathname;
  const prefix = `/${locale}`;
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const rest = pathname.slice(prefix.length);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

export function switchLocaleHref(pathname: string, target: Locale): string {
  const current = getLocale(pathname);
  return getRelativeLocaleUrl(target, stripLocale(pathname, current));
}
