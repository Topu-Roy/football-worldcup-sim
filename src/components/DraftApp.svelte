<script lang="ts">
  import DraftBoard from "./DraftBoard.svelte";
  import ResultsView from "./ResultsView.svelte";
  import TeamReadyView from "./TeamReadyView.svelte";
  import TournamentView from "./TournamentView.svelte";
  import { buildUserSquad, DRAFT_ROUNDS } from "../lib/draft.js";
  import { swapPlayers as applySwap } from "../lib/draft.js";
  import { createTournament } from "../lib/tournament.js";
  import { upsertTournamentRecord } from "../lib/history.js";
  import type { Formation, Player, Squad } from "../lib/types.js";
  import type { Tournament as TournamentState } from "../lib/tournament.js";

  type Step = "draft" | "ready" | "tournament" | "results";

  let {
    formation,
    formationKey,
    onBack,
  }: {
    formation: Formation;
    formationKey: string;
    onBack?: () => void;
  } = $props();

  let step = $state<Step>("draft");
  let drafted = $state<Player[]>([]);
  let squad = $state<Squad | null>(null);
  let tournament = $state<TournamentState | null>(null);
  let hasRerun = $state(false);
  /** Bumped on reset so the draft board remounts with fresh internal state. */
  let resetNonce = $state(0);

  /** Back to a fresh draft, clearing any squad and tournament. */
  function reset() {
    drafted = [];
    squad = null;
    tournament = null;
    hasRerun = false;
    step = "draft";
    resetNonce += 1;
  }

  function handlePick(p: Player) {
    drafted = [...drafted, p];
  }

  function handleSwapDrafted(next: Player[]) {
    drafted = next;
  }

  /** First-time entry into the tournament from the final draft squad. */
  function startTournament() {
    if (!squad) return;
    tournament = createTournament(squad);
    step = "tournament";
  }

  /** Re-enter a fresh tournament with the same squad after a losing outcome. */
  function rerunTournament() {
    if (hasRerun) return;
    if (!squad) return;
    hasRerun = true;
    tournament = createTournament(squad);
    step = "tournament";
  }

  /** Swap two players between formation slots within the confirmed squad. */
  function swapPlayers(playerId: string, slotIndex: number) {
    if (!squad) return;
    const from = squad.players.find((p) => p.id === playerId);
    if (!from || from.assignedSlot === undefined) return;
    const next = applySwap(
      squad.players,
      formationKey,
      from.assignedSlot,
      slotIndex,
    );
    if (!next) return;
    squad = { ...squad, players: next };
  }

  $effect(() => {
    if (step === "draft" && drafted.length === DRAFT_ROUNDS) {
      squad = buildUserSquad(formation, drafted);
      step = "ready";
      requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
    }
  });

  $effect(() => {
    if (tournament?.phase === "ended" && step !== "results") {
      upsertTournamentRecord(tournament);
      step = "results";
    }
  });

  $effect(() => {
    const onReset = () => reset();
    window.addEventListener("wc:reset", onReset);
    return () => window.removeEventListener("wc:reset", onReset);
  });
</script>

<div class="min-h-screen bg-canvas text-white">
  {#if step === "draft"}
    {#key formationKey + "-" + resetNonce}
      <DraftBoard
        {formation}
        {formationKey}
        {onBack}
        onPick={handlePick}
        onSwapDrafted={handleSwapDrafted}
        onReset={reset}
      />
    {/key}
  {:else if step === "ready" && squad}
    <TeamReadyView
      {formationKey}
      {squad}
      onStart={startTournament}
      onReset={reset}
      onSwap={swapPlayers}
    />
  {:else if step === "tournament" && tournament}
    <TournamentView {tournament} onReset={reset} />
  {:else if step === "results" && tournament}
    <ResultsView
      {tournament}
      {formationKey}
      onReset={reset}
      onRerun={rerunTournament}
      canRerun={!hasRerun}
    />
  {/if}
</div>
