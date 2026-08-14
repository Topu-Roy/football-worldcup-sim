<script lang="ts">
  import { Repeat } from "@lucide/svelte";
  import { canonicalRole } from "../../lib/draft.js";

  let {
    role,
    slotIndex,
    isSwapTarget,
    onSwapTarget,
    selecting,
    placing,
    enabled,
    onSlotClick,
    starRole,
  }: {
    role: string;
    slotIndex: number;
    isSwapTarget: boolean;
    onSwapTarget?: (slotIndex: number) => void;
    /** True when the pitch is in "pick a slot" mode (a player is selected for placement). */
    selecting: boolean;
    /** True when only roles matching the selected player are placeable. */
    placing: boolean;
    enabled: boolean;
    onSlotClick?: (role: string, slotIndex: number) => void;
    /** Best-position role label to star matching slots, when applicable. */
    starRole: string | null;
  } = $props();

  const starred = $derived(
    !!starRole && canonicalRole(role) === canonicalRole(starRole),
  );
</script>

{#if isSwapTarget && onSwapTarget}
  <button
    type="button"
    class="relative flex h-11 w-11 animate-pulse cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-orange-500 bg-white font-mono text-sm font-bold tracking-wide text-black uppercase shadow-[0_0_16px_rgba(255,140,0,0.7)] hover:bg-orange-500"
    onclick={() => onSwapTarget(slotIndex)}
  >
    <Repeat class="h-4 w-4" />
    {#if starred}
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
    onclick={() => onSlotClick?.(role, slotIndex)}
  >
    {role}
    {#if starred}
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
    {role}
  </div>
{/if}
