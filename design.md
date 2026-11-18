# Design System - My World Cup XI

Dark, high-contrast canvas. Violet/mint neon accents. Bold display type. Mono labels.

## Color tokens

Source: `src/styles/global.css`.

| Token                | Hex       | Use                                    |
| -------------------- | --------- | -------------------------------------- |
| `--color-canvas`     | `#131313` | page background                        |
| `--color-slate`      | `#2d2d2d` | card/panel surface                     |
| `--color-imageframe` | `#313131` | image frame                            |
| `--color-mint`       | `#3cffd0` | primary accent, CTA, GK dots           |
| `--color-uv`         | `#5200ff` | violet accent (backgrounds/glows only) |
| `--color-uvlight`    | `#b9a3ff` | violet text on dark canvas             |
| `--color-purplerule` | `#3d00bf` | violet rule/border                     |
| `--color-secondary`  | `#949494` | muted body text                        |
| `--color-mutedtext`  | `#e9e9e9` | soft text                              |
| `--color-linkhover`  | `#3860be` | link hover                             |
| `--color-focuscyan`  | `#1eaedb` | focus ring                             |
| `--color-yellow`     | `#ffd23c` | MID dots, warnings                     |
| `--color-pink`       | `#ff3c9e` | accent                                 |
| `--color-orange`     | `#ff8a3c` | ATT dots                               |
| `--color-blue`       | `#3c9dff` | DEF dots, links                        |

Rules:

- Use `--color-uvlight` for violet text - never `--color-uv` (it is ~2.5:1 contrast on the dark canvas).
- Use `--color-uv` only for background glows.

## Typography

| Token            | Stack                                  | Use                   |
| ---------------- | -------------------------------------- | --------------------- |
| `--font-display` | Impact, "Arial Black", sans-serif      | headings, numbers     |
| `--font-sans`    | Helvetica, Arial, sans-serif           | body                  |
| `--font-mono`    | ui-monospace, "Courier New", monospace | labels, badges, stats |

Rules:

- Mono labels: `font-mono text-[10px]/[11px] font-semibold uppercase tracking-[1.5–1.8px]`.
- Display headings: tight leading (`0.85–0.9`), tracking `~0.5px`.
- Body text uses `--color-secondary`; primary text is `#ffffff`.

## Spacing & layout

- Max content width `max-w-5xl`, page padding `px-4 sm:px-6`.
- Section vertical rhythm `py-10/14 sm:py-14/20`.

## Borders & radius

- Hairline borders: `border-white/10` (subtle), `border-white/15` (cards).
- Radius scale:
  - `rounded-full` - pills, badges
  - `rounded-3xl` - large cards, buttons
  - `rounded-2xl` - cards
  - `rounded-xl` - inner containers

## Surfaces

- `bg-slate/20`, `bg-slate/40`, `bg-slate/60` (hover), `bg-canvas/80`.
- Neon glow blobs: `bg-mint/15`, `bg-uv/20` + `blur-[100–120px]`.

## Department dot colors

| Department | Color  |
| ---------- | ------ |
| GK         | mint   |
| DEF        | blue   |
| MID        | yellow |
| ATT        | orange |

## Interaction

- Hover: `-translate-y-0.5` + `border-mint` + `bg-slate/60`, `transition-all duration-150`.
- Focus: global `:focus-visible` ring - `outline: 2px solid var(--color-focuscyan); outline-offset: 2px`. Never remove without an equivalent.
- Respect `prefers-reduced-motion` for looping or attention-seeking animation.

## Icons

- `@lucide/svelte` - Svelte components.
- `@lucide/astro` - Astro components.
