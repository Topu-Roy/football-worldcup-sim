<script lang="ts">
  import { NATION_NAMES } from "../lib/draft.js";
  import type { GroupStanding } from "../lib/tournament.js";

  let {
    rows,
    userId,
    qualifyLine = false,
  }: {
    rows: GroupStanding[];
    userId: string | null;
    /** Mark the top two rows as qualifying (group stage only). */
    qualifyLine?: boolean;
  } = $props();

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";

  /** Format a signed goal-difference value, e.g. +3, 0, −2. */
  function formatSigned(n: number): string {
    if (n > 0) return `+${n}`;
    if (n < 0) return `−${Math.abs(n)}`;
    return "0";
  }
</script>

<table class="w-full text-left text-sm">
  <thead>
    <tr class="{mono} text-secondary">
      <th class="pr-2 pb-2">#</th>
      <th class="pr-3 pb-2">Team</th>
      <th class="pr-2 pb-2 text-center">P</th>
      <th class="pr-2 pb-2 text-center">W</th>
      <th class="pr-2 pb-2 text-center">D</th>
      <th class="pr-2 pb-2 text-center">L</th>
      <th class="pr-2 pb-2 text-center">GF</th>
      <th class="pr-2 pb-2 text-center">GA</th>
      <th class="pr-2 pb-2 text-center">GD</th>
      <th class="pb-2 text-center">Pts</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i (row.squadId)}
      <tr
        class="{row.squadId === userId ? 'bg-mint/10' : ''} {qualifyLine &&
        i < 2
          ? 'border-l-2 border-mint'
          : 'border-l-2 border-transparent'}"
      >
        <td class="py-2 pr-2 font-mono text-secondary">{i + 1}</td>
        <td class="py-2 pr-3 font-bold">
          {row.squadId === userId ? "You" : row.name}
          <span class="{mono} ml-2! text-[9px] text-secondary">
            {NATION_NAMES[row.nation] ?? row.nation}
          </span>
        </td>
        <td class="py-2 pr-2 text-center font-mono">{row.played}</td>
        <td class="py-2 pr-2 text-center font-mono">{row.won}</td>
        <td class="py-2 pr-2 text-center font-mono">{row.drawn}</td>
        <td class="py-2 pr-2 text-center font-mono">{row.lost}</td>
        <td class="py-2 pr-2 text-center font-mono">{row.gf}</td>
        <td class="py-2 pr-2 text-center font-mono">{row.ga}</td>
        <td class="py-2 pr-2 text-center font-mono">{formatSigned(row.gd)}</td>
        <td class="py-2 text-center font-mono font-bold">{row.points}</td>
      </tr>
    {/each}
  </tbody>
</table>
