# World Cup Simulation

Draft a fantasy World Cup XI from historical semifinalist squads (1970–2026), then run your team through a simulated group stage and knockout tournament against the real greats.

Built with [Astro](https://astro.build), [Svelte 5](https://svelte.dev) (runes API), [Tailwind CSS 4](https://tailwindcss.com), and TypeScript.

## Running

```sh
bun install
astro dev --background   # start the dev server in the background
astro dev status         # check if it is running
astro dev logs           # tail server output
astro dev stop           # shut it down
```

`bun run build` produces a static site in `dist/`; `bun run preview` serves it locally.

## Game flow

1. **Formation picker** — choose 4-3-3, 4-4-2, 3-5-2, or 4-2-3-1. Each card shows a mini pitch preview, slot breakdown, and play-style hint.
2. **Draft board** — 12 rounds: 11 starters (one per formation slot) plus 1 bench spot. Each round you are offered a random nation + year roster filtered to your remaining slots. Use up to 3 rerolls (same nation, different year / different nation) before picking. Place each pick onto a pitch slot manually; best-position slots are starred. Players carry tier badges (elite / star / standard) and live chemistry updates as the squad forms.
3. **Team ready** — review the XI on the pitch, swap players between slots or the bench, then start. Roles come from the formation slots; playing out of position is penalized.
4. **Tournament** — your squad plus 3 opponents (2 weak draws, 1 strong historical team) in a single round-robin group. Your 3 group matches play out segment-by-segment and auto-start on entry; the rest are pre-simulated. Top 2 advance to a knockout bracket (round of 16 → quarter-final → semi-final → final) against fresh opponents.
5. **Results** — final standing, squad stats, replayable match cards. If you lose, "Play again" reruns a fresh tournament with the same team; "New draft" starts over from scratch. Champions get no rerun — one shot only.

## Project structure

```
src/
  components/          Svelte UI (DraftApp, DraftBoard, PitchView, MatchView, TournamentView, ...)
  layouts/             Astro layout shell
  pages/               index.astro — the whole app entry point
  lib/
    draft/             offers, rerolls, slots, roles, tiers, ratings
    team/              form rolls, chemistry, team strengths
    match/             segment-based match simulation + penalties
    tournament/        groups, knockout, standings, aggregate stats
  data/historical/
    1970/ ... 2026/    squad files per World Cup year
    index.ts           HISTORICAL_SQUADS export
scripts/
  validate-data.ts     checks player/squad data integrity
  calibration.ts       runs sims against concept.md targets
  fixtures.ts          synthetic squads for testing
```

The 2026 squads are fictional/predicted rosters (Spain, Argentina, England, France, Norway, Brazil, Portugal).

## Documentation

- `concept.md` — the game design and match-engine specification (formulas, tuning knobs, calibration targets).
- `DESIGN.md` — visual system: canvas `#131313`, mint `#3cffd0`, ultraviolet `#5200ff`, pill cards, mono-uppercase labels.

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
