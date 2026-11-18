# SEO Strategy

Goal: search should treat this site as a **high-value web app**, not a content site.

All copy follows [content-guide.md](./content-guide.md). Low-value copy fails the quality gate, even when the SEO is right.

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
3. Editorial pages have 1000-1200 words of original writing and follow the [content guide](./content-guide.md).
4. Sources, author and last-updated date are visible.
5. It answers a different query than existing pages.
6. A user would bookmark it.

If any answer is no, the page is not created.

## Build plan

### Weeks 1–4 - make it look like software

- Upgrade `/teams`: server-rendered, filter by nation/year/rating, compare two squads, share.
- Add `/methodology` (rating model, data sources, squad rules).
- Add `/changelog` (version + release notes, linked in footer).
- `noindex` `/history` and remove it from the sitemap.
- Expand `/game` server-rendered content: explanation, screenshots, features, FAQ.
- 2026 squads are real and verified. Keep them on SEO surfaces with the same data notes as every other squad.

### Weeks 5–8 - one flagship tool

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

- Structured data: `WebApplication` with `featureList`, `screenshot`, `softwareVersion`, `isAccessibleForFree`; `Organization` with `sameAs`; `FAQPage` only where real FAQ copy exists. No fake ratings.
- Trust: `/methodology`, `/changelog`, `/about`; state no ads, no signup, saves stay local.
- Technical: server-rendered H1 and core copy on `/game`, `/teams`, `/history`; green Core Web Vitals; sitemap with canonical quality URLs only; no indexed query-parameter or anchor-only URLs.

## Keywords

Product-first. Volumes are unverified estimates.

| Priority | Query                                                                  | Target                              |
| -------- | ---------------------------------------------------------------------- | ----------------------------------- |
| 1        | world cup draft game, world cup draft simulator, football draft game   | `/game`                             |
| 2        | world cup all time xi, best world cup xi                               | `/teams` + blog (until `/xi` ships) |
| 3        | world cup team builder, world cup squad builder                        | `/teams`, `/game`                   |
| 4        | 7a0 alternative, games like 7a0                                        | comparison post                     |
| 5        | which world cup team was the best, what formation did brazil 1970 play | FAQ blocks on `/teams`, blog        |

### Page keyword map

| Page                 | Primary                                     | Secondary                                          | Long-tail and questions                                                                                                                                     |
| -------------------- | ------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | world cup draft game                        | world cup draft simulator, football draft game     | draft a fantasy world cup XI, world cup dream team builder, can you make your own world cup team                                                            |
| `/game`              | world cup draft game                        | world cup simulator game, football draft simulator | draft historical world cup squads, world cup draft game no download, how does the world cup draft work                                                      |
| `/teams`             | world cup team builder                      | world cup squads, world cup squad ratings          | brazil 1970 squad, netherlands 1974 squad, argentina 1986 squad, france 1998 squad, which world cup squad was the best, what formation did brazil 1970 play |
| `/how-to-play`       | how to play world cup draft game            | world cup draft rules, world cup simulator rules   | how does the world cup group stage work, how do penalty shootouts work, how to build a world cup fantasy team                                               |
| `/about`             | what is my world cup xi                     | world cup draft game, is my world cup xi free      | how are player ratings calculated, is my world cup xi affiliated with fifa                                                                                  |
| `/blog`              | world cup draft guide                       | world cup simulator tips                           | how to scout a world cup squad, world cup draft mistakes                                                                                                    |
| `/blog/how-it-works` | how does the world cup draft simulator work | world cup draft strategy                           | world cup draft chemistry, world cup draft rerolls, world cup simulator 2026                                                                                |

Every locale is written for that language, not machine-translated. Do not target 2030 until the product supports it.

## Measure

- A few URLs with rising impressions and clicks, not hundreds with zero.
- `/game` and `/xi` ranking for product terms.
- Brand and direct traffic growing.
- Links and mentions from football communities.

## Implemented (17 November 2026)

- `/history` is `noindex` and excluded from the sitemap. It shows local, personalized runs.
- One `WebApplication` entity on `/game` (`#app`). Home no longer declares a second copy.
- `Article` and `BlogPosting` schema carry author, image and dates.
- Breadcrumb names are localized. OG alt text describes the English image that is served.
- `Organization.logo` uses `public/logo-512.png` (generated by `scripts/gen-logo.ts`). `sameAs` is still open.
- Content pages carry a shared screenshot library (`src/assets/media/`, `Figure.astro`) with localized alt and caption copy. See [images.md](./images.md).

## Notes

- No paid keyword tool was available; volumes are relative only.
- Head terms (`world cup draft game`, `world cup simulator`) are highly contested. Enter them only after the tools earn authority.
- Links are required. Great pages alone will not rank on a new domain.
