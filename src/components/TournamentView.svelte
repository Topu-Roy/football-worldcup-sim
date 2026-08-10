<script lang="ts">
import TournamentMatchRow from "./TournamentMatchRow.svelte";
import { NATION_NAMES } from "../lib/draft.js";
import { simulateMatchScript } from "../lib/matchEngine.js";
import { outcomeColor, outcomeLabel } from "../lib/outcome.js";
import {
  advanceToKnockout,
  aggregateStats,
  groupDone,
  matchTeams,
  nextUserMatch,
  registerUserResult,
  resolveKnockout,
  standingsFor,
  type Tournament,
  type TournamentMatch,
} from "../lib/tournament.js";
import type { MatchResult, MatchScript } from "../lib/types.js";

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

  // Auto-play run state: one match simulates (fast) at a time, advancing to the next when done.
  let running = $state(false);
  let activeId = $state<string | null>(null);
  let activeScript = $state<MatchScript | null>(null);
  let segIndex = $state(0);
  let penIndex = $state(0);

  const snaps = $derived(
    activeScript
      ? [...activeScript.regulation, ...(activeScript.extraTime ?? [])]
      : [],
  );
  const liveScore = $derived<[number, number] | null>(
    activeScript
      ? segIndex > 0
        ? snaps[segIndex - 1].score
        : [0, 0]
      : null,
  );

  /** Format a signed goal-difference value, e.g. +3, 0, −2. */
  function formatSigned(n: number): string {
    if (n > 0) return `+${n}`;
    if (n < 0) return `−${Math.abs(n)}`;
    return "0";
  }

  function startNewTournament() {
    stopRun();
    expandedId = null;
    onNewTournament();
  }

  function handleReset() {
    stopRun();
    expandedId = null;
    onReset();
  }

  /** Toggle the auto-play sequence: kicks off the next unplayed match, or pauses mid-run. */
  function startRun() {
    if (running) {
      running = false;
      return;
    }
    const next = nextUserMatch(tournament);
    if (!next) return;
    running = true;
    startMatch(next.id);
  }

  /** Stop the run and drop all live-sim state. */
  function stopRun() {
    running = false;
    activeId = null;
    activeScript = null;
    segIndex = 0;
    penIndex = 0;
  }

  /** Simulate the full script for a match (user always on the home side) and begin stepping it. */
  function startMatch(id: string) {
    const m = tournament.matches.find((x) => x.id === id);
    if (!m) return;
    const teams = matchTeams(tournament, m);
    const user = teams.home.id === tournament.userSquad.id ? teams.home : teams.away;
    const opp = teams.home.id === tournament.userSquad.id ? teams.away : teams.home;
    activeScript = simulateMatchScript(user, opp, {
      regulationOnly: m.round === "group",
    });
    segIndex = 0;
    penIndex = 0;
    activeId = id;
  }

  /** Advance one segment of the active script: snapshot, penalty kick, or finish. */
  function step() {
    if (!running || !activeScript) return;
    if (activeId && !tournament.matches.some((m) => m.id === activeId)) {
      stopRun();
      return;
    }
    if (segIndex < snaps.length) {
      segIndex += 1;
    } else if (activeScript.penalties && penIndex < activeScript.penalties.length) {
      penIndex += 1;
    } else {
      finishMatch();
    }
  }

  /** Record the finished result, advance the tournament phase, then start the next unplayed match. */
  function finishMatch() {
    if (!running || !activeScript || !activeId) return;
    const result = activeScript.result;
    registerUserResult(tournament, activeId, result);
    if (tournament.phase === "knockout") {
      resolveKnockout(tournament);
    } else if (groupDoneNow) {
      advanceToKnockout(tournament);
    }
    const next = nextUserMatch(tournament);
    if (next) {
      startMatch(next.id);
    } else {
      stopRun();
    }
  }

  $effect(() => {
    if (!running || !activeScript) return;
    const id = setInterval(step, 250);
    return () => clearInterval(id);
  });

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

  /** Human-readable round caption for a user match (knockout rounds or group match index). */
  function roundLabel(m: TournamentMatch): string {
    if (m.round === "r16") return "Round of 16";
    if (m.round === "qf") return "Quarter-final";
    if (m.round === "sf") return "Semi-final";
    if (m.round === "final") return "Final";
    const idx = userGroupMatches.findIndex((x) => x.id === m.id);
    return `Group stage · Match ${idx + 1} of 3`;
  }

  /** Register the result, then advance the tournament phase (knockout resolution or group exit). */
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

  /** Expand/collapse a played match's result panel. */
  function toggleMatch(m: TournamentMatch) {
    expandedId = expandedId === m.id ? null : m.id;
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
    <div class="flex items-center gap-3">
      <button type="button" class={pillSolid} onclick={startRun}>
        {running ? "Pause" : "Play"}
      </button>
      <button type="button" class={pillOutline} onclick={handleReset}
        >New draft</button
      >
    </div>
  </header>

  <div class="mt-10 rounded-3xl border border-white/15 p-6">
    <p class="{mono} mb-4 text-secondary">YOUR GROUP MATCHES</p>
    <ul class="space-y-3">
      {#each userGroupMatches as m (m.id)}
        <TournamentMatchRow
          match={m}
          {tournament}
          roundLabel={roundLabel(m)}
          expanded={expandedId === m.id}
          active={activeId === m.id}
          liveScore={activeId === m.id ? liveScore : null}
          onToggle={() => toggleMatch(m)}
          onResult={handleResult(m)}
          onClose={() => (expandedId = null)}
        />
      {/each}
    </ul>
  </div>

  {#if userKnockoutMatches.length > 0}
    <div class="mt-10 rounded-3xl border border-white/15 p-6">
      <p class="{mono} mb-4 text-secondary">YOUR KNOCKOUT MATCHES</p>
      <ul class="space-y-3">
        {#each userKnockoutMatches as m (m.id)}
          <TournamentMatchRow
            match={m}
            {tournament}
            roundLabel={roundLabel(m)}
            expanded={expandedId === m.id}
            active={activeId === m.id}
            liveScore={activeId === m.id ? liveScore : null}
            onToggle={() => toggleMatch(m)}
            onResult={handleResult(m)}
            onClose={() => (expandedId = null)}
          />
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
        <button type="button" class={pillOutline} onclick={handleReset}
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
