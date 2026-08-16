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
  import { countSameNation } from "../lib/team.js";
  import { nationClusters } from "../lib/team.js";
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
  const clusters = $derived(nationClusters(drafted));
  const linkedClusters = $derived(clusters.filter((c) => c.bonus > 0));
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
    "font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-4 py-1.5 bg-transparent transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
</script>

<section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
  <div class="grid items-start gap-6 lg:grid-cols-2">
    {#if offer}
      <div class="flex min-w-0 flex-col lg:sticky lg:top-6">
        <div class="mb-5 flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div class="min-w-0">
            <p class="{mono} text-mint">
              Draft Round {round} / {DRAFT_ROUNDS}
            </p>
            <div
              class="mt-1 truncate font-display text-xl leading-[0.9] tracking-[1px] text-white sm:text-2xl"
            >
              {NATION_NAMES[offer.nation] ?? offer.nation}
              <span class="text-mint">{offer.year}</span>
            </div>
          </div>
          <div class="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
            <p class="{mono} text-[10px] text-secondary">
              REROLLS LEFT · {rerollsLeft}
            </p>
            <div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                class="{pillOutline} inline-flex w-full items-center justify-center gap-1.5 disabled:opacity-30 sm:w-auto"
                disabled={!canSameNation || rerollsLeft <= 0 || complete}
                onclick={() => reroll("same")}
              >
                <CalendarDays class="h-3 w-3" />
                Different year
              </button>
              <button
                type="button"
                class="{pillOutline} inline-flex w-full items-center justify-center gap-1.5 disabled:opacity-30 sm:w-auto"
                disabled={!canNewNation || rerollsLeft <= 0 || complete}
                onclick={() => reroll("new")}
              >
                <Globe class="h-3 w-3" />
                Different nation
              </button>
            </div>
          </div>
        </div>
        <div
          bind:this={offerScroll}
          class="draft-scroll grid grid-cols-1 gap-4 overflow-y-auto rounded-3xl border border-white/15 p-3 sm:grid-cols-2 lg:max-h-[calc(100vh-9rem)]"
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
      class="h-fit rounded-3xl border border-white/15 bg-slate/30 p-4 sm:p-6 lg:sticky lg:top-6"
    >
      <div class="flex items-center justify-between gap-2">
        <p class="{mono} text-mint">
          Your team <span class="text-secondary"
            >({drafted.length}/{DRAFT_ROUNDS})</span
          >
        </p>
        <p class="{mono} text-[10px] text-secondary">
          {formationKey}
          {#if sameNation > 1}
            <span class="text-mint">· {sameNation}</span>
          {/if}
        </p>
      </div>
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
      {#if linkedClusters.length > 0}
        <div class="mt-6 rounded-2xl border border-mint bg-mint/5 p-3">
          <p class="{mono} mb-2 text-[10px] text-mint">Synergy</p>
          <ul class="space-y-1 font-mono text-[10px]">
            {#each linkedClusters as c (c.nation)}
              <li class="flex items-center justify-between gap-2">
                <span class="text-secondary">
                  {NATION_NAMES[c.nation] ?? c.nation} ×{c.players.length}
                </span>
                <span class="text-mint">+{Math.round(c.bonus * 100)}%</span>
              </li>
            {/each}
          </ul>
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
