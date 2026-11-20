# My World Cup XI

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

| Command                             | Action                          |
| :---------------------------------- | :------------------------------ |
| `bun run dev`                       | Start dev server (foreground)   |
| `bun run build`                     | Build to `./dist/`              |
| `bun run preview`                   | Preview the build               |
| `bun run preview:worker`            | Serve `dist/` through Wrangler  |
| `bun run deploy`                    | Build and deploy to Cloudflare  |
| `bun run lint`                      | ESLint + typecheck + data check |
| `bun run typecheck`                 | `astro check` + `svelte-check`  |
| `bun test`                          | Unit and distribution tests     |
| `bun run format`                    | Prettier write                  |
| `bun scripts/validate-data.ts`      | Validate squad data             |
| `bun scripts/calibration.ts`        | Calibration report              |
| `bun scripts/simulate-runs.ts 1000` | Full-run balance report         |

## Deployment

The site is deployed as a static site on Cloudflare Workers. Wrangler uploads `dist/` as Worker static assets. There is no Worker script and no `@astrojs/cloudflare` adapter, so asset requests are served without invoking compute.

```sh
bun run build
bun run preview:worker   # serve dist/ through Wrangler locally
bun run deploy           # build and upload (run `bunx wrangler login` once)
```

Continuous deployment uses Cloudflare Workers Builds, connected to `Topu-Roy/football-worldcup-sim`:

- Pushes to `main` build and deploy to production.
- Pushes to other branches create preview URLs.
- Dashboard settings: Worker name `my-world-cup-xi` (must match `wrangler.jsonc`), build command `bun run build`, deploy command `npx wrangler deploy`, root directory `/`.
- `wrangler.jsonc` controls the asset directory, trailing-slash handling, and the custom `404.html`.

Until the custom domain is attached, the Worker is reachable at `my-world-cup-xi.topuroy143333.workers.dev`. To attach a domain later, add it under the Worker's **Settings → Domains & Routes** and update `SITE_URL` in `src/lib/site.ts` so canonical URLs and the sitemap follow.

## Game flow

1. **Formation** - pick 4-3-3, 4-4-2, 3-5-2, or 4-2-3-1. Slot counts lock the draft. Changing shape restarts the draft (confirmed).
2. **Draft** - 11 rounds: a full XI. Each round offers a random nation/year roster filtered to open slots. You get 3 rerolls for the whole draft. Players carry tier badges and live chemistry. "Reset draft" restarts the same shape at round one; "Change formation" goes back to the shape picker.
3. **Team ready** - review the XI, swap players between slots, then start. Out-of-position players are penalized.
4. **Tournament** - 4-team group (your squad + 2 weak + 1 strong historical side). Your matches play out segment by segment; the rest are pre-simulated. The top 2 advance to R16 → QF → SF → final against fresh opponents. The run auto-starts on entry, can be paused or resumed with Play, and pauses when the tab is hidden.
5. **Results** - final placement, the last scoreline, squad stats and replayable match cards (plus the final group table when eliminated in the group stage). The top Share button exports the Team Sheet card: outcome, team rating, XI, player OVRs and key stats as an image. A loss shows **Retry run** in the outcome banner: one retry with the same XI and a new draw. "Play again" starts a fresh draft with the same shape; "View history" opens `/history` in a new tab.

## Persistence

- The active game lives in memory only. A refresh or new tab starts again on the formation picker; no draft or tournament progress is restored.
- While a draft has at least one pick, or a tournament is live, in-app links and refresh ask before leaving. Formation picker and finished results do not guard. Help opens in place from the How to Play link while a run is active.
- Resetting: "Reset draft" (same shape), "Start over" / "Play again" (new run), or the header "Play" button. Actions that discard unsaved progress ask for confirmation; "Play again" after a finished run does not because the run is already saved.
- Runs are saved to `localStorage` (`wc:history:v2`, capped at 100) after each user match and listed on `/history`; partial runs are marked Incomplete and cannot be resumed. "Clear history" removes them.
- Confirmations use the in-app dialog, never `window.confirm` - see **UI conventions**.

## Match engine

- 90 minutes split into 6 × 15-minute segments, plus 2 × 15-minute extra-time segments when level.
- Possession share → Poisson shot volume → logistic on-target and conversion rolls. Score, time, stamina, composure, and GK form adjust effective stats per segment.
- Drafted XI chemistry boosts same-nation players on all stats: 2→+3%, 3→+5%, 4→+8%, 5+→+10%. Historical squads get a flat +10% to `passing` and `offBall`.
- Level after extra time goes to a best-of-5 penalty shootout with sudden death.
- Engine code and tuning constants live in `src/lib/match/` and `src/lib/team/`.

## Project structure

```
src/
  pages/               Astro routes (game, history, teams, blog, OG images)
  components/          Svelte UI (draft board, pitch, match, tournament, results)
    ConfirmDialog.astro  app-wide confirmation dialog
    StandingsTable.svelte group table for the results screen
  layouts/             Astro layout shell
  i18n/                Locale config, UI strings, page content
  lib/
    draft/             offers, rerolls, slots, roles, ratings
    team/              form rolls, chemistry, stamina, strengths
    match/             segment simulation, shots, penalties, scorer
    tournament/        groups, knockout, standings, aggregate stats
    confirmDialog.ts   promise-based confirmAction() used by every reset
    history.ts         saved tournament runs
  data/
    historical/        77 squad files, 1970–2026
    group-stage/       9 weaker opponent squads
scripts/               data validation, calibration, fixtures, balance report, player reports
```

The game has 86 teams. 77 are draftable World Cup squads from 1970 to 2026. 9 are group-stage AI opponents. The 2026 squads are real and verified. There are 1,634 player entries in total.

## UI conventions

- Colors come from tokens in `src/styles/global.css`. Use `--color-uvlight` (not `--color-uv`) for violet **text** on the dark canvas.
- Every interactive element inherits the global `:focus-visible` ring; don't remove it without providing an equivalent.
- Destructive actions must go through `confirmAction({ title, message, confirmLabel, danger })` from `src/lib/confirmDialog.ts`, which resolves `Promise<boolean>`.
- Respect `prefers-reduced-motion` for any looping or attention-seeking animation.
- The home hero carousel shows one XI per nation (5 slides); mobile shows a five-dot window, not one dot per slide.

## Other notes

- Site config, locales, redirects, and sitemap rules live in `astro.config.mjs`.
- SEO strategy, anti-spam rules, and content quality gates live in [docs/seo-strategy.md](./docs/seo-strategy.md).
- Voice, tone and copy rules live in [docs/content-guide.md](./docs/content-guide.md).
- The latest page and translation copy audit lives in [docs/copy-audit.md](./docs/copy-audit.md).
- Design tokens (canvas `#131313`, mint `#3cffd0`, ultraviolet `#5200ff`, legible violet `#b9a3ff`, type stacks) live in `src/styles/global.css`.
- Deployed domain: `https://my-world-cup-xi.topuroy143333.workers.dev` (custom domain pending).
