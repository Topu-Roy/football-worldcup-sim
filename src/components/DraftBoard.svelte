<script lang="ts">
  import {
    MAX_REROLLS,
    NATION_NAMES,
    assignSlots,
    canonicalRole,
    draftableNations,
    emptySlotRoles,
    makeOffer,
    nationYears,
    newNationReroll,
    playerRating,
    playerTier,
    sameNationReroll,
    slotDepartment,
    slotsLeft,
    squadOf,
    swapPlayers as applySwap,
    swapTargetsFor,
    validateDraft,
  } from "../lib/draft.js";
  import { countSameNation, chemistryBonus } from "../lib/team.js";
  import type { Formation, Player, Position } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";

  let {
    formation,
    formationKey,
    onPick,
    onSwapDrafted,
  }: {
    formation: Formation;
    formationKey: string;
    onPick: (p: Player) => void;
    onSwapDrafted: (players: Player[]) => void;
  } = $props();

  let offer = $state<ReturnType<typeof makeOffer> | null>(null);
  let offerHistory: ReturnType<typeof makeOffer>[] = $state([]);
  let rerollsLeft = $state(MAX_REROLLS);
  let drafted = $state<Player[]>([]);
  let selected = $state<Player | null>(null);
  let swapSelectedId = $state<string | null>(null);

  const AUTO_REROLL_MAX = 15;

  $effect(() => {
    if (!offer) {
      const first = makeOffer(formationKey, formation, drafted);
      offer = first;
      offerHistory = [first];
    }
  });

  const left = $derived(slotsLeft(formation, drafted));
  const positionOrder: Position[] = ["GK", "ATT", "MID", "DEF"];
  const round = $derived(drafted.length + 1);
  const complete = $derived(validateDraft(formation, drafted));
  const sameNation = $derived(countSameNation(drafted));
  const chemistry = $derived(chemistryBonus(drafted, false));
  const draftSlots = $derived(assignSlots(drafted, formationKey));
  const selectableRoles = $derived.by(() => {
    const sel = selected;
    if (!sel) return null;
    return draftSlots
      .filter(
        (s) =>
          !s.player &&
          sel.positions.some((r) => canonicalRole(r) === s.slot.role),
      )
      .map((s) => s.slot.role);
  });
  const swapTargets = $derived(
    swapSelectedId
      ? swapTargetsFor(drafted, formationKey, swapSelectedId)
      : null,
  );
  const offerPlayers = $derived(
    [...(offer?.players ?? [])].sort(
      (a, b) =>
        positionOrder.indexOf(slotDepartment(a)) -
        positionOrder.indexOf(slotDepartment(b)),
    ),
  );

  const offerUnplaceable = $derived(
    offer != null &&
      !complete &&
      offerPlayers.length > 0 &&
      !offerPlayers.some((p) => hasPlaceableSlot(p)),
  );

  let autoRerollCount = $state(0);

  $effect(() => {
    if (!offerUnplaceable) {
      autoRerollCount = 0;
      return;
    }
    if (autoRerollCount >= AUTO_REROLL_MAX) return;
    autoRerollCount += 1;
    selected = null;
    swapSelectedId = null;
    newOffer();
  });

  const openRoles = $derived(emptySlotRoles(formationKey, drafted));

  const squadCanPlace = (nation: string, year: number): boolean =>
    squadOf(nation, year).some((p) =>
      p.positions.some((r) =>
        openRoles.some((role) => canonicalRole(role) === canonicalRole(r)),
      ),
    );

  const canSameNation = $derived.by(() => {
    const o = offer;
    if (!o) return false;
    return nationYears(o.nation).some(
      (y) =>
        y !== o.year &&
        !offerHistory.some((h) => h.nation === o.nation && h.year === y) &&
        squadCanPlace(o.nation, y),
    );
  });

  const canNewNation = $derived.by(() => {
    const o = offer;
    if (!o) return false;
    return draftableNations().some(
      (n) =>
        n !== o.nation &&
        nationYears(n).some((y) => squadCanPlace(n, y)),
    );
  });

  function newOffer() {
    selected = null;
    const next = makeOffer(formationKey, formation, drafted, offerHistory);
    offer = next;
    offerHistory = [...offerHistory, next];
  }

  function reroll(kind: "same" | "new") {
    if (rerollsLeft <= 0 || complete || !offer) return;
    const next =
      kind === "same"
        ? sameNationReroll(
            formationKey,
            formation,
            drafted,
            offer,
            offerHistory,
          )
        : newNationReroll(
            formationKey,
            formation,
            drafted,
            offer,
            offerHistory,
          );
    if (!next) return;
    selected = null;
    rerollsLeft -= 1;
    offer = next;
    offerHistory = [...offerHistory, next];
  }

  function hasPlaceableSlot(p: Player): boolean {
    return draftSlots.some(
      (s) =>
        !s.player && p.positions.some((r) => canonicalRole(r) === s.slot.role),
    );
  }

  function toggleSelect(p: Player) {
    if (complete || left[slotDepartment(p)] <= 0 || !hasPlaceableSlot(p))
      return;
    swapSelectedId = null;
    selected = selected?.id === p.id ? null : p;
  }

  function place(role: string, slotIndex: number) {
    if (!selected) return;
    if (left[slotDepartment(selected)] <= 0) return;
    const slot = draftSlots[slotIndex];
    if (!slot || slot.player) return;
    if (!selected.positions.some((r) => canonicalRole(r) === role)) return;
    const placed = {
      ...selected,
      assignedPosition: role,
      assignedSlot: slotIndex,
    };
    const next = [...drafted, placed];
    drafted = next;
    selected = null;
    onPick(placed);
    rerollsLeft = MAX_REROLLS;
    if (!validateDraft(formation, next)) {
      newOffer();
    }
  }

  function toggleSwapSelect(playerId: string) {
    selected = null;
    swapSelectedId = swapSelectedId === playerId ? null : playerId;
  }

  function handleSwapTarget(slotIndex: number) {
    if (!swapSelectedId) return;
    const from = drafted.find((p) => p.id === swapSelectedId);
    if (!from || from.assignedSlot === undefined) return;
    const next = applySwap(
      drafted,
      formationKey,
      from.assignedSlot,
      slotIndex,
    );
    if (!next) return;
    drafted = next;
    onSwapDrafted(next);
    swapSelectedId = null;
  }

  function statRows(p: Player): [string, number][] {
    const map: Record<Position, [string, keyof Player][]> = {
      GK: [
        ["Reflexes", "reflexes"],
        ["Positioning", "positioning"],
        ["Distribution", "distribution"],
      ],
      DEF: [
        ["Tackling", "tackling"],
        ["Aerial", "aerial"],
        ["Passing", "passing"],
        ["Pace", "pace"],
      ],
      MID: [
        ["Passing", "passing"],
        ["Dribble", "dribble"],
        ["Work Rate", "workRate"],
        ["Stamina", "stamina"],
      ],
      ATT: [
        ["Finishing", "finishing"],
        ["Dribble", "dribble"],
        ["Pace", "pace"],
        ["Off Ball", "offBall"],
      ],
    };
    return (map[slotDepartment(p)] ?? []).map(([label, key]) => [
      label,
      (p[key as keyof Player] as number) ?? 0,
    ]);
  }

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
  const playerCard =
    "border border-white/15 rounded-[20px] bg-[#1a1a1a] p-5 transition-all duration-150 enabled:hover:border-mint enabled:hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed";
  const pillTag =
    "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase rounded-full py-1 px-2.5";
</script>

<section class="mx-auto max-w-6xl px-6 py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Draft Round {round} / 11</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
        {formationKey}
        <span class="text-secondary"
          >{sameNation > 1 ? ` · ${sameNation} same nation` : ""}</span
        >
      </h2>
    </div>
    <div class="flex items-center">
      <div class="text-right">
        <p class="{mono} text-secondary">REROLLS LEFT</p>
        <p class="font-display text-3xl">{rerollsLeft}</p>
      </div>
    </div>
  </header>

  <div class="mt-8 grid gap-6 lg:grid-cols-2">
    {#if offer}
      <div>
        <div
          class="mb-5 flex items-center justify-between gap-4 font-display text-3xl text-white"
        >
          <span>
            {NATION_NAMES[offer.nation] ?? offer.nation}
            <span class="text-mint">{offer.year}</span>
          </span>
          <div class="flex shrink-0 flex-wrap justify-end gap-2">
            <button
              type="button"
              class="{pillOutline} disabled:opacity-30"
              disabled={!canSameNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("same")}
            >
              Different year
            </button>
            <button
              type="button"
              class="{pillOutline} disabled:opacity-30"
              disabled={!canNewNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("new")}
            >
              Different nation
            </button>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each offerPlayers as p (p.id)}
            {@const tier = playerTier(p)}
            <button
              type="button"
              class="{playerCard} {selected?.id === p.id
                ? 'card-selected'
                : ''} {tier === 'elite'
                ? 'card-elite'
                : tier === 'star'
                  ? 'card-star'
                  : ''} text-left"
              disabled={complete ||
                left[slotDepartment(p)] <= 0 ||
                !hasPlaceableSlot(p)}
              onclick={() => toggleSelect(p)}
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline justify-between gap-2">
                    <p class="min-w-0 flex-1 truncate text-lg font-bold">
                      {p.name}
                    </p>
                    {#if tier === "elite"}
                      <span
                        class="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border border-transparent bg-gradient-to-br from-[#ffd700] to-[#b45309] px-1.5 font-mono text-xs font-bold text-black"
                        >★{playerRating(p)}</span
                      >
                    {:else if tier === "star"}
                      <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ffd23c]/60 bg-slate font-mono text-xs font-bold text-[#ffd23c]"
                        >{playerRating(p)}</span
                      >
                    {:else}
                      <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mint/30 bg-slate font-mono text-xs text-mint"
                        >{playerRating(p)}</span
                      >
                    {/if}
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-1">
                    {#each p.positions as role (role)}
                      <span
                        class="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[1px] uppercase {role ===
                        p.bestPosition
                          ? 'bg-mint text-black'
                          : 'border border-white/15 text-secondary'}"
                      >
                        {role}
                      </span>
                    {/each}
                  </div>
                </div>
                {#if left[slotDepartment(p)] <= 0}
                  <span class="{pillTag} shrink-0 bg-slate text-secondary"
                    >FULL</span
                  >
                {/if}
              </div>
              <dl class="mt-4 space-y-1.5">
                {#each statRows(p) as [label, val] (label)}
                  <div class="flex items-center gap-3">
                    <dt
                      class="{mono} min-w-0 flex-1 truncate text-[10px] leading-none text-secondary"
                    >
                      {label}
                    </dt>
                    <div class="h-px flex-1 bg-white/15"></div>
                    <dd class="text-right font-mono text-xs">{val}</dd>
                  </div>
                {/each}
              </dl>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <aside
      class="h-fit rounded-3xl border border-white/15 bg-slate/30 p-6 lg:sticky lg:top-6"
    >
      <p class="{mono} text-mint">
        Your XI <span class="text-secondary">({drafted.length}/11)</span>
      </p>
      <div class="mt-4">
        <PitchView
          players={drafted}
          {formationKey}
          size="md"
          onSlotClick={place}
          {selectableRoles}
          bestPosition={selected?.bestPosition ?? null}
          selectedId={swapSelectedId}
          {swapTargets}
          onPlayerClick={toggleSwapSelect}
          onSwapTarget={handleSwapTarget}
        />
      </div>
      {#if chemistry > 0}
        <div class="mt-6 rounded-full border border-mint px-4 py-2 text-center">
          <span class="{mono} text-[10px] text-mint"
            >CHEMISTRY +{Math.round(chemistry * 100)}%</span
          >
        </div>
      {/if}
    </aside>
  </div>
</section>

<style>
  @property --elite-angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }

  .card-elite {
    position: relative;
    overflow: hidden;
    border: 2px solid transparent !important;
    background:
      linear-gradient(#161616, #161616) padding-box,
      conic-gradient(
          from var(--elite-angle),
          #ffd700,
          #f59e0b,
          #b45309,
          #ffd700
        )
        border-box !important;
    box-shadow:
      0 0 24px rgb(255 215 0 / 0.25),
      0 0 48px rgb(245 158 11 / 0.15);
    animation: elite-angle 3s linear infinite;
  }

  @keyframes elite-angle {
    to {
      --elite-angle: 360deg;
    }
  }

  .card-elite::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      transparent 20%,
      rgb(255 255 255 / 0.14) 40%,
      transparent 60%
    );
    transform: translateX(-110%);
    animation: elite-shine 3.2s ease-in-out infinite;
  }

  @keyframes elite-shine {
    0% {
      transform: translateX(-110%);
    }
    55% {
      transform: translateX(110%);
    }
    100% {
      transform: translateX(110%);
    }
  }

  .card-star {
    border-color: rgb(255 210 60 / 0.4) !important;
    box-shadow: 0 0 16px rgb(255 210 60 / 0.12);
  }

  .card-selected {
    outline: 2px solid #3cffd0;
    outline-offset: 2px;
  }
</style>
