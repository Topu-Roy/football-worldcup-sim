<script lang="ts">
  import {
    ROLE_LABELS,
    assignSlots,
    assignedRole,
    canonicalRole,
    outOfPosition,
    roleNerf,
  } from "../lib/draft.js";
  import type { Player } from "../lib/types.js";

  let {
    players,
    formationKey,
    size = "md",
    onSlotClick,
    selectableRoles = null,
    bestPosition = null,
    selectedId = null,
    swapTargets = null,
    onSwapTarget,
    onPlayerClick,
  }: {
    players: Player[];
    formationKey: string;
    size?: "sm" | "md";
    onSlotClick?: (role: string, slotIndex: number) => void;
    selectableRoles?: string[] | null;
    bestPosition?: string | null;
    selectedId?: string | null;
    swapTargets?: number[] | null;
    onSwapTarget?: (slotIndex: number) => void;
    onPlayerClick?: (playerId: string) => void;
  } = $props();

  const slots = $derived(assignSlots(players, formationKey));
  const widthClass = $derived(size === "sm" ? "max-w-64" : "max-w-md");
  const selectedBest = $derived(
    selectedId
      ? (players.find((p) => p.id === selectedId)?.bestPosition ?? null)
      : null,
  );

  let openTipId = $state<string | null>(null);

  $effect(() => {
    if (!openTipId) return;
    function onDown() {
      openTipId = null;
    }
    document.addEventListener("click", onDown);
    return () => document.removeEventListener("click", onDown);
  });
</script>

<div class="relative mx-auto aspect-3/4 w-full {widthClass}">
  <svg
    viewBox="0 0 600 800"
    class="absolute inset-0 h-full w-full overflow-hidden rounded-2xl"
    preserveAspectRatio="none"
  >
    <defs>
      <clipPath id="pitch-clip-{formationKey}-{size}">
        <rect x="0" y="0" width="600" height="800" rx="16" ry="16" />
      </clipPath>
    </defs>

    <g clip-path="url(#pitch-clip-{formationKey}-{size})">
      <rect x="0" y="0" width="600" height="800" fill="#207238" />

      <g fill="#278140">
        <rect x="0" y="0" width="600" height="53.33" />
        <rect x="0" y="106.66" width="600" height="53.33" />
        <rect x="0" y="213.33" width="600" height="53.33" />
        <rect x="0" y="320" width="600" height="53.33" />
        <rect x="0" y="426.66" width="600" height="53.33" />
        <rect x="0" y="533.33" width="600" height="53.33" />
        <rect x="0" y="640" width="600" height="53.33" />
        <rect x="0" y="746.66" width="600" height="53.33" />
      </g>

      <rect
        x="25"
        y="25"
        width="550"
        height="750"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <line
        x1="25"
        y1="400"
        x2="575"
        y2="400"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle
        cx="300"
        cy="400"
        r="85"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="400" r="4" fill="#7cb68d" />

      <rect
        x="130"
        y="25"
        width="340"
        height="135"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="225"
        y="25"
        width="150"
        height="45"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="250"
        y="10"
        width="100"
        height="15"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="115" r="4" fill="#7cb68d" />
      <path
        d="M 235 160 A 85 85 0 0 0 365 160"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />

      <rect
        x="130"
        y="640"
        width="340"
        height="135"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="225"
        y="730"
        width="150"
        height="45"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="250"
        y="775"
        width="100"
        height="15"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="685" r="4" fill="#7cb68d" />
      <path
        d="M 235 640 A 85 85 0 0 1 365 640"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />

      <path
        d="M 25 40 A 15 15 0 0 0 40 25"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 560 25 A 15 15 0 0 0 575 40"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 25 760 A 15 15 0 0 0 40 775"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 560 775 A 15 15 0 0 0 575 760"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
    </g>
  </svg>

  {#each slots as s, i (i)}
    {#if s.player}
      {@const p = s.player}
      {@const isSelected = selectedId === p.id}
      {@const isTarget = swapTargets?.includes(i) ?? false}
      <div
        class="absolute -translate-x-1/2 -translate-y-1/2 text-center {openTipId ===
        p.id
          ? 'z-40'
          : 'z-10'}"
        style:left={`${s.slot.x}%`}
        style:top={`${s.slot.y}%`}
      >
        <div class="relative flex flex-col items-center gap-1">
          <div class="relative">
            <button
              type="button"
              disabled={!onPlayerClick && !onSwapTarget}
              class="relative flex h-11 w-11 items-center justify-center rounded-full border-2 font-mono text-base font-bold shadow-lg transition-all duration-150 {isTarget
                ? 'animate-pulse cursor-pointer border-mint bg-white text-black shadow-[0_0_16px_rgba(60,255,208,0.7)] hover:bg-mint'
                : isSelected
                  ? 'cursor-pointer border-yellow bg-white text-black shadow-[0_0_14px_rgba(255,210,60,0.6)]'
                  : outOfPosition(p)
                    ? 'cursor-pointer border-red-500 bg-white text-black hover:border-red-300'
                    : 'cursor-pointer border-white/90 bg-white text-black hover:border-mint hover:text-black'}"
              onclick={() => {
                openTipId = null;
                if (isTarget) {
                  onSwapTarget?.(i);
                } else {
                  onPlayerClick?.(p.id);
                }
              }}
            >
              {p.jerseyNumber ?? i + 1}
            </button>
            {#if (isTarget || isSelected) &&
              selectedBest &&
              canonicalRole(s.slot.role) === canonicalRole(selectedBest)}
              <span
                class="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow text-[10px] leading-none text-black"
                >★</span
              >
            {/if}
            {#if outOfPosition(p)}
              <button
                type="button"
                class="absolute -top-2 -right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-white/40 bg-slate font-mono text-[11px] font-bold text-white/80 transition-colors duration-150 hover:bg-white hover:text-black"
                aria-label="Why is this player flagged?"
                onclick={(e) => {
                  e.stopPropagation();
                  openTipId = openTipId === p.id ? null : p.id;
                }}
              >
                ?
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
            {p.name}
          </span>
          {#if openTipId === p.id}
            <div
              class="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-xl border border-white/15 bg-slate p-3 text-left shadow-xl"
            >
              <p class="font-mono text-[9px] font-semibold tracking-[1.5px] text-red-400 uppercase"
                >Out of position</p
              >
              <p class="mt-1.5 truncate text-sm font-bold text-white">{p.name}</p>
              <dl class="mt-1.5 space-y-1 font-mono text-[10px]">
                <div class="flex items-center justify-between gap-2">
                  <dt class="text-secondary">Natural</dt>
                  <dd class="truncate font-semibold text-mint"
                    >{ROLE_LABELS[p.bestPosition] ?? p.bestPosition}</dd
                  >
                </div>
                <div class="flex items-center justify-between gap-2">
                  <dt class="text-secondary">Playing</dt>
                  <dd class="truncate font-semibold text-white"
                    >{ROLE_LABELS[assignedRole(p)] ?? assignedRole(p)}</dd
                  >
                </div>
                <div class="flex items-center justify-between gap-2">
                  <dt class="text-secondary">Penalty</dt>
                  <dd class="font-semibold text-red-400"
                    >−{Math.round((1 - roleNerf(p).factor) * 100)}% stats</dd
                  >
                </div>
              </dl>
              <p class="mt-2 font-mono text-[9px] leading-snug text-secondary"
                >Swap to a natural position to remove the penalty.</p
              >
            </div>
          {/if}
        </div>
      </div>
    {:else}
      {@const isTarget = swapTargets?.includes(i) ?? false}
      {@const selecting = onSlotClick !== undefined}
      {@const placing = selecting && selectableRoles !== null}
      {@const enabled = placing && selectableRoles.includes(s.slot.role)}
      <div
        class="absolute -translate-x-1/2 -translate-y-1/2"
        style:left={`${s.slot.x}%`}
        style:top={`${s.slot.y}%`}
      >
        {#if onSwapTarget && isTarget}
          <button
            type="button"
            class="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-orange-500 font-mono text-sm font-bold tracking-wide text-black uppercase animate-pulse cursor-pointer bg-white shadow-[0_0_16px_rgba(255,140,0,0.7)] hover:bg-orange-500"
            onclick={() => onSwapTarget?.(i)}
          >
            {s.slot.role}
            {#if selectedBest && canonicalRole(s.slot.role) === canonicalRole(selectedBest)}
              <span
                class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow text-[10px] leading-none text-black"
                >★</span
              >
            {/if}
          </button>
        {:else if selecting}
          <button
            type="button"
            disabled={placing && !enabled}
            class="relative flex h-14 w-14 items-center justify-center rounded-full border-2 font-mono text-base font-bold tracking-wide uppercase {enabled
              ? 'cursor-pointer border-dashed border-orange-500 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
              : placing
                ? 'cursor-not-allowed border-dashed border-white/15 bg-white/5 text-white/25'
                : 'cursor-default border-dashed border-white/50 bg-mint/10 text-white/60'}"
            onclick={() => onSlotClick?.(s.slot.role, i)}
          >
            {s.slot.role}
            {#if bestPosition && canonicalRole(s.slot.role) === canonicalRole(bestPosition)}
              <span
                class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow text-[10px] leading-none text-black"
                >★</span
              >
            {/if}
          </button>
        {:else}
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-white/50 bg-mint/10 font-mono text-base font-bold tracking-wide text-white/60 uppercase"
          >
            {s.slot.role}
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</div>
