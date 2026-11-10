<script lang="ts">
  import { TriangleAlert } from "@lucide/svelte";
  import {
    ROLE_LABELS,
    assignedRole,
    canonicalRole,
    playerRating,
    roleNerf,
  } from "../../lib/draft.js";
  import { shortName } from "../../lib/shortName";
  import type { Player } from "../../lib/types.js";

  let {
    player,
    slotRole,
    number,
    isTarget,
    isSelected,
    selectedBest,
    showTip,
    onTipToggle,
    onSelect,
  }: {
    player: Player;
    slotRole: string;
    number: number;
    isTarget: boolean;
    isSelected: boolean;
    /** Best-position label of the currently selected player, used to star matching slots. */
    selectedBest: string | null;
    showTip: boolean;
    onTipToggle: () => void;
    onSelect: () => void;
  } = $props();

  const flagged = $derived(roleNerf(player).factor <= 0.9);
  const showStar = $derived(
    (isTarget || isSelected) &&
      !!selectedBest &&
      canonicalRole(slotRole) === canonicalRole(selectedBest),
  );
  const rating = $derived(Math.round(playerRating(player)));
</script>

<div class="relative flex flex-col items-center gap-1">
  <div class="relative">
    <button
      type="button"
      class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-base font-bold shadow-lg transition-all duration-150 {isTarget
        ? 'animate-pulse cursor-pointer border-mint bg-white text-black shadow-[0_0_16px_rgba(60,255,208,0.7)] hover:bg-mint motion-reduce:animate-none'
        : isSelected
          ? 'cursor-pointer border-yellow bg-white text-black shadow-[0_0_14px_rgba(255,210,60,0.6)]'
          : flagged
            ? 'cursor-pointer border-red-500 bg-white text-black hover:border-red-300'
            : 'cursor-pointer border-white/90 bg-white text-black hover:border-mint hover:text-black'}"
      onclick={onSelect}
    >
      {number}
    </button>

    {#if showStar}
      <span
        class="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow text-[10px] leading-none text-black"
        >★</span
      >
    {/if}

    {#if flagged}
      <button
        type="button"
        class="absolute -top-2.5 -right-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-slate text-white/80 transition-colors duration-150 hover:bg-white hover:text-black"
        aria-label="Why is this player flagged?"
        onclick={(e) => {
          e.stopPropagation();
          onTipToggle();
        }}
      >
        <TriangleAlert class="h-3 w-3" stroke-width={2.5} />
      </button>
    {/if}
  </div>

  <span
    class="max-w-24 truncate text-[11px] leading-none font-bold [text-shadow:0_1px_2px_rgba(0,0,0,0.9)] {isTarget
      ? 'text-mint'
      : isSelected
        ? 'text-yellow'
        : 'text-white'}"
  >
    {shortName(player.name)}
  </span>

  <span
    class="font-mono text-[10px] leading-none font-bold text-mint [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]"
  >
    {rating}
  </span>

  {#if showTip && flagged}
    <div
      class="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-xl border border-white/15 bg-slate p-3 text-left shadow-xl"
    >
      <p
        class="font-mono text-[9px] font-semibold tracking-[1.5px] text-red-400 uppercase"
      >
        Out of position
      </p>
      <p class="mt-1.5 truncate text-sm font-bold text-white">{player.name}</p>
      <dl class="mt-1.5 space-y-1 font-mono text-[10px]">
        <div class="flex items-center justify-between gap-2">
          <dt class="text-secondary">Natural</dt>
          <dd class="truncate font-semibold text-mint">
            {ROLE_LABELS[player.bestPosition] ?? player.bestPosition}
          </dd>
        </div>
        <div class="flex items-center justify-between gap-2">
          <dt class="text-secondary">Playing</dt>
          <dd class="truncate font-semibold text-white">
            {ROLE_LABELS[assignedRole(player)] ?? assignedRole(player)}
          </dd>
        </div>
        <div class="flex items-center justify-between gap-2">
          <dt class="text-secondary">Penalty</dt>
          <dd class="font-semibold text-red-400">
            −{Math.round((1 - roleNerf(player).factor) * 100)}% stats
          </dd>
        </div>
      </dl>
      <p class="mt-2 font-mono text-[9px] leading-snug text-secondary">
        Assign a natural position to remove the penalty.
      </p>
    </div>
  {/if}
</div>
