<script lang="ts">
  import { CalendarDays, Globe } from "@lucide/svelte";
  import {
    BENCH_SLOT,
    DRAFT_ROUNDS,
    MAX_REROLLS,
    NATION_NAMES,
    assignSlots,
    canonicalRole,
    draftableNations,
    emptySlotRoles,
    makeOffer,
    nationYears,
    newNationReroll,
    sameNationReroll,
    slotDepartment,
    squadOf,
    swapPlayers as applySwap,
    swapTargetsFor,
    validateDraft,
  } from "../lib/draft.js";
  import { countSameNation, chemistryBonus } from "../lib/team.js";
  import type { Formation, Player, Position } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";
  import PlayerOfferCard from "./draft/PlayerOfferCard.svelte";

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
  let offerScroll = $state<HTMLDivElement | null>(null);

  const AUTO_REROLL_MAX = 15;

  $effect(() => {
    if (!offer) {
      const first = makeOffer(formationKey, formation, drafted);
      offer = first;
      offerHistory = [first];
    }
  });

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

  // When the current offer contains no placeable player, automatically redraw it
  // (bounded by AUTO_REROLL_MAX) instead of forcing the user to waste a reroll.
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

  const draftedNames = $derived(new Set(drafted.map((p) => p.name)));

  /** Whether the single bench slot is still open (capacity 1). */
  const benchOpen = $derived(
    !drafted.some((p) => p.assignedSlot === BENCH_SLOT),
  );

  const squadCanPlace = (nation: string, year: number): boolean =>
    openRoles.length === 0 ||
    squadOf(nation, year).some(
      (p) =>
        !draftedNames.has(p.name) &&
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
      (n) => n !== o.nation && nationYears(n).some((y) => squadCanPlace(n, y)),
    );
  });

  /** True if at least one offer player fits an empty slot in the current formation. */
  function offerUsable(o: ReturnType<typeof makeOffer>): boolean {
    return o.players.some((p) => hasPlaceableSlot(p));
  }

  /** Bring the offer list back to the top so the new offer is in view. */
  function scrollOfferToTop() {
    offerScroll?.scrollTo({ top: 0 });
  }

  /** Draw the next offer, retrying (bounded) until it contains a placeable player. */
  function newOffer() {
    selected = null;
    let next = makeOffer(formationKey, formation, drafted, offerHistory);
    let guard = 0;
    while (guard < 100 && !offerUsable(next)) {
      next = makeOffer(formationKey, formation, drafted, offerHistory);
      guard++;
    }
    offer = next;
    offerHistory = [...offerHistory, next];
    scrollOfferToTop();
  }

  /** Spend a reroll to redraw the offer, optionally constrained to the same or a new nation. */
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
    scrollOfferToTop();
  }

  /** Whether a player fits any currently empty slot, including the open bench slot. */
  function hasPlaceableSlot(p: Player): boolean {
    if (benchOpen) return true;
    return draftSlots.some(
      (s) =>
        !s.player && p.positions.some((r) => canonicalRole(r) === s.slot.role),
    );
  }

  /** Select/deselect an offer player for placement (blocked when the squad is complete, the player can't be placed, or the name is already drafted). */
  function toggleSelect(p: Player) {
    if (complete || !hasPlaceableSlot(p) || draftedNames.has(p.name)) return;
    swapSelectedId = null;
    selected = selected?.id === p.id ? null : p;
  }

  /** Commit the selected player into a specific formation slot (or the bench slot) and refresh the offer. */
  function place(role: string, slotIndex: number) {
    if (!selected) return;
    if (draftedNames.has(selected.name)) return;
    if (slotIndex === BENCH_SLOT) {
      if (!benchOpen) return;
      const placed = {
        ...selected,
        assignedPosition: undefined,
        assignedSlot: BENCH_SLOT,
      };
      const next = [...drafted, placed];
      drafted = next;
      selected = null;
      onPick(placed);
      rerollsLeft = MAX_REROLLS;
      if (!validateDraft(formation, next)) {
        newOffer();
      }
      return;
    }
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
    const next = applySwap(drafted, formationKey, from.assignedSlot, slotIndex);
    if (!next) return;
    drafted = next;
    onSwapDrafted(next);
    swapSelectedId = null;
  }

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
</script>

<section class="mx-auto max-w-6xl px-6 py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Draft Round {round} / {DRAFT_ROUNDS}</p>
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

  <div class="mt-8 grid items-start gap-6 lg:grid-cols-2">
    {#if offer}
      <div class="flex min-w-0 flex-col lg:sticky lg:top-6">
        <div
          class="mb-5 flex shrink-0 items-center justify-between gap-4 font-display text-3xl text-white"
        >
          <span>
            {NATION_NAMES[offer.nation] ?? offer.nation}
            <span class="text-mint">{offer.year}</span>
          </span>
          <div class="flex shrink-0 flex-wrap justify-end gap-2">
            <button
              type="button"
              class="{pillOutline} inline-flex items-center gap-1.5 disabled:opacity-30"
              disabled={!canSameNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("same")}
            >
              <CalendarDays class="h-3.5 w-3.5" />
              Different year
            </button>
            <button
              type="button"
              class="{pillOutline} inline-flex items-center gap-1.5 disabled:opacity-30"
              disabled={!canNewNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("new")}
            >
              <Globe class="h-3.5 w-3.5" />
              Different nation
            </button>
          </div>
        </div>
        <div
          bind:this={offerScroll}
          class="draft-scroll grid gap-4 overflow-y-auto p-1.5 sm:grid-cols-2 lg:max-h-[calc(100vh-9rem)]"
        >
          {#each offerPlayers as p (p.id)}
            <PlayerOfferCard
              player={p}
              selected={selected?.id === p.id}
              disabled={complete || !hasPlaceableSlot(p)}
              full={!hasPlaceableSlot(p)}
              onClick={() => toggleSelect(p)}
            />
          {/each}
        </div>
      </div>
    {/if}

    <aside
      class="h-fit rounded-3xl border border-white/15 bg-slate/30 p-6 lg:sticky lg:top-6"
    >
      <p class="{mono} text-mint">
        Your team <span class="text-secondary"
          >({drafted.length}/{DRAFT_ROUNDS})</span
        >
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
  .draft-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(255 255 255 / 0.15) transparent;
  }

  :global(.draft-scroll::-webkit-scrollbar) {
    width: 8px;
  }

  :global(.draft-scroll::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.draft-scroll::-webkit-scrollbar-thumb) {
    background: rgb(255 255 255 / 0.15);
    border-radius: 999px;
  }

  :global(.draft-scroll::-webkit-scrollbar-thumb:hover) {
    background: rgb(60 255 208 / 0.5);
  }
</style>
