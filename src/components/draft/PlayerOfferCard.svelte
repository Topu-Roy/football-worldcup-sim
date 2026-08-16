<script lang="ts">
  import { ChevronDown, Lock } from "@lucide/svelte";
  import { playerRating, playerTier, slotDepartment } from "../../lib/draft.js";
  import type { Player, Position } from "../../lib/types.js";

  let {
    player,
    selected,
    disabled,
    full,
    onClick,
  }: {
    player: Player;
    selected: boolean;
    disabled: boolean;
    /** True when this player's department already has its quota of drafted players. */
    full: boolean;
    onClick: () => void;
  } = $props();

  const tier = $derived(playerTier(player));
  const rating = $derived(playerRating(player));
  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const playerCard =
    "border border-white/15 rounded-[20px] bg-[#1a1a1a] p-3 transition-all duration-150 enabled:hover:border-mint enabled:hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed sm:p-5";
  const pillTag =
    "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase rounded-full py-1 px-2.5";

  /** Key stats shown on the card, selected per the player's department. */
  const STAT_ROWS: Record<Position, [string, keyof Player][]> = {
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

  const statRows = $derived(
    (STAT_ROWS[slotDepartment(player)] ?? []).map(([label, key]) => [
      label,
      (player[key as keyof Player] as number) ?? 0,
    ]),
  );

  /** On small screens stats are hidden behind an accordion; always visible from sm up. */
  let expanded = $state(false);
</script>

<div
  class="{playerCard} {selected ? 'card-selected' : ''} {tier === 'elite'
    ? 'card-elite'
    : tier === 'star'
      ? 'card-star'
      : ''} text-left"
>
  <div class="flex items-start justify-between gap-2">
    <button
      type="button"
      class="min-w-0 flex-1 text-left {disabled
        ? 'cursor-not-allowed opacity-45'
        : 'cursor-pointer'}"
      {disabled}
      onclick={onClick}
    >
      <div class="min-w-0">
        <p class="truncate text-lg font-bold">{player.name}</p>
      </div>
      <div class="mt-1 flex flex-wrap items-center gap-1">
        {#each player.positions as role (role)}
          <span
            class="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[1px] uppercase {role ===
            player.bestPosition
              ? 'bg-mint text-black'
              : 'border border-white/15 text-secondary'}"
          >
            {role}
          </span>
        {/each}
      </div>
    </button>

    <div class="flex shrink-0 flex-col items-end gap-2">
      {#if full}
        <span
          class="{pillTag} inline-flex shrink-0 items-center gap-1 bg-slate text-secondary"
        >
          <Lock class="h-3 w-3" /> FULL
        </span>
      {/if}
      {#if tier === "elite"}
        <span
          class="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border border-transparent bg-gradient-to-br from-[#ffd700] to-[#b45309] px-1.5 font-mono text-xs font-bold text-black"
          >★{rating}</span
        >
      {:else if tier === "star"}
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ffd23c]/60 bg-slate font-mono text-xs font-bold text-[#ffd23c]"
          >{rating}</span
        >
      {:else}
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mint/30 bg-slate font-mono text-xs text-mint"
          >{rating}</span
        >
      {/if}
      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center p-1 text-secondary transition-colors duration-150 hover:text-mint sm:hidden"
        aria-label="Toggle player stats"
        aria-expanded={expanded}
        onclick={() => (expanded = !expanded)}
      >
        <ChevronDown
          class="h-4 w-4 transition-transform duration-150 {expanded
            ? 'rotate-180'
            : ''}"
        />
      </button>
    </div>
  </div>
  <dl class="mt-4 space-y-1.5 {expanded ? 'block' : 'hidden sm:block'}">
    {#each statRows as [label, val] (label)}
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
</div>

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
