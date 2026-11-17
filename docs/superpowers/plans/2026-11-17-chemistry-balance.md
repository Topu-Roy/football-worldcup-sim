# Chemistry Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise first-attempt title rate from 13.2% to ~24% by lowering historical chemistry to 10% and applying user same-nation chemistry to all stats.

**Architecture:** Mark the drafted XI with `isUser`, centralize the chemistry rules in `applyChemistryAndForm`, and pass the flag from `simulateMatchScript`. Group-stage AI squads keep the old two-stat chemistry. Add a repeatable balance report script.

**Tech Stack:** TypeScript, Bun test. No Svelte/UI changes.

**Spec:** Design approved in chat, 2026-11-17. Plan mode blocked saving a separate spec file.

## Global Constraints

- Do not commit until the owner says so. Commit only after explicit approval.
- Bump `package.json` to `0.58.0` (minor balance change).
- Update README chemistry and commands.
- Keep `applyTeamModifiers` two-argument calls working; third arg defaults to `false`.
- Do not touch draft UI, formation layout, or tournament structure.
- Follow existing naming and comment style. No auto-commit.

## Review Focus

- Group-stage squads are `isHistorical: false`; they must not get all-stat chemistry.
- Legacy saves lack `isUser`; `id: "user-squad"` fallback must work.
- Historical squads must never get all-stat chemistry, even if the flag is passed.
- Chemistry must apply once to passing/offBall, not twice.
- Out-of-position nerf must still apply after chemistry.

---

### Task 1: Mark the drafted XI

**Files:**

- Modify: `src/lib/types.ts`
- Modify: `src/lib/draft/squad.ts`
- Modify: `src/lib/team/strengths.ts`
- Modify: `src/lib/team/index.ts`
- Create: `tests/chemistry.test.ts`

**Interfaces:**

- `Squad.isUser?: boolean`
- `isUserSquad(squad: Squad): boolean`
- `buildUserSquad(formation, drafted)` sets `isUser: true`

- [ ] **Step 1: Write failing tests**

```ts
test("buildUserSquad marks the drafted XI as the user squad", () => {
  const squad = buildUserSquad(FORMATIONS["4-3-3"], elevenPlayers());
  expect(squad.isUser).toBe(true);
});

test("isUserSquad recognizes the new flag and the legacy id", () => {
  expect(isUserSquad({ ...baseSquad, id: "x", isUser: true })).toBe(true);
  expect(isUserSquad({ ...baseSquad, id: "user-squad" })).toBe(true);
  expect(isUserSquad({ ...baseSquad, id: "bra-1970" })).toBe(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/chemistry.test.ts`

Expected: FAIL — `isUserSquad` missing and `isUser` undefined.

- [ ] **Step 3: Implement**

Add `isUser?: boolean` to `Squad`. Return `isUser: true` from `buildUserSquad`. Add:

```ts
/** Whether this is the player's drafted XI. Older saves only carry the id. */
export function isUserSquad(squad: Squad): boolean {
  return squad.isUser === true || squad.id === "user-squad";
}
```

Export `isUserSquad` from `src/lib/team/index.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/chemistry.test.ts`

Expected: PASS.

---

### Task 2: Historical chemistry 10%

**Files:**

- Modify: `src/lib/team/chemistry.ts`
- Test: `tests/chemistry.test.ts`

**Interfaces:**

- `HISTORICAL_CHEMISTRY = 0.1`
- `playerBonus(..., isHistorical: true)` returns `0.1`
- `chemistryBonus(..., true)` returns `0.1`

- [ ] **Step 1: Write failing tests**

```ts
test("historical squads get a flat 10% chemistry", () => {
  const p = makePlayer("a", "BRA");
  expect(playerBonus(p, [p], true)).toBe(0.1);
  expect(chemistryBonus([p], true)).toBe(0.1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/chemistry.test.ts`

Expected: FAIL — actual `0.2`.

- [ ] **Step 3: Implement**

Add `export const HISTORICAL_CHEMISTRY = 0.1;`. Use it in `playerBonus` and `chemistryBonus`. Update the comments to say "flat +10% on passing and offBall."

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/chemistry.test.ts`

Expected: PASS.

---

### Task 3: All-stat chemistry for the user only

**Files:**

- Modify: `src/lib/team/strengths.ts`
- Test: `tests/chemistry.test.ts`

**Interfaces:**

- `applyChemistryAndForm(player: Player, bonus: number, boostAllStats: boolean): Player`
- `applyTeamModifiers(players: Player[], isHistorical: boolean, boostAllStats = false): Player[]`

- [ ] **Step 1: Write failing tests**

```ts
test("user chemistry applies to all stats", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, false, true);
  expect(a.passing).toBeCloseTo(82.4);
  expect(a.tackling).toBeCloseTo(82.4);
  expect(a.pace).toBeCloseTo(82.4);
  expect(a.composure).toBeCloseTo(82.4);
});

test("historical chemistry stays on passing and offBall", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, true, false);
  expect(a.passing).toBeCloseTo(88);
  expect(a.offBall).toBeCloseTo(88);
  expect(a.tackling).toBe(80);
});

test("group-stage AI keeps two-stat chemistry", () => {
  const players = [makePlayer("a", "USA"), makePlayer("b", "USA")];
  const [a] = applyTeamModifiers(players, false, false);
  expect(a.passing).toBeCloseTo(82.4);
  expect(a.tackling).toBe(80);
});

test("historical squads ignore the all-stat flag", () => {
  const players = [makePlayer("a", "BRA"), makePlayer("b", "BRA")];
  const [a] = applyTeamModifiers(players, true, true);
  expect(a.passing).toBeCloseTo(88);
  expect(a.tackling).toBe(80);
});

test("out-of-position nerf applies after chemistry", () => {
  const players = [
    makePlayer("a", "BRA", {
      positions: ["LB", "CB"],
      bestPosition: "CB",
      assignedPosition: "LB",
    }),
    makePlayer("b", "BRA"),
  ];
  const [a] = applyTeamModifiers(players, false, true);
  expect(a.tackling).toBeCloseTo(80 * 1.03 * 0.95);
  expect(a.finishing).toBeCloseTo(80 * 1.03);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/chemistry.test.ts`

Expected: FAIL — only passing/offBall receive the bonus.

- [ ] **Step 3: Implement**

In `applyChemistryAndForm`:

```ts
const chemistryMul = 1 + bonus;
const form = player.form ?? 0;
const withForm = (v?: number) => (v === undefined ? undefined : v + form);
const withChem = (v?: number) =>
  v === undefined ? undefined : v * chemistryMul + form;
const base = boostAllStats ? withChem : withForm;
```

Use `base(...)` for every stat except `passing` and `offBall`; those always use `withChem`. Keep `applyNerf` after the multiplier. In `applyTeamModifiers`, pass `boostAllStats && !isHistorical`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/chemistry.test.ts`

Expected: PASS.

---

### Task 4: Wire the engine and add the balance report

**Files:**

- Modify: `src/lib/match/script.ts`
- Create: `scripts/simulate-runs.ts`

**Interfaces:**

- `applyTeamModifiers(..., isUserSquad(squadA))`
- `applyTeamModifiers(..., isUserSquad(squadB))`

- [ ] **Step 1: Wire the flag**

In `simulateMatchScript`, replace the two `applyTeamModifiers(..., squad.isHistorical)` calls with:

```ts
applyTeamModifiers(
  rollForms(startingXI(squadA)),
  squadA.isHistorical,
  isUserSquad(squadA),
);
```

Do the same for `squadB`.

- [ ] **Step 2: Add `scripts/simulate-runs.ts`**

The script:

- accepts `RUNS` as `process.argv[2]`, default `1000`;
- drafts with the real `makeOffer` + best `roleRating` placeable player, no rerolls;
- runs the exact UI pipeline: `createTournament` -> `simulateMatchScript` -> `registerUserResult` -> `advanceToKnockout` / `resolveKnockout`;
- prints champion, runners-up, SF/QF/R16/group exits, group qualify, per-round win rates, and per-formation champion rate.

- [ ] **Step 3: Run the full test suite**

Run: `bun test`

Expected: all existing tests pass.

- [ ] **Step 4: Run the balance report**

Run: `bun scripts/simulate-runs.ts 1000`

Expected: champion ~24%, qualify ~97%, per formation 22-26%. If outside 20-28%, stop and report. Do not tune further without approval.

---

### Task 5: Docs, version, full verification

**Files:**

- Modify: `README.md`
- Modify: `package.json`
- Test: `tests/chemistry.test.ts`

- [ ] **Step 1: Update README**

Change the chemistry bullet to:

> Drafted XI chemistry boosts same-nation players on all stats: 2 -> +3%, 3 -> +5%, 4 -> +8%, 5+ -> +10%. Historical squads get a flat +10% to `passing` and `offBall`.

Add the balance report to the Commands table:

> `bun scripts/simulate-runs.ts 1000` — full-run balance report

- [ ] **Step 2: Bump version**

Change `package.json` to `0.58.0`.

- [ ] **Step 3: Run full verification**

Run: `bun test`

Run: `bun run lint`

Run: `bun run format:check`

Run: `bun scripts/simulate-runs.ts 1000`

Expected: tests pass, lint passes, formatting clean, champion ~24%.

- [ ] **Step 4: Stop for owner review**

Do not commit. Report the new balance numbers and the changed files. Commit only after the owner says so.
