# SEO Strategy

Goal: search should treat this site as a **high-value web app**, not a content site.

## Rules

**We will not publish:**

- Bulk template pages (one page per squad/year/locale, matchup matrix).
- Auto-translated pages.
- Pages that exist only to catch a keyword.
- Thin or duplicate pages.
- Indexed empty or personalized pages.

**A page ships only if all six are true:**

1. It offers something Wikipedia and Transfermarkt do not.
2. It has an interactive element (builder, simulator, comparison, filter).
3. Editorial pages have 800+ words of original writing.
4. Sources, author and last-updated date are visible.
5. It answers a different query than existing pages.
6. A user would bookmark it.

If any answer is no, the page is not created.

## Build plan

### Weeks 1–4 — make it look like software

- Upgrade `/teams`: server-rendered, filter by nation/year/rating, compare two squads, share.
- Add `/methodology` (rating model, data sources, squad rules).
- Add `/changelog` (version + release notes, linked in footer).
- `noindex` `/history` and remove it from the sitemap.
- Expand `/game` server-rendered content: explanation, screenshots, features, FAQ.
- Decide 2026: replace fictional squads with real ones, or label them as game rosters and keep them out of SEO.

### Weeks 5–8 — one flagship tool

- Build `/xi`: interactive all-time XI builder.
- Add 4 nation pages only: `/xi/brazil`, `/xi/argentina`, `/xi/germany`, `/xi/italy`.
- Publish 2 deep dives with the simulator embedded:
  - Brazil 1970 vs Argentina 1986
  - Who is the best World Cup team ever

### Weeks 9–12

- Add `/xi/france` and `/xi/england` only if the first four earn impressions.
- Publish one honest comparison: best World Cup draft games / 7a0 alternatives.
- Outreach: r/FantasyWC, football forums, Discords, Product Hunt, Show HN.

## App signals

- Structured data: `WebApplication` with `featureList`, `screenshot`, `softwareVersion`, `datePublished`, `isAccessibleForFree`; `Organization` with `sameAs`; `FAQPage` only where real FAQ copy exists. No fake ratings.
- Trust: `/methodology`, `/changelog`, `/about`; state no ads, no signup, saves stay local.
- Technical: server-rendered H1 and core copy on `/game`, `/teams`, `/history`; green Core Web Vitals; sitemap with canonical quality URLs only; no indexed query-parameter or anchor-only URLs.

## Keywords

Product-first. Volumes are unverified estimates.

| Priority | Query                                                                  | Target                              |
| -------- | ---------------------------------------------------------------------- | ----------------------------------- |
| 1        | world cup draft game, world cup draft simulator, football draft game   | `/game`                             |
| 2        | world cup all time xi, best world cup xi                               | `/xi`                               |
| 3        | world cup team builder, world cup squad builder                        | `/teams`, `/game`                   |
| 4        | 7a0 alternative, games like 7a0                                        | comparison post                     |
| 5        | which world cup team was the best, what formation did brazil 1970 play | FAQ blocks on `/xi`, `/teams`, blog |

Keep existing translations. Do not auto-translate new pages. Do not target 2030 until the product supports it.

## Measure

- A few URLs with rising impressions and clicks, not hundreds with zero.
- `/game` and `/xi` ranking for product terms.
- Brand and direct traffic growing.
- Links and mentions from football communities.

## Notes

- No paid keyword tool was available; volumes are relative only.
- Head terms (`world cup draft game`, `world cup simulator`) are highly contested. Enter them only after the tools earn authority.
- Links are required. Great pages alone will not rank on a new domain.
