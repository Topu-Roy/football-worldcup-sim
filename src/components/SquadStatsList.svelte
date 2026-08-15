<script lang="ts">
  import { ROLE_LABELS, effectiveDepartment, playerRating } from "../lib/draft.js";
  import type { Player, Squad } from "../lib/types.js";

  let { squad }: { squad: Squad } = $props();

  /** Key stats shown per player, grouped by their best-position department. */
  const DEPT_STATS: Record<string, [string, keyof Player][]> = {
    GK: [
      ["REF", "reflexes"],
      ["POS", "positioning"],
      ["DIS", "distribution"],
    ],
    DEF: [
      ["TAC", "tackling"],
      ["AER", "aerial"],
      ["PAC", "pace"],
    ],
    MID: [
      ["PAS", "passing"],
      ["DRB", "dribble"],
      ["WRK", "workRate"],
    ],
    ATT: [
      ["FIN", "finishing"],
      ["OFF", "offBall"],
      ["PAC", "pace"],
    ],
  };
  const DEPT_ORDER = ["GK", "DEF", "MID", "ATT"];

  /** Group the squad by the department they're actually assigned to (GK/DEF/MID/ATT), rating desc within each. */
  const squadByDept = $derived.by(() => {
    const buckets: Record<string, Player[]> = {};
    for (const p of squad.players) {
      const dept = effectiveDepartment(p);
      (buckets[dept] ??= []).push(p);
    }
    for (const players of Object.values(buckets)) {
      players.sort(
        (a, b) =>
          playerRating(b) - playerRating(a) || a.name.localeCompare(b.name),
      );
    }
    return DEPT_ORDER.map((dept) => ({
      dept,
      players: buckets[dept] ?? [],
    })).filter((x) => x.players.length > 0);
  });

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

{#each squadByDept as group (group.dept)}
  <p class="{mono} mb-2 pb-2 text-secondary">
    {ROLE_LABELS[group.dept] ?? group.dept}
  </p>
  <ul class="mb-4 space-y-1.5">
    {#each group.players as p (p.id)}
      <li
        class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-slate/20 px-3 py-1.5"
      >
        {#if p.jerseyNumber}
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-slate/30 font-mono text-[10px] font-semibold text-secondary"
            >{p.jerseyNumber}</span
          >
        {/if}
        <span class="min-w-28 truncate text-sm font-bold">{p.name}</span>
        <span class="ml-auto flex flex-wrap items-center gap-1.5">
          {#each DEPT_STATS[group.dept] ?? [] as [label, key] (label)}
            {#if p[key] != null}
              <span
                class="{mono} rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] text-secondary"
                >{label} {p[key]}</span
              >
            {/if}
          {/each}
          <span
            class="{mono} rounded-full bg-mint/15 px-1.5 py-0.5 text-[9px] text-mint"
            >OVR {playerRating(p)}</span
          >
        </span>
      </li>
    {/each}
  </ul>
{/each}

{#if (squad.bench ?? []).length > 0}
  <p class="{mono} mb-2 pb-2 text-secondary">Bench</p>
  <ul class="space-y-1.5">
    {#each squad.bench ?? [] as p (p.id)}
      <li
        class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-slate/20 px-3 py-1.5"
      >
        {#if p.jerseyNumber}
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-slate/30 font-mono text-[10px] font-semibold text-secondary"
            >{p.jerseyNumber}</span
          >
        {/if}
        <span class="min-w-28 truncate text-sm font-bold">{p.name}</span>
        <span class="ml-auto flex flex-wrap items-center gap-1.5">
          <span
            class="{mono} rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] text-secondary"
            >{ROLE_LABELS[p.bestPosition] ?? p.bestPosition}</span
          >
          <span
            class="{mono} rounded-full bg-mint/15 px-1.5 py-0.5 text-[9px] text-mint"
            >OVR {playerRating(p)}</span
          >
        </span>
      </li>
    {/each}
  </ul>
{/if}
