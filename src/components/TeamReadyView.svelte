<script lang="ts">
  import { MousePointerClick, Play, RotateCcw } from "@lucide/svelte";
  import { chemistryBonus, countSameNation } from "../lib/team.js";
  import { swapTargetsFor } from "../lib/draft.js";
  import type { Squad } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";
  import SquadStatsList from "./SquadStatsList.svelte";

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

<section class="mx-auto max-w-6xl px-6 py-12">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 class="font-display text-6xl leading-[0.85] tracking-[1px]">
        Ready to start
      </h2>
      <p class="{mono} mt-3 text-mint">Team complete</p>
    </div>
    <div class="flex flex-wrap gap-4">
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
  </div>

  <div class="mt-8 w-full rounded-3xl border border-white/15 p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <p class="{mono} text-secondary">Your squad</p>
      <p class="{mono} text-[10px] text-secondary">
        {formationKey}
        <span class="text-mint">· {drafted.length} players</span>
      </p>
    </div>
    <div class="grid items-start gap-6 lg:grid-cols-2">
      <PitchView
        players={pitchPlayers}
        {formationKey}
        {selectedId}
        {swapTargets}
        onPlayerClick={toggleSelect}
        onSwapTarget={handleSwapTarget}
      />

      <div>
        <SquadStatsList {squad} />
      </div>
    </div>
  </div>

  {#if selectedId}
    <p
      class="mt-4 inline-flex items-center gap-1.5 text-center font-mono text-[11px] tracking-[1.5px] text-yellow uppercase"
    >
      <MousePointerClick class="h-3.5 w-3.5" /> Click a highlighted position to swap
    </p>
  {/if}

  <div class="mt-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">PLAYERS</p>
      <p class="mt-1 font-display text-3xl">{drafted.length}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">BENCHED</p>
      <p class="mt-1 font-display text-3xl">{(squad.bench ?? []).length}</p>
    </div>
    <div
      class="group relative cursor-help rounded-2xl border border-mint bg-mint/10 px-4 py-3"
    >
      <p class="{mono} text-[10px] text-mint">SYNERGY</p>
      <p class="mt-1 font-display text-3xl text-mint">
        +{Math.round(chemistry * 100)}%
      </p>

      <div
        class="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 hidden w-64 -translate-x-1/2 rounded-xl border border-white/15 bg-slate p-3 text-left shadow-xl group-hover:block"
      >
        <p class="{mono} text-[10px] text-mint">Synergy</p>
        <p class="mt-1.5 text-xs leading-snug text-white">
          Players from the same nation link up, adding a flat stat boost to the
          whole squad.
        </p>
        <p class="{mono} mt-2 text-[10px] text-secondary">SAME NATION</p>
        <p class="font-display text-xl text-white">{sameNation}</p>
        <p class="{mono} mt-2 mb-1 text-[10px] text-secondary">BOOST TIERS</p>
        <ul class="space-y-0.5 font-mono text-[10px]">
          <li class="flex justify-between text-secondary">
            <span>2 same nation</span><span class="text-mint">+3%</span>
          </li>
          <li class="flex justify-between text-secondary">
            <span>3 same nation</span><span class="text-mint">+5%</span>
          </li>
          <li class="flex justify-between text-secondary">
            <span>4 same nation</span><span class="text-mint">+8%</span>
          </li>
          <li class="flex justify-between text-secondary">
            <span>5+ same nation</span><span class="text-mint">+10%</span>
          </li>
        </ul>
        <p class="{mono} mt-2 border-t border-white/10 pt-1.5 text-[10px] text-mint">
          Current boost +{Math.round(chemistry * 100)}%
        </p>
      </div>
    </div>
  </div>
</section>
