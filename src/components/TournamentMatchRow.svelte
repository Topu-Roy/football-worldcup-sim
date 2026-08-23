<script lang="ts">
  import { ChevronDown, ChevronUp } from "@lucide/svelte";
  import { outcomeBadge, outcomeColor, outcomeLabel } from "../lib/outcome.js";
  import {
    matchTeams,
    type Tournament,
    type TournamentMatch,
  } from "../lib/tournament.js";
  import type { MatchResult, Squad } from "../lib/types.js";
  import MatchView from "./MatchView.svelte";

  let {
    match,
    tournament,
    roundLabel,
    roundShort,
    expanded,
    active,
    liveScore,
    onToggle,
    onResult,
    onClose,
  }: {
    match: TournamentMatch;
    tournament: Tournament;
    roundLabel: string;
    roundShort: string;
    expanded: boolean;
    active: boolean;
    liveScore: [number, number] | null;
    onToggle: () => void;
    onResult: (r: MatchResult) => void;
    onClose: () => void;
  } = $props();

  const teams = $derived(matchTeams(tournament, match));
  // Resolve which side the user controls so MatchView always gets the user's XI on the home side.
  const userSquad = $derived<Squad | null>(
    teams.home.id === tournament.userSquad.id ? teams.home : teams.away,
  );
  const opponentSquad = $derived<Squad | null>(
    teams.home.id === tournament.userSquad.id ? teams.away : teams.home,
  );

  const opponent = $derived(
    match.home === tournament.userSquad.id
      ? tournament.squads[match.away]
      : tournament.squads[match.home],
  );

  /** Squad names embed the year ("Colombia 2014"); show just the nation name. */
  const opponentName = $derived(opponent.name.replace(/\s+\d{4}$/, ""));

  const badge = $derived(outcomeBadge(match, tournament.userSquad.id));

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<li
  class="overflow-hidden rounded-2xl border border-white/10 bg-slate/20 transition-colors duration-150"
  class:border-mint={expanded || active}
>
  <div
    class="flex items-center justify-between gap-2 px-3 py-2.5 {match.result
      ? 'cursor-pointer'
      : ''} sm:gap-3 sm:px-4 sm:py-3"
    role="button"
    tabindex="0"
    onclick={() => {
      if (match.result) onToggle();
    }}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (match.result) onToggle();
      }
    }}
  >
    <div class="min-w-0 flex-1">
      <p class="truncate font-bold">
        vs. {opponentName}
      </p>
    </div>
    <div
      class="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap sm:gap-4"
    >
      {#if roundLabel}
        <p class="{mono} text-[10px] text-secondary sm:hidden">{roundShort}</p>
        <p class="{mono} hidden text-[10px] text-secondary sm:block">
          {roundLabel}
        </p>
      {/if}
      {#if match.result}
        <span class={mono} style:color={outcomeColor(badge)}
          >{outcomeLabel(badge)}{match.result.penalties ? " (P)" : ""}
          {match.result.score[0]}–{match.result.score[1]}</span
        >
      {:else if active}
        <span class="flex items-center gap-2">
          <span
            class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-mint border-t-transparent"
            aria-hidden="true"
          ></span>
          <span class="{mono} text-mint">PLAYING</span>
          {#if liveScore}
            <span class="font-mono text-sm font-bold text-white"
              >{liveScore[0]}–{liveScore[1]}</span
            >
          {/if}
        </span>
      {:else}
        <span class="{mono} text-secondary">NOT PLAYED</span>
      {/if}
      {#if match.result}
        <span class="{mono} inline-flex items-center text-secondary">
          {#if expanded}
            <ChevronUp class="h-4 w-4" />
          {:else}
            <ChevronDown class="h-4 w-4" />
          {/if}
        </span>
      {/if}
    </div>
  </div>

  {#if expanded && userSquad && opponentSquad}
    <div class="border-t border-white/10">
      <MatchView
        {userSquad}
        {opponentSquad}
        {roundLabel}
        {onResult}
        onNext={onClose}
        regulationOnly={match.round === "group"}
        presetResult={match.result}
      />
    </div>
  {/if}
</li>
