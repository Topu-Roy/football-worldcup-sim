<script lang="ts">
  import { Clock } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import type { Squad } from "../../lib/types.js";
  import { NATION_NAMES } from "../../lib/draft.js";

  let {
    userSquad,
    opponentSquad,
    roundLabel,
    userNationCount,
    userAvg,
    oppAvg,
    liveStatus,
    clockLabel,
    phase,
    showPens,
    pensScore,
    displayScore,
    controls,
    children,
  }: {
    userSquad: Squad;
    opponentSquad: Squad;
    roundLabel: string;
    userNationCount: number;
    userAvg: number;
    oppAvg: number;
    liveStatus: string;
    clockLabel: string;
    phase: "pre" | "play" | "pens" | "done";
    showPens: boolean;
    pensScore: [number, number];
    displayScore: [number, number];
    controls?: Snippet;
    children: Snippet;
  } = $props();

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<div
  class="mt-5 overflow-hidden rounded-3xl border border-white/15 bg-slate/30"
>
  <div
    class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-2"
  >
    <div class="flex items-center gap-3">
      <span class="{mono} text-[10px] text-mint">{roundLabel}</span>
      <span
        class="{mono} text-[10px] {phase === 'play'
          ? 'text-mint'
          : 'text-secondary'}">{liveStatus}</span
      >
      {#if phase === "play"}
        <span class="h-2 w-2 animate-pulse rounded-full bg-mint"></span>
      {/if}
    </div>
    <div class="flex items-center gap-1.5">
      <Clock class="h-3.5 w-3.5 text-secondary" />
      <p class="font-mono text-[15px] font-semibold text-white">{clockLabel}</p>
    </div>
    <div class="flex items-center gap-3">
      {#if showPens}
        <span class="{mono} text-[10px] text-yellow"
          >PENS {pensScore[0]} : {pensScore[1]}</span
        >
      {/if}
      {#if controls}
        {@render controls()}
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4">
    <div class="flex flex-col items-end">
      <span
        class="flex h-9 w-9 items-center justify-center rounded-full bg-mint font-display text-lg leading-none text-black"
        >XI</span
      >
      <p class="mt-1.5 font-display text-xl leading-none text-mint">
        Your team
      </p>
      <p class="{mono} mt-1.5 text-secondary">
        {userSquad.players.length} players · {userNationCount} same nation · AVG {userAvg}
      </p>
    </div>
    <div class="min-w-40 text-center">
      {#key displayScore[0] + "-" + displayScore[1]}
        <p
          class="score-bump font-mono text-5xl font-bold tracking-tight text-white"
        >
          {displayScore[0]}<span class="text-secondary">–</span
          >{displayScore[1]}
        </p>
      {/key}
    </div>
    <div class="flex flex-col items-start">
      <span
        class="flex h-9 w-9 items-center justify-center rounded-full bg-uv font-display text-lg leading-none text-white"
        >{opponentSquad.name.slice(0, 3).toUpperCase()}</span
      >
      <p class="mt-1.5 font-display text-xl leading-none text-secondary">
        {opponentSquad.name}
      </p>
      <p class="{mono} mt-1.5 text-secondary">
        {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear}
        · AVG {oppAvg}
      </p>
    </div>
  </div>

  <div class="px-6 py-3">
    {@render children()}
  </div>
</div>

<style>
  .score-bump {
    display: inline-block;
    animation: score-pop 0.45s ease-out;
  }

  @keyframes score-pop {
    0% {
      transform: scale(1.25);
      filter: brightness(1.8);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
</style>
