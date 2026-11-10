<script lang="ts">
  import { Pause, Play, RotateCcw } from "@lucide/svelte";
  import TournamentMatchRow from "./TournamentMatchRow.svelte";
  import StandingsTable from "./StandingsTable.svelte";
  import { confirmAction } from "../lib/confirmDialog.js";
  import { simulateMatchScript } from "../lib/matchEngine.js";
  import {
    advanceToKnockout,
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
    onReset,
  }: {
    tournament: Tournament;
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
    activeScript ? (segIndex > 0 ? snaps[segIndex - 1].score : [0, 0]) : null,
  );

  async function handleReset() {
    const ok = await confirmAction({
      title: "Quit this run?",
      message: "Your current tournament progress is lost.",
      confirmLabel: "Quit run",
      danger: true,
    });
    if (!ok) return;
    stopRun();
    expandedId = null;
    onReset();
  }

  /** Toggle the auto-play sequence: kicks off the next unplayed match, resumes a paused one, or pauses mid-run. */
  function startRun() {
    if (running) {
      running = false;
      return;
    }
    // Resume the paused script instead of re-simulating and resetting it.
    if (activeId && activeScript) {
      running = true;
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
    const user =
      teams.home.id === tournament.userSquad.id ? teams.home : teams.away;
    const opp =
      teams.home.id === tournament.userSquad.id ? teams.away : teams.home;
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
    } else if (
      activeScript.penalties &&
      penIndex < activeScript.penalties.length
    ) {
      penIndex += 1;
    } else {
      finishMatch();
    }
  }

  /** Record the finished result, advance the tournament phase, then start the next unplayed match. */
  function finishMatch() {
    if (!running || !activeScript || !activeId) return;
    const result = activeScript.result;
    registerUserResult(tournament, activeId, result, activeScript);
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

  // Pause when the tab is hidden so a run never finishes while the user is away.
  $effect(() => {
    const onVisibility = () => {
      if (document.hidden) running = false;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  });

  const userGroupMatches = $derived(
    tournament.matches.filter((m) => m.isUser && m.round === "group"),
  );

  const standings = $derived(standingsFor(tournament));
  const groupPlayed = $derived(userGroupMatches.filter((m) => m.result).length);
  const groupTotal = $derived(userGroupMatches.length || 3);

  const groupDoneNow = $derived(groupDone(tournament));

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

  /** Register the result, then advance the tournament phase (knockout resolution or group exit). */
  function handleResult(m: TournamentMatch) {
    return (r: MatchResult, script?: MatchScript) => {
      registerUserResult(tournament, m.id, r, script);
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

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";
  const pillSolid =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-black bg-mint border border-mint rounded-full px-5 py-2.5 transition-all duration-150 hover:brightness-110";
</script>

<section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Tournament · 4 teams</p>
      <h2
        class="font-display text-4xl leading-[0.85] tracking-[1px] sm:text-5xl"
      >
        World Cup Run
      </h2>
      <p class="{mono} mt-3 text-secondary">
        {tournament.phase === "group"
          ? "Group stage · top 2 advance to knockouts"
          : "Knockout · win to advance"}
      </p>
      {#if !running && groupPlayed === 0 && tournament.phase === "group"}
        <p class="mt-3 max-w-md text-sm text-secondary">
          Your XI is set. Play three group matches, then the knockout rounds.
          Press Play to simulate — you can pause at any time.
        </p>
      {/if}
    </div>
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="{pillSolid} inline-flex items-center gap-2"
        onclick={startRun}
      >
        {#if running}
          <Pause class="h-3.5 w-3.5" /> Pause
        {:else}
          <Play class="h-3.5 w-3.5" /> Play
        {/if}
      </button>
      <button
        type="button"
        class="{pillOutline} inline-flex items-center gap-2"
        onclick={handleReset}><RotateCcw class="h-3.5 w-3.5" /> Quit run</button
      >
    </div>
  </header>

  {#if tournament.phase === "group"}
    <div class="mt-10 rounded-3xl border border-white/15 p-4 sm:p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p class="{mono} text-secondary">GROUP TABLE</p>
        <p class="{mono} text-[10px] text-secondary">Top 2 advance</p>
      </div>
      <div class="overflow-x-auto">
        <StandingsTable
          rows={standings}
          userId={tournament.userSquad.id}
          qualifyLine
        />
      </div>
    </div>
  {/if}

  <div class="mt-10 rounded-3xl border border-white/15 p-4 sm:p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <p class="{mono} text-secondary">GROUP MATCHES</p>
      <p class="{mono} text-[10px] text-secondary">
        {groupPlayed}/{groupTotal} played
      </p>
    </div>
    <ul class="space-y-3">
      {#each userGroupMatches as m (m.id)}
        <TournamentMatchRow
          match={m}
          {tournament}
          roundLabel={roundLabel(m)}
          roundShort={roundShort(m)}
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
    <div class="mt-10 rounded-3xl border border-white/15 p-4 sm:p-6">
      <p class="{mono} mb-4 text-secondary">YOUR KNOCKOUT MATCHES</p>
      <ul class="space-y-3">
        {#each userKnockoutMatches as m (m.id)}
          <TournamentMatchRow
            match={m}
            {tournament}
            roundLabel={roundLabel(m)}
            roundShort={roundShort(m)}
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
</section>
