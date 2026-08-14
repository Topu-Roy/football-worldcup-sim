<script lang="ts">
  import TournamentMatchRow from "./TournamentMatchRow.svelte";
  import {
    NATION_NAMES,
    ROLE_LABELS,
    effectiveDepartment,
    playerRating,
  } from "../lib/draft.js";
  import {
    aggregateStats,
    standingsFor,
    type Tournament,
    type TournamentMatch,
  } from "../lib/tournament.js";
  import type { Player } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";

  let {
    tournament,
    formationKey,
    onNewTournament,
    onReset,
  }: {
    tournament: Tournament;
    formationKey: string;
    onNewTournament: () => void;
    onReset: () => void;
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
    const idx = userGroupMatches.findIndex((x) => x.id === m.id);
    return `Group stage · Match ${idx + 1} of 3`;
  }

  /** Expand/collapse a match card. */
  function toggleMatch(m: TournamentMatch) {
    expandedId = expandedId === m.id ? null : m.id;
  }

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

  /** Group the drafted squad by the department they're actually assigned to (GK/DEF/MID/ATT), rating desc within each. */
  const squadByDept = $derived.by(() => {
    const buckets: Record<string, Player[]> = {};
    for (const p of tournament.userSquad.players) {
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
</script>

<section
  class="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-12"
>
  <header class="flex w-full flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Tournament · 4 teams</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
        World Cup Results
      </h2>
      <p class="{mono} mt-3 text-secondary">Season complete</p>
    </div>
    <div class="flex items-center gap-3">
      <button type="button" class={pillOutline} onclick={onNewTournament}
        >New tournament (same XI)</button
      >
      <button type="button" class={pillOutline} onclick={onReset}
        >New draft</button
      >
    </div>
  </header>

  {#if tournament.outcome === "eliminated"}
    <div
      class="w-full max-w-2xl rounded-3xl border border-white/15 bg-slate/30 p-6"
    >
      <p class="{mono} mb-4 text-secondary">FINAL GROUP STAGE TABLE</p>
      {@render StandingsTable(standings, tournament.userSquad.id)}
    </div>
  {/if}

  <div
    class="w-full rounded-3xl border px-10 py-10 text-center {tournament.outcome ===
    'champion'
      ? 'border-mint bg-mint/10'
      : 'border-pink/40 bg-pink/10'}"
  >
    <p class="{mono} text-secondary">TOURNAMENT OVER</p>
    <p
      class="mt-3 font-display text-6xl tracking-[1px]"
      style:color={tournament.outcome === "champion"
        ? "var(--color-mint)"
        : "var(--color-pink)"}
    >
      {outcomeTitle(tournament.outcome ?? "")}
    </p>
  </div>

  <div class="w-full rounded-3xl border border-white/15 p-6">
    <p class="{mono} mb-4 text-secondary">YOUR SQUAD</p>
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <p class="font-display text-2xl">{tournament.userSquad.name}</p>
      <p class="{mono} text-secondary">
        {NATION_NAMES[tournament.userSquad.nation] ??
          tournament.userSquad.nation} ·
        {tournament.userSquad.wcYear}
      </p>
    </div>

    <div class="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <PitchView players={tournament.userSquad.players} {formationKey} />

      <div>
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
                <span class="min-w-28 truncate text-sm font-bold">{p.name}</span
                >
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
      </div>
    </div>
  </div>

  {#if stats.played > 0}
    <div class="w-full rounded-3xl border border-white/15 p-6">
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
    <div class="w-full rounded-3xl border border-white/15 p-6">
      <p class="{mono} mb-4 text-secondary">MATCH CARDS</p>
      <ul class="space-y-3">
        {#each allUserMatches as m (m.id)}
          <TournamentMatchRow
            match={m}
            {tournament}
            roundLabel={roundLabel(m)}
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
