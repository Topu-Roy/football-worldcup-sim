# Images

Screenshot library for content pages. Placeholders live in `src/assets/media/`
and are wired through `src/data/media.ts` and `src/components/media/Figure.astro`.

## Replace a screenshot

1. Capture the real UI at the target size, on the dark theme, with no personal data.
2. Save it as PNG at the same path in `src/assets/media/`.
3. Run `bun run build`.
4. Check `docs/images.md` placement table if the image purpose changes.

The import in `src/data/media.ts` stays the same while the filename and extension
stay the same. If you provide JPG or WebP, update that one import line.

Placeholders can be regenerated with:

```bash
bun scripts/gen-media-placeholders.ts --force
```

## Sizes

| ID           | File                          | Size      | Used on                              |
| ------------ | ----------------------------- | --------- | ------------------------------------ |
| `formation`  | `formation-picker.png`        | 1600×1000 | Home, how-to-play                    |
| `draft`      | `draft-board.png`             | 1600×1000 | Home, how-to-play, blog, about, game |
| `chemistry`  | `chemistry-team.png`          | 1600×1000 | Home, how-to-play, blog, game        |
| `group`      | `group-table.png`             | 1600×1000 | How-to-play                          |
| `bracket`    | `knockout-bracket.png`        | 1600×1000 | Home, game                           |
| `penalties`  | `penalty-shootout.png`        | 1600×1000 | How-to-play, blog                    |
| `result`     | `match-result.png`            | 1600×1000 | How-to-play, blog                    |
| `matchstats` | `match-stats.png`             | 1600×1000 | About, game                          |
| `squadcard`  | `squad-card.png`              | 1600×1000 | Teams                                |
| `history`    | `history-view.png`            | 1600×1000 | History                              |
| `cover`      | `blog-how-it-works-cover.png` | 1200×675  | Blog index, blog post                |

## Diagrams

Two inline SVG diagrams need no screenshots:

- `src/components/media/PoolSplit.astro` — 77 draftable + 9 AI = 86.
- `src/components/media/RatingModel.astro` — 13 attributes to one role-weighted rating.

Labels come from `diagramCopy` in `src/i18n/content/media.ts`.

## Copy rules

- Alt text describes what the UI shows and what data is visible. 8–16 words.
- Caption adds context the alt does not repeat.
- Every locale has its own alt and caption. DE/FR/JA/ES need human review.
- No stock photos, no fake UI, no text baked into a screenshot as the only copy.

## Delivery

`Figure.astro` renders `<Picture>` with AVIF, WebP and a PNG fallback. Widths are
320/640/960 for grid cards, 480/800/1200 for the cover, and 640/960/1600 for
full-width figures. Every image is lazy-loaded and has explicit dimensions.
