<script lang="ts">
  import { NATION_NAMES } from "../lib/draft.js";
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

  const badge = $derived(outcomeBadge(match, tournament.userSquad.id));

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<li
  class="overflow-hidden rounded-2xl border border-white/10 bg-slate/20 transition-colors duration-150"
  class:border-mint={expanded || active}
>
  <div
    class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 {match.result
      ? 'cursor-pointer'
      : ''}"
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
    <div>
      <p class="font-bold">
        vs. {opponent.name}
        <span class="{mono} ml-2! text-secondary">
          {NATION_NAMES[opponent.nation] ?? opponent.nation} · {opponent.wcYear}
        </span>
      </p>
      {#if roundLabel}
        <p class="{mono} mt-1 text-[10px] text-secondary">{roundLabel}</p>
      {/if}
    </div>
    <div class="flex items-center gap-4">
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
    <div class="border-t border-white/10 px-4 py-4">
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
