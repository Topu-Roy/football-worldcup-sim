<script lang="ts">
  import { assignSlots, BENCH_SLOT } from "../lib/draft.js";
  import type { Player } from "../lib/types.js";
  import PitchBackground from "./pitch/PitchBackground.svelte";
  import PitchEmptySlot from "./pitch/PitchEmptySlot.svelte";
  import PitchPlayerChip from "./pitch/PitchPlayerChip.svelte";

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
  const widthClass = $derived(
    size === "sm" ? "max-w-56 sm:max-w-64" : "max-w-sm sm:max-w-md",
  );

  /** The single bench player (outside the pitch), if assigned. */
  const benchPlayer = $derived(
    players.find((p) => p.assignedSlot === BENCH_SLOT) ?? null,
  );
  const benchEmpty = $derived(benchPlayer === null);

  const mono = "font-mono text-[10px] font-semibold tracking-[1.8px] uppercase";

  /** Best-position label of whichever player is currently selected (for placement or swap). */
  const selectionBest = $derived(
    selectedId
      ? (players.find((p) => p.id === selectedId)?.bestPosition ?? null)
      : bestPosition,
  );

  // Routing of clicks: a filled slot either picks a swap target (when a swap is
  // in progress) or selects the player; an empty slot is a placement candidate
  // (when a placement is in progress) or a swap destination.
  const selecting = $derived(onSlotClick !== undefined);
  const placing = $derived(selecting && selectableRoles !== null);

  let openTipId = $state<string | null>(null);

  // Close the out-of-position tooltip when the user clicks anywhere else.
  $effect(() => {
    if (!openTipId) return;
    function onDown() {
      openTipId = null;
    }
    document.addEventListener("click", onDown);
    return () => document.removeEventListener("click", onDown);
  });
</script>

<div class="mx-auto w-full {widthClass}">
  <div class="relative aspect-3/4 w-full">
    <PitchBackground {formationKey} {size} />

    {#each slots as s, i (i)}
      <div
        class="absolute -translate-x-1/2 -translate-y-1/2 text-center {openTipId ===
        s.player?.id
          ? 'z-40'
          : 'z-10'}"
        style:left={`${s.slot.x}%`}
        style:top={`${s.slot.y}%`}
      >
        {#if s.player}
          {@const player = s.player}
          <PitchPlayerChip
            {player}
            slotRole={s.slot.role}
            slotIndex={i}
            isTarget={swapTargets?.includes(i) ?? false}
            isSelected={selectedId === player.id}
            selectedBest={selectionBest}
            showTip={openTipId === player.id}
            onTipToggle={() =>
              (openTipId = openTipId === player.id ? null : player.id)}
            onSelect={() => {
              openTipId = null;
              if (swapTargets?.includes(i)) {
                onSwapTarget?.(i);
              } else {
                onPlayerClick?.(player.id);
              }
            }}
          />
        {:else}
          <PitchEmptySlot
            role={s.slot.role}
            slotIndex={i}
            isSwapTarget={swapTargets?.includes(i) ?? false}
            {onSwapTarget}
            {selecting}
            {placing}
            enabled={placing && (selectableRoles ?? []).includes(s.slot.role)}
            {onSlotClick}
            starRole={selectionBest}
          />
        {/if}
      </div>
    {/each}
  </div>

  <div class="mt-5">
    <p class="{mono} mb-2 text-center text-secondary">Bench</p>
    <div class="flex justify-center">
      {#if benchPlayer}
        {@const player = benchPlayer}
        <PitchPlayerChip
          {player}
          slotRole={player.bestPosition}
          slotIndex={BENCH_SLOT}
          isTarget={swapTargets?.includes(BENCH_SLOT) ?? false}
          isSelected={selectedId === player.id}
          selectedBest={selectionBest}
          showTip={openTipId === player.id}
          onTipToggle={() =>
            (openTipId = openTipId === player.id ? null : player.id)}
          onSelect={() => {
            openTipId = null;
            if (swapTargets?.includes(BENCH_SLOT)) {
              onSwapTarget?.(BENCH_SLOT);
            } else {
              onPlayerClick?.(player.id);
            }
          }}
        />
      {:else}
        <PitchEmptySlot
          role="BENCH"
          slotIndex={BENCH_SLOT}
          isSwapTarget={swapTargets?.includes(BENCH_SLOT) ?? false}
          {onSwapTarget}
          {selecting}
          {placing}
          enabled={placing && benchEmpty}
          {onSlotClick}
          starRole={null}
        />
      {/if}
    </div>
  </div>
</div>
