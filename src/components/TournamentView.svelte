<script lang="ts">
  import MatchView from "./MatchView.svelte";
  import { NATION_NAMES } from "../lib/draft.js";
  import {
    advanceToKnockout,
    aggregateStats,
    groupDone,
    matchTeams,
    registerUserResult,
    resolveKnockout,
    standingsFor,
    type Tournament,
    type TournamentMatch,
  } from "../lib/tournament.js";
  import type { MatchResult, Squad } from "../lib/types.js";

  let {
    tournament,
    onNewTournament,
    onReset,
  }: {
    tournament: Tournament;
    onNewTournament: () => void;
    onReset: () => void;
  } = $props();

  let expandedId = $state<string | null>(null);

  function formatSigned(n: number): string {
    if (n > 0) return `+${n}`;
    if (n < 0) return `−${Math.abs(n)}`;
    return "0";
  }

  function startNewTournament() {
    expandedId = null;
    onNewTournament();
  }

  const userGroupMatches = $derived(
    tournament.matches.filter((m) => m.isUser && m.round === "group"),
  );

  const groupDoneNow = $derived(groupDone(tournament));

  const standings = $derived(standingsFor(tournament));

  const stats = $derived(aggregateStats(tournament));

  const knockoutOrder = ["r16", "qf", "sf", "final"];
  const userKnockoutMatches = $derived(
    knockoutOrder.flatMap((round) =>
      tournament.matches.filter((m) => m.isUser && m.round === round),
    ),
  );

  function opponentOf(m: TournamentMatch): Squad {
    return m.home === tournament.userSquad.id
      ? tournament.squads[m.away]
      : tournament.squads[m.home];
  }

  function roundLabel(m: TournamentMatch): string {
    if (m.round === "r16") return "Round of 16";
    if (m.round === "qf") return "Quarter-final";
    if (m.round === "sf") return "Semi-final";
    if (m.round === "final") return "Final";
    const idx = userGroupMatches.findIndex((x) => x.id === m.id);
    return `Group stage · Match ${idx + 1} of 3`;
  }

  function handleResult(m: TournamentMatch) {
    return (r: MatchResult) => {
      registerUserResult(tournament, m.id, r);
      if (tournament.phase === "knockout") {
        resolveKnockout(tournament);
      } else if (groupDoneNow) {
        advanceToKnockout(tournament);
      }
      expandedId = null;
    };
  }

  function playMatch(m: TournamentMatch) {
    expandedId = m.id;
  }

  function toggleMatch(m: TournamentMatch) {
    expandedId = expandedId === m.id ? null : m.id;
  }

  function outcomeBadge(m: TournamentMatch): string {
    if (!m.result) return "";
    if (m.result.winner === null) return "D";
    const userHome = m.home === tournament.userSquad.id;
    return m.result.winner === (userHome ? 0 : 1) ? "W" : "L";
  }

  function outcomeColor(o: string): string {
    if (o === "W") return "var(--color-mint)";
    if (o === "L") return "var(--color-pink)";
    return "var(--color-secondary)";
  }

  function outcomeLabel(o: string): string {
    if (o === "W") return "WIN";
    if (o === "L") return "LOSS";
    if (o === "D") return "DRAW";
    return "";
  }

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
  const pillSmall =
    "font-mono text-[11px] font-semibold tracking-[1.4px] uppercase text-mint border border-mint rounded-full py-1.5 px-3.5 bg-transparent transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black disabled:opacity-30";
</script>

<section class="mx-auto max-w-6xl px-6 py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Tournament · 4 teams</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
        World Cup Run
      </h2>
      <p class="{mono} mt-3 text-secondary">
        {tournament.phase === "group"
          ? "Group stage · top 2 advance to knockouts"
          : "Knockout · win to advance"}
      </p>
    </div>
    <button type="button" class={pillOutline} onclick={onReset}
      >New draft</button
    >
  </header>

  <div class="mt-10 rounded-3xl border border-white/15 p-6">
    <p class="{mono} mb-4 text-secondary">YOUR GROUP MATCHES</p>
    <ul class="space-y-3">
      {#each userGroupMatches as m (m.id)}
        {@render MatchRow(m)}
      {/each}
    </ul>
  </div>

  {#if userKnockoutMatches.length > 0}
    <div class="mt-10 rounded-3xl border border-white/15 p-6">
      <p class="{mono} mb-4 text-secondary">YOUR KNOCKOUT MATCHES</p>
      <ul class="space-y-3">
        {#each userKnockoutMatches as m (m.id)}
          {@render MatchRow(m, roundLabel(m))}
        {/each}
      </ul>
    </div>
  {/if}

  {#if tournament.phase === "ended"}
    <div class="mt-10 flex flex-col items-center gap-8">
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

      <div
        class="w-full overflow-x-auto rounded-3xl border border-white/15 p-6"
      >
        <p class="{mono} mb-4 text-secondary">MATCH RESULTS</p>
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="{mono} text-secondary">
              <th class="pr-4 pb-3">Round</th>
              <th class="pr-4 pb-3">Opponent</th>
              <th class="pr-4 pb-3">Score</th>
              <th class="pr-4 pb-3">Result</th>
              <th class="pb-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {#each stats.matches as sm (sm.id)}
              <tr class="border-t border-white/10">
                <td class="{mono} py-3 pr-4 text-[10px] text-secondary"
                  >{sm.roundLabel}</td
                >
                <td class="py-3 pr-4 font-bold">{sm.opponentName}</td>
                <td class="py-3 pr-4 font-mono"
                  >{sm.result.score[0]}–{sm.result.score[1]}</td
                >
                <td
                  class="{mono} py-3 pr-4 text-[10px]"
                  style:color={outcomeColor(sm.outcome)}
                >{outcomeLabel(sm.outcome)}{sm.result.penalties
                  ? " (P)"
                  : ""}</td
                >
                <td class="{mono} py-3 text-[10px] text-secondary"
                  >{sm.result.penalties
                    ? "pens"
                    : sm.result.extraTime
                      ? "ET"
                      : "90'"}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex gap-4">
        <button type="button" class={pillOutline} onclick={startNewTournament}
          >New tournament (same XI)</button
        >
        <button type="button" class={pillOutline} onclick={onReset}
          >New draft</button
        >
      </div>
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
        <tr class={row.squadId === userId ? "bg-mint/[0.08]" : ""}>
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

{#snippet MatchRow(m: TournamentMatch, subtitle = "")}
  <li
    class="overflow-hidden rounded-2xl border border-white/10 bg-slate/20"
    class:border-mint={expandedId === m.id}
  >
    <div
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 {m.result
        ? 'cursor-pointer'
        : ''}"
      role="button"
      tabindex="0"
      onclick={() => {
        if (m.result) toggleMatch(m);
      }}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (m.result) toggleMatch(m);
        }
      }}
    >
      <div>
        <p class="font-bold">
          vs. {opponentOf(m).name}
          <span class="{mono} ml-2! text-secondary">
            {NATION_NAMES[opponentOf(m).nation] ?? opponentOf(m).nation} · {opponentOf(
              m,
            ).wcYear}
          </span>
        </p>
        {#if subtitle}
          <p class="{mono} mt-1 text-[10px] text-secondary">{subtitle}</p>
        {/if}
      </div>
      <div class="flex items-center gap-4">
        {#if m.result}
          <span class={mono} style:color={outcomeColor(outcomeBadge(m))}
            >{outcomeLabel(outcomeBadge(m))}{m.result.penalties ? " (P)" : ""}
            {m.result.score[0]}–{m.result.score[1]}</span
          >
        {:else}
          <span class="{mono} text-secondary">NOT PLAYED</span>
        {/if}
        {#if m.result}
          <span class="{mono} text-secondary">{expandedId === m.id ? "▴" : "▾"}</span>
        {:else if expandedId !== m.id}
          <button
            type="button"
            class={pillSmall}
            onclick={() => playMatch(m)}
          >
            Play
          </button>
        {/if}
      </div>
    </div>
    {#if expandedId === m.id}
      <div class="border-t border-white/10 px-4 py-4">
        {@render MatchPanel(m)}
      </div>
    {/if}
  </li>
{/snippet}

{#snippet MatchPanel(m: TournamentMatch)}
  {@const teams = matchTeams(tournament, m)}
  <MatchView
    userSquad={teams.home.id === tournament.userSquad.id
      ? teams.home
      : teams.away}
    opponentSquad={teams.home.id === tournament.userSquad.id
      ? teams.away
      : teams.home}
    roundLabel={roundLabel(m)}
    onResult={handleResult(m)}
    onNext={() => (expandedId = null)}
    regulationOnly={m.round === "group"}
    presetResult={m.result}
    autoStart={expandedId === m.id && !m.result}
  />
{/snippet}
