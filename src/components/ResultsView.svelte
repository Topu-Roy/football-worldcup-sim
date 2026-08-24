<script lang="ts">
  import TournamentMatchRow from "./TournamentMatchRow.svelte";
  import { NATION_NAMES } from "../lib/draft.js";
  import {
    aggregateStats,
    standingsFor,
    type Tournament,
    type TournamentMatch,
  } from "../lib/tournament.js";
  import Confetti from "./Confetti.svelte";
  import PitchView from "./PitchView.svelte";
  import SquadStatsList from "./SquadStatsList.svelte";
  import { RotateCcw, Trophy, Play } from "@lucide/svelte";

  let {
    tournament,
    formationKey,
    onReset,
    onRerun,
  }: {
    tournament: Tournament;
    formationKey: string;
    onReset: () => void;
    onRerun: () => void;
  } = $props();

  let expandedId = $state<string | null>(null);

  const standings = $derived(standingsFor(tournament));
  const stats = $derived(aggregateStats(tournament));

  const userGroupMatches = $derived(
    tournament.matches.filter((m) => m.isUser && m.round === "group"),
  );
  const knockoutOrder = ["r16", "qf", "sf", "final"];
  const userKnockoutMatches = $derived(
    knockoutOrder.flatMap((round) =>
      tournament.matches.filter((m) => m.isUser && m.round === round),
    ),
  );
  const allUserMatches = $derived([
    ...userGroupMatches,
    ...userKnockoutMatches,
  ]);

  /** Human-readable round caption for a user match (knockout rounds or group match index). */
  function roundLabel(m: TournamentMatch): string {
    if (m.round === "r16") return "Round of 16";
    if (m.round === "qf") return "Quarter-final";
    if (m.round === "sf") return "Semi-final";
    if (m.round === "final") return "Final";
    return "Group stage";
  }

  /** Compact round caption for small screens (full label stays on larger screens). */
  function roundShort(m: TournamentMatch): string {
    if (m.round === "r16") return "R16";
    if (m.round === "qf") return "QF";
    if (m.round === "sf") return "SF";
    if (m.round === "final") return "Final";
    return "Group";
  }

  /** Expand/collapse a match card. */
  function toggleMatch(m: TournamentMatch) {
    expandedId = expandedId === m.id ? null : m.id;
  }

  /** Format a signed goal-difference value, e.g. +3, 0, −2. */
  function formatSigned(n: number): string {
    if (n > 0) return `+${n}`;
    if (n < 0) return `−${Math.abs(n)}`;
    return "0";
  }

  /** Headline text for the tournament's final placement. */
  function outcomeTitle(o: string): string {
    if (o === "champion") return "CHAMPION";
    if (o === "runners-up") return "RUNNERS-UP";
    if (o === "semi-final-exit") return "SEMI-FINAL EXIT";
    if (o === "quarter-final-exit") return "QUARTER-FINAL EXIT";
    if (o === "round-of-16-exit") return "ROUND OF 16 EXIT";
    return "ELIMINATED IN GROUP STAGE";
  }

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";
  const pillSolid =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-black bg-mint border border-mint rounded-full px-5 py-2.5 transition-all duration-150 hover:brightness-110";
</script>

<section
  class="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12"
>
  {#if tournament.outcome === "champion"}
    <Confetti />
  {/if}

  <header class="flex w-full flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Tournament · 4 teams</p>
      <h2
        class="font-display text-4xl leading-[0.85] tracking-[1px] sm:text-5xl"
      >
        World Cup Results
      </h2>
      <p class="{mono} mt-3 text-secondary">Season complete</p>
    </div>
    <div class="flex items-center gap-3">
      {#if tournament.outcome !== "champion"}
        <button
          type="button"
          class="{pillSolid} inline-flex items-center gap-2"
          onclick={onRerun}
        >
          <Play class="h-3.5 w-3.5" /> Play again
        </button>
      {/if}
      <button
        type="button"
        class="{pillOutline} inline-flex items-center gap-2"
        onclick={onReset}
      >
        <RotateCcw class="h-3.5 w-3.5" /> Play
      </button>
    </div>
  </header>

  {#if tournament.outcome === "eliminated"}
    <div
      class="w-full max-w-2xl rounded-3xl border border-white/15 bg-slate/30 p-4 sm:p-6"
    >
      <p class="{mono} mb-4 text-secondary">FINAL GROUP STAGE TABLE</p>
      <div class="overflow-x-auto">
        {@render StandingsTable(standings, tournament.userSquad.id)}
      </div>
    </div>
  {/if}

  <div
    class="w-full rounded-3xl border px-6 py-8 text-center sm:px-10 sm:py-10 {tournament.outcome ===
    'champion'
      ? 'border-mint bg-mint/10'
      : 'border-pink/40 bg-pink/10'}"
  >
    <p class="{mono} text-secondary">TOURNAMENT OVER</p>
    {#if tournament.outcome === "champion"}
      <Trophy class="mx-auto mt-4 h-10 w-10 text-mint" stroke-width={1.5} />
    {/if}
    <p
      class="mt-3 font-display text-4xl tracking-[1px] sm:text-5xl md:text-6xl"
      style:color={tournament.outcome === "champion"
        ? "var(--color-mint)"
        : "var(--color-pink)"}
    >
      {outcomeTitle(tournament.outcome ?? "")}
    </p>
  </div>

  <div class="w-full rounded-3xl border border-white/15 p-4 sm:p-6">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <p class="font-display text-2xl">{tournament.userSquad.name}</p>
      <p class="{mono} text-secondary">
        {NATION_NAMES[tournament.userSquad.nation] ??
          tournament.userSquad.nation} ·
        {tournament.userSquad.wcYear}
      </p>
    </div>

    <div class="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <PitchView
        players={[
          ...tournament.userSquad.players,
          ...(tournament.userSquad.bench ?? []),
        ]}
        {formationKey}
      />

      <div>
        <SquadStatsList squad={tournament.userSquad} />
      </div>
    </div>
  </div>

  {#if stats.played > 0}
    <div class="w-full rounded-3xl border border-white/15 p-4 sm:p-6">
      <p class="{mono} mb-4 text-secondary">FINAL STATS</p>
      <div class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        {@render Stat("Won", String(stats.won))}
        {@render Stat("Drawn", String(stats.drawn))}
        {@render Stat("Lost", String(stats.lost))}
        {@render Stat("Points", String(stats.points))}
        {@render Stat("GF", String(stats.gf))}
        {@render Stat("GA", String(stats.ga))}
        {@render Stat("GD", String(stats.gd))}
        {@render Stat("Clean Sheets", String(stats.cleanSheets))}
        {@render Stat("Penalty Wins", String(stats.penaltyWins))}
      </div>
    </div>
  {/if}

  {#if allUserMatches.length > 0}
    <div class="w-full rounded-3xl border border-white/15 p-4 sm:p-6">
      <p class="{mono} mb-4 text-secondary">MATCH CARDS</p>
      <ul class="space-y-2 sm:space-y-3">
        {#each allUserMatches as m (m.id)}
          <TournamentMatchRow
            match={m}
            {tournament}
            roundLabel={roundLabel(m)}
            roundShort={roundShort(m)}
            expanded={expandedId === m.id}
            active={false}
            liveScore={null}
            onToggle={() => toggleMatch(m)}
            onResult={() => {}}
            onClose={() => {}}
          />
        {/each}
      </ul>
    </div>
  {/if}
</section>

{#snippet Stat(label: string, value: string)}
  <div
    class="rounded-2xl border border-white/10 bg-slate/20 px-3 py-2 text-center"
  >
    <p class="{mono} text-[9px] text-secondary">{label}</p>
    <p class="mt-1 font-display text-xl">{value}</p>
  </div>
{/snippet}

{#snippet StandingsTable(
  rows: import("../lib/tournament.js").GroupStanding[],
  userId: string | null,
)}
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="{mono} text-secondary">
        <th class="pr-3 pb-2">#</th>
        <th class="pr-3 pb-2">Team</th>
        <th class="pr-3 pb-2 text-center">P</th>
        <th class="pr-3 pb-2 text-center">W</th>
        <th class="pr-3 pb-2 text-center">D</th>
        <th class="pr-3 pb-2 text-center">L</th>
        <th class="pr-3 pb-2 text-center">GF</th>
        <th class="pr-3 pb-2 text-center">GA</th>
        <th class="pr-3 pb-2 text-center">GD</th>
        <th class="pb-2 text-center">Pts</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (row.squadId)}
        <tr class={row.squadId === userId ? "bg-mint/8" : ""}>
          <td class="py-2 pr-3 font-mono text-secondary">{i + 1}</td>
          <td class="py-2 pr-3 font-bold">
            {row.squadId === userId ? "You" : row.name}
            <span class="{mono} ml-2! text-secondary">
              {NATION_NAMES[row.nation] ?? row.nation}
            </span>
          </td>
          <td class="py-2 pr-3 text-center font-mono">{row.played}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.won}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.drawn}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.lost}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.gf}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.ga}</td>
          <td class="py-2 pr-3 text-center font-mono">{formatSigned(row.gd)}</td
          >
          <td class="py-2 text-center font-mono font-bold">{row.points}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}
