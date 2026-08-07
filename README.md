# World Cup Simulation

Draft a fantasy World Cup XI from historical semifinalist squads (1970–2026), assign roles, then run your team through a simulated knockout tournament against the real greats.

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

1. **Formation picker** — choose 4-3-3, 4-4-2, 3-5-2, or 4-2-3-1.
2. **Draft board** — 11 rounds. Each round you are offered a random nation + year roster filtered to your remaining slots. Use up to 3 rerolls (same nation, different year / different nation) before picking. Place each pick onto the pitch slot manually; best-position slots are starred. Players carry tier badges (elite / star / standard) and live chemistry updates as the squad forms.
3. **Team ready** — review the XI on the pitch, assign roles (GK, CB, FB, DM, B2B, CAM, W, ST, ...). Out-of-position play is penalized.
4. **Tournament** — your squad plus 7 historical squads in 2 round-robin groups, then a knockout bracket. Your matches are played out segment-by-segment; the rest are auto-simulated.

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

| Command | Action |
| :--- | :--- |
| `bun run dev` | Start dev server (foreground) |
| `bun run build` | Build to `./dist/` |
| `bun run preview` | Preview the build |
| `bun run lint` | ESLint + typecheck |
| `bun run typecheck` | `astro check` + `svelte-check` |
| `bun run format` | Prettier write |
| `bun scripts/validate-data.ts` | Validate squad data |
| `bun scripts/calibration.ts` | Calibration report |
