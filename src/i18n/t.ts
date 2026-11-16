import { getRelativeLocaleUrl } from "astro:i18n";
import {
  defaultLocale,
  isLocale,
  SINGLE_LOCALE_PATHS,
  type Locale,
} from "./config";

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

/**
 * Link to a path in the given locale, but leave single-locale paths
 * (game, history, legal) unprefixed because no localized route exists.
 */
export function linkFor(path: string, locale: Locale): string {
  // Keep any query or hash while normalising the path itself.
  const [rawPath, ...suffixParts] = path.split(/(?=[?#])/);
  const clean = (rawPath.replace(/\/+$/, "") || "/") as string;
  if (!SINGLE_LOCALE_PATHS.includes(clean)) return localizedPath(path, locale);
  // Single-locale pages are built as directory URLs. Keep the trailing slash
  // so internal links match the canonical and avoid a redirect hop.
  const suffix = suffixParts.join("");
  return `${clean === "/" ? "/" : `${clean}/`}${suffix}`;
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

/** Whether a translation of the given (raw or canonical) path actually exists. */
export function supportsPath(rawPath: string, locale: Locale): boolean {
  if (locale === defaultLocale) return true;
  let path = stripLocale(rawPath, getLocale(rawPath));
  path = path.split(/[?#]/)[0];
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  return !SINGLE_LOCALE_PATHS.includes(path);
}
