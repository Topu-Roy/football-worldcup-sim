# Eleven Fantasy

Draft a fantasy World Cup XI from historical squads (1970–2026), then simulate a group stage and knockout run against the greats. Static site built with Astro 7, Svelte 5 (runes), Tailwind CSS 4, and TypeScript.

## Running

```sh
bun install
astro dev --background   # start the dev server in the background
astro dev status         # check if it is running
astro dev logs           # tail server output
astro dev stop           # shut it down
```

`bun run build` produces a static site in `dist/`; `bun run preview` serves it locally.

## Commands

| Command                        | Action                         |
| :----------------------------- | :----------------------------- |
| `bun run dev`                  | Start dev server (foreground)  |
| `bun run build`                | Build to `./dist/`             |
| `bun run preview`              | Preview the build              |
| `bun run lint`                 | ESLint + typecheck             |
| `bun run typecheck`            | `astro check` + `svelte-check` |
| `bun run format`               | Prettier write                 |
| `bun scripts/validate-data.ts` | Validate squad data            |
| `bun scripts/calibration.ts`   | Calibration report             |

## Game flow

1. **Formation** — pick 4-3-3, 4-4-2, 3-5-2, or 4-2-3-1. Slot counts lock the draft.
2. **Draft** — 12 rounds: 11 starters plus 1 bench spot. Each round offers a random nation/year roster filtered to open slots. Up to 3 rerolls per offer. Players carry tier badges and live chemistry.
3. **Team ready** — review the XI, swap players between slots or the bench, then start. Out-of-position players are penalized.
4. **Tournament** — 4-team group (your squad + 2 weak + 1 strong historical side). Your matches play out segment by segment; the rest are pre-simulated. Top 2 advance to R16 → QF → SF → final against fresh opponents.
5. **Results** — final placement, squad stats, replayable match cards. Losing allows "Play again" with the same squad; champions get one shot only.

## Match engine

- 90 minutes split into 6 × 15-minute segments, plus 2 × 15-minute extra-time segments when level.
- Possession share → Poisson shot volume → logistic on-target and conversion rolls. Score, time, stamina, composure, and GK form adjust effective stats per segment.
- Chemistry boosts same-nation players (`offBall` + `passing`): 2→+3%, 3→+5%, 4→+8%, 5+→+10%. Historical squads get a flat +20%.
- Level after extra time goes to a best-of-5 penalty shootout with sudden death.
- Engine code and tuning constants live in `src/lib/match/` and `src/lib/team/`.

## Project structure

```
src/
  pages/               Astro routes (game, history, teams, blog, OG images)
  components/          Svelte UI (draft board, pitch, match, tournament, results)
  layouts/             Astro layout shell
  i18n/                Locale config, UI strings, page content
  lib/
    draft/             offers, rerolls, slots, roles, ratings
    team/              form rolls, chemistry, stamina, strengths
    match/             segment simulation, shots, penalties, scorer
    tournament/        groups, knockout, standings, aggregate stats
  data/
    historical/        77 squad files, 1970–2026
    group-stage/       9 weaker opponent squads
scripts/               data validation, calibration, fixtures, OG/player reports
```

The 2026 squads are fictional/predicted rosters. There are 86 squads and 1,634 player entries in total.

## Other notes

- Site config, locales, redirects, and sitemap rules live in `astro.config.mjs`.
- Design tokens (canvas `#131313`, mint `#3cffd0`, ultraviolet `#5200ff`, type stacks) live in `src/styles/global.css`.
- Deployed domain: `https://elevenfantasy.com`.
