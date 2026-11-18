<script lang="ts">
  import TournamentMatchRow from "./TournamentMatchRow.svelte";
  import {
    aggregateStats,
    standingsFor,
    type Tournament,
    type TournamentMatch,
  } from "../lib/tournament.js";
  import Confetti from "./Confetti.svelte";
  import PitchView from "./PitchView.svelte";
  import ShareResultButton from "./ShareResultButton.svelte";
  import SquadStatsList from "./SquadStatsList.svelte";
  import StandingsTable from "./StandingsTable.svelte";
  import { outcomeTitle } from "../lib/shareCard.js";
  import { RotateCcw, Trophy, Play } from "@lucide/svelte";

  let {
    tournament,
    formationKey,
    onReset,
    onRerun,
    canRerun,
  }: {
    tournament: Tournament;
    formationKey: string;
    onReset: () => void;
    onRerun: () => void;
    canRerun: boolean;
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

  /** Last match the user played, used for the scoreline in the outcome banner. */
  const finalMatch = $derived(
    allUserMatches.length > 0
      ? allUserMatches[allUserMatches.length - 1]
      : null,
  );
  const finalOpponent = $derived(
    finalMatch
      ? tournament.squads[
          finalMatch.home === tournament.userSquad.id
            ? finalMatch.away
            : finalMatch.home
        ]
      : null,
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

  /** Expand/collapse a match card. */
  function toggleMatch(m: TournamentMatch) {
    expandedId = expandedId === m.id ? null : m.id;
  }

  /** The finished run is already saved in history, so start a new draft now. */
  function handlePlayAgain() {
    onReset();
  }

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";
  const pillSolid =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-black bg-mint border border-mint rounded-full px-5 py-2.5 transition-all duration-150 hover:brightness-110";
</script>

<section
  class="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:grid-cols-2 lg:items-start"
>
  {#if tournament.outcome === "champion"}
    <Confetti />
  {/if}

  <header
    class="flex w-full flex-wrap items-end justify-between gap-4 lg:col-span-2"
  >
    <div>
      <p class="{mono} text-mint">Your World Cup run</p>
      <h2
        class="font-display text-4xl leading-[0.85] tracking-[1px] sm:text-5xl"
      >
        World Cup Results
      </h2>
      <p class="{mono} mt-3 text-secondary">Tournament complete</p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <ShareResultButton {tournament} {formationKey} {stats} />
      <a
        href="/history/"
        target="_blank"
        rel="noopener"
        title="Opens in a new tab"
        class="{pillOutline} hidden items-center gap-2 lg:inline-flex"
      >
        View history
      </a>
      <button
        type="button"
        class="{pillOutline} inline-flex items-center gap-2"
        title="Clear this run and draft a new XI"
        onclick={handlePlayAgain}
      >
        <RotateCcw class="h-3.5 w-3.5" /> Play again
      </button>
    </div>
  </header>

  {#if tournament.outcome === "eliminated"}
    <div
      class="order-2 mx-auto w-full max-w-2xl rounded-3xl border border-white/15 bg-slate/30 p-4 sm:p-6 lg:col-span-2"
    >
      <p class="{mono} mb-4 text-secondary">FINAL GROUP STAGE TABLE</p>
      <div class="overflow-x-auto">
        <StandingsTable rows={standings} userId={tournament.userSquad.id} />
      </div>
    </div>
  {/if}

  <div
    class="order-1 w-full rounded-3xl border px-6 py-8 text-center sm:px-10 sm:py-10 lg:col-span-2 {tournament.outcome ===
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
      {outcomeTitle(tournament.outcome)}
    </p>
    {#if finalMatch && finalMatch.result && finalOpponent}
      <p
        class="mt-3 font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary uppercase"
      >
        {roundLabel(finalMatch)}: {finalMatch.result.score[0]}–{finalMatch
          .result.score[1]} vs {finalOpponent.name}{finalMatch.result.penalties
          ? " (pens)"
          : ""}
      </p>
    {/if}
    {#if tournament.outcome !== "champion" && canRerun}
      <div class="mt-5 flex flex-col items-center gap-2">
        <button
          type="button"
          class="{pillSolid} inline-flex min-h-11 items-center gap-2"
          title="Replay the tournament with the same XI"
          onclick={onRerun}
        >
          <Play class="h-3.5 w-3.5" /> Retry run
        </button>
        <p
          class="font-mono text-[10px] tracking-[1.5px] text-secondary uppercase"
        >
          One retry left · same XI, new draw
        </p>
      </div>
    {:else if tournament.outcome !== "champion" && !canRerun}
      <p class="mt-3 text-xs text-secondary">
        Retry already used. Start a new draft to chase a better run.
      </p>
    {/if}
  </div>

  <div
    class="order-4 w-full rounded-3xl border border-white/15 p-4 sm:p-6 lg:order-3"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <p class="font-display text-2xl">{tournament.userSquad.name}</p>
      <p class="{mono} text-secondary">{formationKey} · Fantasy XI</p>
    </div>

    <div class="mt-6">
      <PitchView players={tournament.userSquad.players} {formationKey} />
    </div>
  </div>

  <div
    class="order-6 w-full rounded-3xl border border-white/15 p-4 sm:p-6 lg:order-4"
  >
    <p class="{mono} mb-4 text-secondary">PLAYER STATS</p>
    <SquadStatsList squad={tournament.userSquad} />
  </div>

  <div class="order-7 w-full lg:hidden">
    <a
      href="/history/"
      target="_blank"
      rel="noopener"
      title="Opens in a new tab"
      class="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs font-semibold tracking-[1.5px] text-white uppercase transition-colors duration-150 hover:border-mint hover:text-mint"
    >
      View history
    </a>
  </div>

  {#if stats.played > 0}
    <div
      class="order-3 w-full rounded-3xl border border-white/15 p-4 sm:p-6 lg:order-5 lg:col-span-2"
    >
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
    <div
      class="order-5 w-full rounded-3xl border border-white/15 p-4 sm:p-6 lg:order-6 lg:col-span-2"
    >
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
            onClose={() => (expandedId = null)}
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
