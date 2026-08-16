<script lang="ts">
  import { Clock } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import type { Squad } from "../../lib/types.js";
  import { NATION_NAMES } from "../../lib/draft.js";

  let {
    userSquad,
    opponentSquad,
    roundLabel,
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
    class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 sm:px-5"
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
    <div class="flex flex-wrap items-center justify-end gap-3">
      <div class="flex items-center gap-1.5">
        <Clock class="h-3.5 w-3.5 text-secondary" />
        <p class="font-mono text-[15px] font-semibold text-white">
          {clockLabel}
        </p>
      </div>
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

  <div
    class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4 sm:gap-3 sm:px-5"
  >
    <div class="flex min-w-0 flex-col items-end">
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full bg-mint font-display text-base leading-none text-black sm:h-9 sm:w-9 sm:text-lg"
        >XI</span
      >
      <p
        class="mt-1.5 truncate font-display text-lg leading-none text-mint sm:text-xl"
      >
        Your team
      </p>
      <p class="{mono} mt-1.5 text-secondary">
        {userSquad.players.length} players
      </p>
    </div>
    <div class="min-w-28 text-center sm:min-w-40">
      {#key displayScore[0] + "-" + displayScore[1]}
        <p
          class="score-bump font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {displayScore[0]}<span class="text-secondary">–</span
          >{displayScore[1]}
        </p>
      {/key}
    </div>
    <div class="flex min-w-0 flex-col items-start">
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full bg-uv font-display text-base leading-none text-white sm:h-9 sm:w-9 sm:text-lg"
        >{opponentSquad.name.slice(0, 3).toUpperCase()}</span
      >
      <p
        class="mt-1.5 w-full truncate font-display text-lg leading-none text-secondary sm:text-xl"
      >
        {opponentSquad.name}
      </p>
      <p class="{mono} mt-1.5 text-secondary">
        {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear}
      </p>
    </div>
  </div>

  <div class="px-4 py-3 sm:px-6">
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
