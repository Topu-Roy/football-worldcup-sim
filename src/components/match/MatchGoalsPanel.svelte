<script lang="ts">
  import type { MatchEvent } from "../../lib/types.js";

  let {
    events,
    teamName,
  }: {
    events: MatchEvent[];
    teamName: (t: 0 | 1) => string;
  } = $props();

  const sorted = $derived(
    events.slice().sort((a, b) => a.minute - b.minute),
  );

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<div class="rounded-2xl border border-white/10 bg-slate/20 p-4">
  <p class="{mono} text-[10px] text-secondary">GOALS</p>
  {#if sorted.length > 0}
    <ul class="mt-3 space-y-2">
      {#each sorted as ev (ev.minute + "-" + ev.teamIndex + "-" + (ev.scorerName ?? "goal"))}
        <li class="flex items-center gap-3 text-[13px]">
          <span class="w-11 shrink-0 font-mono text-xs text-secondary"
            >{ev.minute}'{ev.minute > 90 ? " ET" : ""}</span
          >
          <span
            class="h-2 w-2 shrink-0 rounded-full"
            style:background={ev.teamIndex === 0 ? "#3cffd0" : "#5200ff"}
          ></span>
          <span
            class="min-w-0 truncate font-semibold"
            style:color={ev.teamIndex === 0 ? "#3cffd0" : "#5200ff"}
            >{teamName(ev.teamIndex)}</span
          >
          <span class="ml-auto truncate text-secondary"
            >{ev.scorerName ?? "Goal"}</span
          >
        </li>
      {/each}
    </ul>
  {:else}
    <p class="{mono} mt-3 text-secondary">NO GOALS</p>
  {/if}
</div>