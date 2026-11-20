# Cloudflare Workers Deployment Plan

**Goal:** Deploy the static Astro site to Cloudflare Workers with automatic deploys on GitHub push.

**Architecture:** Build stays static (`bun run build` → `dist/`). Wrangler uploads `dist/` as Worker static assets with no Worker script. Workers Builds connects the GitHub repo and runs build + deploy on push, with previews for non-main branches.

**Spec:** Design approved in session 2026-11-20 (Workers Builds, workers.dev first, Worker name `my-world-cup-xi`, previews enabled).

## Global Constraints

- No `@astrojs/cloudflare` adapter; site is fully static.
- Worker name must equal `my-world-cup-xi` in both `wrangler.jsonc` and the Cloudflare dashboard.
- Canonical URLs and internal links use trailing slashes; keep `html_handling: "auto-trailing-slash"`.
- Custom 404 page comes from `src/pages/404.astro`.
- Do not commit automatically; bump version to `0.66.0`.

## Task 1: Wrangler configuration

- [x] Add `wrangler` devDependency (`4.165.0`).
- [x] Create `wrangler.jsonc` with `name`, `compatibility_date`, `assets.directory`, `html_handling`, `not_found_handling`.
- [x] Add `.nvmrc` (`24`) to pin the CI Node major.
- [x] Ignore `.wrangler/` and `.dev.vars*`.

## Task 2: Scripts and docs

- [x] Add `deploy` and `preview:worker` scripts to `package.json`.
- [x] Bump version to `0.66.0`.
- [x] Document local deploy, CI settings, and custom-domain follow-up in `README.md`.

## Task 3: Verify

- [x] `bun run build` succeeds and emits `dist/404.html`.
- [x] `bunx wrangler deploy --dry-run` validates config and lists assets.
- [x] Report owner-only dashboard steps.
