# World Cup Draft Simulator — Concept & Match Engine

## 1. Overview

A web app where the user drafts a fantasy XI from World Cup semifinalist squads, then that squad is matched against a real historical WC squad in a simulated knockout match. Draft: each round presents a random team roster; user gets 3 rerolls (different nation or different WC year of same nation) and picks one player per round. 11 rounds, 11 starters, no bench. Engine designed to feel like real football — realistic scorelines, momentum, upsets — without needing a full minute-by-minute event renderer.

---

## 2. Player Data Model

Every player is rated on a small set of **position-specific stats**, 1-99 scale. No abstract "attack/defense/creativity" numbers are stored directly — those are derived on the fly when a squad is assembled.

### Shared by all players
- `name`, `nation`, `wcYear`, `position`
- `composure` (1-99) — penalties, late-game pressure, trailing-team discipline
- `form` — per-match random variance (±5 Gaussian, mean 0, std ~3). Rolled once pre-match, fixed for all segments. GK form is separate: ±12 range for bigger swing.

### Goalkeeper (GK)
- `reflexes` — shot-stopping
- `positioning` — aerial claims, sweeping
- `distribution` — passing out from the back

### Defender (DEF)
- `tackling` — 1v1 defending
- `aerial` — headers, set pieces
- `passing` — build-up from the back
- `pace` — recovery speed, covering in behind

### Midfielder (MID)
- `passing` — range, vision, chance creation
- `dribble` — progressive carries, beating a press
- `workRate` — box-to-box coverage, defensive contribution
- `stamina` — late-game influence

### Attacker (ATT)
- `finishing` — shot conversion
- `dribble` — 1v1s, beating a defender
- `pace` — in-behind runs
- `offBall` — movement/positioning

**Rule of thumb:** 3-4 stats per position, plus `form`. Historical WC squads (the AI opponent teams) must be rated on this *exact same scheme*, full XI, not just star players — otherwise comparisons break down.

---

## 3. Squad Aggregation (Draft → Team Strength)

Once a squad is fully drafted:
- Compute position-group strengths: **Attack**, **Defense**, **Creativity**, **GK Rating**.
- Apply a **chemistry bonus** for same-nation players — rewards drafting coherent squads over stat-stacking.

### Stat-to-team-level mappings

| Team stat | Formula |
|-----------|---------|
| **Attack** | avg(finishing, dribble, pace, offBall) of all attackers |
| **Defense** | avg(tackling, aerial, pace) of all defenders |
| **Creativity** | avg(passing, dribble, workRate) of all midfielders |
| **GK Rating** | avg(reflexes, positioning, distribution) of goalkeeper |

### Chemistry bonus

**Trigger:** same-nation players on the pitch. Boost targets `offBall` + `passing` stats of **same-nation players only** (not whole squad).

| Same-nation count | Bonus |
|---|---|
| 2 | +3% |
| 3 | +5% |
| 4 | +8% |
| 5+ | +10% (cap) |

**User squad:** follows curve above (max +10%).
**Historical AI squad:** flat +20% always (they're a real team).

### Formation requirement
Before draft starts, user picks a formation:

| Formation | GK | DEF | MID | ATT |
|-----------|----|-----|-----|-----|
| 4-3-3 | 1 | 4 | 3 | 3 |
| 4-4-2 | 1 | 4 | 4 | 2 |
| 3-5-2 | 1 | 3 | 5 | 2 |
| 4-2-3-1 | 1 | 4 | 5 | 1 |

Draft enforces position-count limits. Prevents invalid XIs (0 defenders, 11 attackers) and makes AI squad comparison meaningful (opponent formation is known).

---

## 4. Match Simulation Pipeline

Approach: **shots → shots on target → goals**, computed in segments across the match, rather than one single random roll or a full minute-by-minute engine.

### Step 0 — Pre-match setup (once)
- Compute both teams' position-group strengths (defense, midfield creativity/passing, attack/finishing, GK reflexes).
- Roll each goalkeeper's **one-time match form** (neutral most of the time, occasionally hot/cold) — fixed for the whole match.
- Initialize match state: score 0-0, full time remaining, full stamina.

### Step 1 — Split the match into segments
Break 90 minutes into **6 segments** (~15min each). Goal-triggered re-evaluation: after any goal, immediately re-run state check and adjust next portion's behavior (don't wait for next fixed segment boundary). Combined, worst-case state lag drops to ~5-10min.

### Step 2 — Before each segment: adjust behavior based on current state
Check four state variables and nudge each team's *effective* stats for this segment only (base ratings never change):

| State variable | Effect |
|---|---|
| **Score** | Team behind → more shots, riskier defending. Team ahead → fewer shots, tighter defense. |
| **Time remaining** | Same score gap matters more late (minute 85) than early (minute 20) — desperation scales with time. |
| **Stamina** | Both teams weaken each segment; team with worse stamina stat weakens faster. |
| **Goalkeeper form** | Fixed from Step 0, applied at the save stage (Step 5). |
| **Composure** | Per-department avg composure. High-composure department maintains shape under pressure; low-composure over-presses, concedes more chances. |

**Goal-triggered re-evaluation:** if a goal is scored mid-segment, immediately recompute effective stats for the remainder of that segment (no 15min lag).

### Step 3 — Unified possession → shots pipeline

One pipeline separates **quantity** from **quality** to avoid double-counting:

```
1. possession% = (MID_creativity + DEF_passing) / (MID_creativity + DEF_passing + opp_MID_creativity + opp_DEF_passing)

2. max_shots = baseMaxShots * (my_Attack_adj / opp_Defense_adj)
   segment_shots = possession% * max_shots

3. on_target_rate = logistic((my_attack_adj - opp_defense_adj) / scale)
   shots_on_target = segment_shots * on_target_rate

4. conversion_rate = logistic((finishing - (GK_reflexes * GK_form)) / scale)
   goals = shots_on_target * conversion_rate
```

Where `logistic(x) = 1 / (1 + e^(-x))`, `scale = 20` (default, tuned during calibration).

- All rates bounded between 0 and 1
- Sigmoid: close teams get similar rates; big mismatches have diminishing returns (prevents blowouts)
- `max_shots`: dynamic — stronger attack vs weaker defense increases ceiling; clamped to avoid extremes
- Desperate/trailing teams: effective attack stat lowered (low-quality rushed chances)
- **GK form** multiplier applied to GK_reflexes at conversion stage only

### Step 4 — Update state, move to next segment
Update score, reduce stamina further, then loop back to Step 2 with the new state.

### Step 5 — End of regulation
- Not tied → match ends, higher score wins.
- Tied → go to extra time.

### Step 6 — Extra time
Two more shortened segments (2 × ~10min), same Step 2-4 loop, but **stamina-to-chaos variance** is active:

```
variance_modifier = 1 + (1 - stamina/maxStamina) * chaosFactor
effective_finishing = base_finishing * variance_modifier
```

When stamina is low (ET), `variance_modifier` widens outcome range — same finishing stat produces both better and worse results, modeling scrappy bobbling ET goals. `chaosFactor` tuned during calibration.

### Step 7 — Penalties (if still tied)
Separate mini-simulation, not reusing the shots pipeline:
- Top 5 designated takers per team (by `composure` + `finishing` weighted average).
- Each kick = probability roll weighted by taker's `finishing * composure` vs. GK's `reflexes * form`.
- Alternate kicks, best-of-5, sudden death after.

### Step 8 — Output
Final score, total shots, shots on target, possession %, and a rough aggression narrative — all byproducts of the segment loop.

---

## 5. Identified Gaps & Fixes

| Gap | Problem | Fix |
|---|---|---|
| No possession/tempo context | Shot counts feel arbitrary | **RESOLVED** — Unified possession → shots pipeline (Step 3). Possession determines quantity, quality determines accuracy. No double-count. |
| Independent random rolls at each stage | Can produce absurd outlier scorelines (3 shots → 3 goals) | **RESOLVED** — Sigmoid-bounded conversion rates + binomial-style pass over actual shot count. Variance capped to shot volume. |
| No game-state feedback | Trailing/leading teams played with, without changing behavior mid-match | **RESOLVED** — Score + time-remaining + composure check before each segment + goal-triggered re-eval. |
| Goalkeeper folded into general defense | Misses realistic "keeper had the game of his life" swings | **RESOLVED** — Separate GK form roll (±12 range), applied only at conversion stage. |
| No consistent stat coverage for historical squads | Draft players rated, but opponent squads not | **RESOLVED** — Same stat scheme applied to all historical XIs. Manual entry by user. |
| No calibration against real-world data | Risk of unrealistic scorelines (9-0s, etc.) | **RESOLVED** — Concrete target distribution defined in §7. |
| No defined ET/penalty trigger logic | Ambiguous when penalties happen | **RESOLVED** — 90 min → extra time (2 segments, fatigue-adjusted) → penalties only if still level. |
| Chemistry imbalance | Historical squads always max chemistry vs user squads | **RESOLVED** — User: 2→+3%, 3→+5%, 4→+8%, 5→+10% boost to same-nation offball+passing. AI: flat +20%. |
| Shot formula undefined | Core engine has no concrete math | **RESOLVED** — Sigmoid diff: `logistic((att - def) / 20)` in Step 3. |
| Possession/attack double-count | Two independent signals compound blowouts | **RESOLVED** — Single pipeline: possession → shots → on-target → goals. Possession includes DEF passing. |
| Chemistry curve missing | Mono-nation stacking trivially optimal | **RESOLVED** — Defined curve per player count: 2→3%, 3→5%, 4→8%, 5→10%. |
| Segment state lag | ~22min delay before behavior adjusts to conceding | **RESOLVED** — 6 segments (15min) + goal-triggered re-eval. |
| Stamina→chaos asserted, not modeled | ET "scrappiness" not backed by mechanic | **RESOLVED** — variance modifier on finishing when stamina low (Step 6). |
| No formation validity | 0-0-0-11 possible | **RESOLVED** — Pre-draft formation pick, position-count enforced. |
| Composure referenced but undefined | Used in penalties but not in data model | **RESOLVED** — Added to every player (1-99). Used for penalties + pressure behavior. |
| Form distribution unspecified | Per-segment vs per-match, range undefined | **RESOLVED** — Pre-match form roll (±5 Gaussian, ±12 for GK), fixed for all segments. |

---

## 6. State Summary (checked every segment)

1. **Score** — who's ahead, by how much
2. **Time remaining** — how urgent the situation is
3. **Stamina** — fatigue reducing effective stats over time
4. **Goalkeeper form** — fixed per-match multiplier from the pre-match roll
5. **Composure** — per-department avg (GK/DEF/MID/ATT). Affects shape under pressure.

These values are checked before every segment (and on goal-triggered re-eval), used to temporarily adjust base player/team stats, and then discarded once the segment's pipeline runs. Underlying player ratings never change — only how they're expressed in that moment.

---

## 7. Calibration Targets

**Method:** Run 500 sims between balanced teams; tune `scale` (shot sigmoid, default 20), `chaosFactor` (ET variance), and `baseMaxShots` until distribution fits.

| Metric | Target |
|---|---|
| Avg total goals per match | 2.4-2.8 |
| Matches within 1 goal margin | 55-65% |
| Matches within 2 goal margin | 70-80% |
| Most common scorelines | 1-0, 2-1, 1-1 (→ET) |
| Clean sheet % | 25-35% |
| High-scoring matches (>4 goals) | <10% |
| Extra time rate (level after 90min) | 20-30% |
| Penalty rate (level after ET) | 10-15% |

**Reference data:** Real WC knockout matches 1930-2022. These targets ensure the engine "feels like football" with realistic score distributions, not a random number generator in a soccer skin.