import type { Locale } from "../i18n/config";
import { localizedPath } from "../i18n/t";
import { SITE_URL } from "./site";

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(
  lang: Locale,
  crumbs: Crumb[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: new URL(localizedPath(crumb.path, lang), SITE_URL).toString(),
    })),
  };
}
