<script lang="ts">
  import { MousePointerClick, Play, RotateCcw } from "@lucide/svelte";
  import { computeTeamStrengths, nationClusters } from "../lib/team.js";
  import { confirmAction } from "../lib/confirmDialog.js";
  import { NATION_NAMES, playerRating, swapTargetsFor } from "../lib/draft.js";
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
  /** The pitch shows the starting XI (every drafted player is a starter). */
  const pitchPlayers = $derived(squad.players);
  const clusters = $derived(nationClusters(drafted));
  const linkedClusters = $derived(clusters.filter((c) => c.bonus > 0));
  const soloCount = $derived(
    clusters
      .filter((c) => c.bonus <= 0)
      .reduce((n, c) => n + c.players.length, 0),
  );
  const strengths = $derived(computeTeamStrengths(drafted));
  const teamAvg = $derived(
    Math.round(
      drafted.reduce((sum, p) => sum + playerRating(p), 0) /
        Math.max(drafted.length, 1),
    ),
  );
  const attack = $derived(Math.round(strengths.attack));
  const defense = $derived(Math.round(strengths.defense));
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

  /** Confirm before discarding a completed XI. */
  async function handleStartOver() {
    const ok = await confirmAction({
      title: "Start over?",
      message: "This clears your drafted XI and tournament.",
      confirmLabel: "Start over",
      danger: true,
    });
    if (!ok) return;
    onReset();
  }
</script>

<section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Team complete</p>
      <h2
        class="mt-2 font-display text-5xl leading-[0.85] tracking-[1px] sm:text-6xl"
      >
        Ready to start
      </h2>
      <p class="mt-3 max-w-md text-sm text-secondary">
        Review your XI below. Select a player to swap positions, then run the
        tournament.
      </p>
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
        onclick={handleStartOver}
      >
        <RotateCcw class="h-3.5 w-3.5" /> Start over
      </button>
    </div>
  </div>

  <div class="mt-8 w-full rounded-3xl border border-white/15 p-4 sm:p-6">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p class="{mono} text-secondary">Your squad</p>
        <p class="mt-1 text-[11px] text-secondary">
          OVR is the overall rating (0–100). AVG is the squad average.
        </p>
      </div>
      <p class="{mono} text-[10px] text-secondary">
        {formationKey}
        <span
          class="ml-2 inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 font-display text-lg leading-none font-semibold text-black"
        >
          AVG {teamAvg}
        </span>
      </p>
    </div>
    <div class="grid items-start gap-6 lg:grid-cols-2">
      <div class="flex min-w-0 flex-col items-center gap-3">
        <PitchView
          players={pitchPlayers}
          {formationKey}
          {selectedId}
          {swapTargets}
          onPlayerClick={toggleSelect}
          onSwapTarget={handleSwapTarget}
        />
        {#if selectedId}
          <p
            class="inline-flex items-center gap-1.5 text-center font-mono text-[10px] font-semibold tracking-[1.5px] text-yellow uppercase"
          >
            <MousePointerClick class="h-3.5 w-3.5" /> Select a highlighted position
            to swap
          </p>
        {:else}
          <p
            class="text-center font-mono text-[10px] tracking-[1.5px] text-secondary uppercase"
          >
            Select a player to swap positions
          </p>
        {/if}
      </div>

      <div class="min-w-0">
        <SquadStatsList {squad} />
      </div>
    </div>
  </div>

  <div class="mt-8 grid grid-cols-2 gap-4">
    <div
      class="rounded-2xl border border-orange/30 bg-orange/10 px-4 py-3 text-center"
    >
      <p class="{mono} text-[10px] text-orange">Attack power</p>
      <p class="mt-1 font-display text-4xl text-orange">{attack}</p>
      <p
        class="mt-1 font-mono text-[9px] tracking-[1px] text-secondary uppercase"
      >
        out of 100
      </p>
    </div>
    <div
      class="rounded-2xl border border-blue/30 bg-blue/10 px-4 py-3 text-center"
    >
      <p class="{mono} text-[10px] text-blue">Defense power</p>
      <p class="mt-1 font-display text-4xl text-blue">{defense}</p>
      <p
        class="mt-1 font-mono text-[9px] tracking-[1px] text-secondary uppercase"
      >
        out of 100
      </p>
    </div>
  </div>

  <div class="mt-8 w-full rounded-3xl border border-white/15 p-4 sm:p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <p class="{mono} text-secondary">Synergy breakdown</p>
      <p class="{mono} text-[10px] text-secondary">passing + off-ball boost</p>
    </div>

    {#if linkedClusters.length > 0}
      <div class="grid gap-3 sm:grid-cols-2">
        {#each linkedClusters as c (c.nation)}
          <div class="rounded-2xl border border-white/10 bg-slate/20 p-4">
            <div class="flex items-baseline justify-between gap-2">
              <p class="font-display text-2xl">
                {NATION_NAMES[c.nation] ?? c.nation}
              </p>
              <p class="{mono} text-[10px] text-secondary">
                {c.players.length} players
              </p>
            </div>
            <p class="{mono} mt-1 inline-flex items-center gap-1 text-mint">
              <span
                class="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-black"
                >+{Math.round(c.bonus * 100)}%</span
              >
              passing + off-ball
            </p>
            <ul class="mt-3 flex flex-wrap gap-1">
              {#each c.players as p (p.id)}
                <li
                  class="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold"
                >
                  {p.name}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
      {#if soloCount > 0}
        <p class="{mono} mt-4 text-[10px] text-secondary">
          Solo (no boost): {soloCount} player{soloCount === 1 ? "" : "s"}
        </p>
      {/if}
    {:else}
      <p class="text-sm text-secondary">
        No same-nation links — pick players from the same nation to unlock
        synergy boosts.
      </p>
    {/if}
  </div>
</section>
