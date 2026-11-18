# Copy Audit

Audit of user-facing copy in pages, components and translations. The goal is to remove robotic phrasing while keeping every fact, rating, name and claim.

Voice source: [content-guide.md](./content-guide.md). Patterns: humanizer checklist (not-X-but-Y, closers, aphorisms, forced triads, em dashes in prose, inflated significance, sales language, chatbot residue).

## Scope

- English source pages and UI strings.
- `de`, `fr`, `ja`, `es` translations for all edited content files.
- Single-locale pages: 404, 500, privacy, terms, history, game.
- Hardcoded game UI in Svelte and Astro components.

## High severity

| File                                   | Locales | Issue                                                                                                          | Status |
| -------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- | ------ |
| `src/i18n/content/contact.ts`          | all     | Keyword stuffing, staged fragments ("The door is open", "All are on the table"), repeated "football simulator" | Fixed  |
| `src/i18n/content/teamDetail.ts`       | all     | 50-word intro, clichés ("only tells part of the story", "heart of a fantasy World Cup"), em dashes             | Fixed  |
| `src/pages/privacy.astro`              | en      | Choppy fragments, repeated SEO phrases, unclear lines                                                          | Fixed  |
| `src/pages/terms-and-conditions.astro` | en      | Choppy fragments, repeated SEO phrases, repeated closing lines                                                 | Fixed  |

## Medium severity

| File                                                                                         | Locales | Issue                                                                               | Status |
| -------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------- | ------ |
| `src/i18n/content/about.ts`                                                                  | all     | "A match engine, not a coin flip" not-X-but-Y; misplaced Japanese contact paragraph | Fixed  |
| `src/i18n/content/teamsIndex.ts`                                                             | all     | "not just the ones with the biggest names"                                          | Fixed  |
| `src/i18n/content/blog.ts`                                                                   | all     | "There is no filler here", "Start with the draft, not the stars", "one click away"  | Fixed  |
| `src/i18n/content/home.ts`                                                                   | all     | Em dash in preview caption                                                          | Fixed  |
| `src/i18n/ui.ts`                                                                             | all     | Em dash in footer tagline                                                           | Fixed  |
| `src/i18n/meta.ts`                                                                           | all     | Keyword-heavy contact and legal descriptions                                        | Fixed  |
| `src/pages/404.astro`, `src/pages/500.astro`                                                 | en      | Em dashes, awkward error line                                                       | Fixed  |
| `src/pages/history.astro`                                                                    | en      | Em dashes, keyword repetition                                                       | Fixed  |
| `src/pages/game.astro`                                                                       | en      | Em dashes, keyword repetition                                                       | Fixed  |
| Game UI (`FormationPicker`, `ResultsView`, `TeamReadyView`, `TournamentView`, `HistoryView`) | en      | Em dashes, sales rhythm, "Chase stars, patch gaps"                                  | Fixed  |

## Translation issues

| Locale | Issue                                                                                                           | Status |
| ------ | --------------------------------------------------------------------------------------------------------------- | ------ |
| de     | `starrengetrübten Kader` (wrong word), `Mehr alte Kadern` (grammar), extra paragraphs in home/how-to-play/about | Fixed  |
| fr     | `draftz` inconsistent with `draftez`, mixed "match day"                                                         | Fixed  |
| es     | `un plantilla` (gender), `cabeza dura` (odd), mixed "soccer"                                                    | Fixed  |
| ja     | Mixed "Fantasy Football", over-fragmented sentences, "全部あり" too casual                                      | Fixed  |
| all    | "Soccer" used in de/fr/es where the local word fits                                                             | Fixed  |

Locale-specific advice that adds something useful stays. Duplicated or misplaced paragraphs were removed. The squad search labels, placeholder, empty state and result count now live in `src/i18n/ui.ts` instead of hardcoded English.

## Keep as is

- Meta title em dashes act as separators. They are not prose.
- Em dashes in code comments and data files.
- Legitimate contrasts such as "A 90-rated forward in a midfield slot is not a 90-rated player."
- Names, ratings, dates, scorelines, tournament records.

## Verification

- Grep for banned phrases and AI tells.
- Grep for em dashes outside meta titles and code.
- Meta descriptions at 160 characters or fewer.
- `npm run lint`, `bun test`, `npm run build`.
- Prettier on changed files.
