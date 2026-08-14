<script lang="ts">
  import { MousePointerClick, Play, RotateCcw } from "@lucide/svelte";
  import { chemistryBonus, countSameNation } from "../lib/team.js";
  import { swapTargetsFor } from "../lib/draft.js";
  import type { Squad } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";

  let {
    formationKey,
    squad,
    onStart,
    onReset,
    onSwap,
  }: {
    formationKey: string;
    squad: Squad;
    onStart: () => void;
    onReset: () => void;
    onSwap: (playerId: string, slotIndex: number) => void;
  } = $props();

  let selectedId = $state<string | null>(null);

  const drafted = $derived(squad.players);
  /** Pitch shows starters plus the bench player; stats stay on the starting XI only. */
  const pitchPlayers = $derived([...squad.players, ...(squad.bench ?? [])]);
  const sameNation = $derived(countSameNation(drafted));
  const chemistry = $derived(chemistryBonus(drafted, false));
  const swapTargets = $derived(
    selectedId ? swapTargetsFor(pitchPlayers, formationKey, selectedId) : null,
  );

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-6 py-3 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";
  const pillOutlineAlt =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-secondary border border-secondary rounded-full px-6 py-3 bg-transparent transition-all duration-150 hover:bg-secondary hover:text-black";

  /** Select/deselect a player as the source of a swap. */
  function toggleSelect(playerId: string) {
    selectedId = selectedId === playerId ? null : playerId;
  }

  /** Commit the swap by moving the selected player into the clicked slot. */
  function handleSwapTarget(slotIndex: number) {
    if (!selectedId) return;
    onSwap(selectedId, slotIndex);
    selectedId = null;
  }
</script>

<section class="mx-auto max-w-3xl px-6 py-12">
  <p class="{mono} text-mint">Team complete</p>
  <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
    {formationKey}
    <span class="text-secondary">· {drafted.length} players</span>
  </h2>

  <div class="mt-8">
    <PitchView
      players={pitchPlayers}
      {formationKey}
      {selectedId}
      {swapTargets}
      onPlayerClick={toggleSelect}
      onSwapTarget={handleSwapTarget}
    />
  </div>

  {#if selectedId}
    <p
      class="mt-4 inline-flex items-center gap-1.5 text-center font-mono text-[11px] tracking-[1.5px] text-yellow uppercase"
    >
      <MousePointerClick class="h-3.5 w-3.5" /> Click a highlighted position to swap
    </p>
  {/if}

  <div class="mt-8 grid grid-cols-3 gap-4 text-center">
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">PLAYERS</p>
      <p class="mt-1 font-display text-3xl">{drafted.length}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">SAME NATION</p>
      <p class="mt-1 font-display text-3xl">{sameNation}</p>
    </div>
    <div class="rounded-2xl border border-mint bg-mint/10 px-4 py-3">
      <p class="{mono} text-[10px] text-mint">CHEMISTRY</p>
      <p class="mt-1 font-display text-3xl text-mint">
        +{Math.round(chemistry * 100)}%
      </p>
    </div>
  </div>

  <div class="mt-10 flex flex-wrap justify-center gap-4">
    <button
      type="button"
      class="{pillOutline} inline-flex items-center gap-2"
      onclick={onStart}
    >
      <Play class="h-3.5 w-3.5" /> Start tournament
    </button>
    <button
      type="button"
      class="{pillOutlineAlt} inline-flex items-center gap-2"
      onclick={onReset}
    >
      <RotateCcw class="h-3.5 w-3.5" /> Start over
    </button>
  </div>
</section>
