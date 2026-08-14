<script lang="ts">
  import { Check, X } from "@lucide/svelte";
  import type { PenaltyKick } from "../../lib/types.js";

  let { kicks }: { kicks: PenaltyKick[] } = $props();

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<div class="mt-4 rounded-2xl border border-white/15 p-4">
  <p class="{mono} mb-3 text-yellow">PENALTY SHOOTOUT</p>
  <ul class="space-y-1.5">
    {#each kicks as k, i (i)}
      <li
        class="flex items-center gap-3 text-[13px]"
        class:text-mint={k.team === 0}
        class:text-uv={k.team === 1}
      >
        <span class="w-6 font-mono text-xs text-secondary">R{k.round}</span>
        <span
          class="h-2 w-2 rounded-full"
          style:background={k.team === 0 ? "#3cffd0" : "#5200ff"}
        ></span>
        <span>{k.takerName}</span>
        <span
          class="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-[1px] uppercase {k.scored
            ? (k.team === 0 ? 'bg-mint/15 text-mint' : 'bg-uv/15 text-uv')
            : 'bg-white/5 text-secondary'}"
        >
          {#if k.scored}
            <Check class="h-3 w-3" />
          {:else}
            <X class="h-3 w-3" />
          {/if}
          {k.scored ? "SCORED" : "SAVED"}
        </span>
      </li>
    {/each}
  </ul>
</div>
