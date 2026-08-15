<script lang="ts">
  import FormationPicker from "./FormationPicker.svelte";
  import DraftBoard from "./DraftBoard.svelte";
  import ResultsView from "./ResultsView.svelte";
  import TeamReadyView from "./TeamReadyView.svelte";
  import TournamentView from "./TournamentView.svelte";
  import { buildUserSquad, DRAFT_ROUNDS, BENCH_SLOT } from "../lib/draft.js";
  import { swapPlayers as applySwap } from "../lib/draft.js";
  import { createTournament } from "../lib/tournament.js";
  import type { Formation, Player, Squad } from "../lib/types.js";
  import type { Tournament as TournamentState } from "../lib/tournament.js";

  type Step = "setup" | "draft" | "ready" | "tournament" | "results";

  let step = $state<Step>("setup");
  let formation = $state<Formation | null>(null);
  let formationKey = $state("");
  let drafted = $state<Player[]>([]);
  let squad = $state<Squad | null>(null);
  let tournament = $state<TournamentState | null>(null);

  function selectFormation(key: string, f: Formation) {
    formation = f;
    formationKey = key;
    step = "draft";
  }

  /** Back to formation picker, clearing the draft and any tournament. */
  function reset() {
    drafted = [];
    squad = null;
    tournament = null;
    step = "setup";
  }

  function handlePick(p: Player) {
    drafted = [...drafted, p];
  }

  function handleSwapDrafted(next: Player[]) {
    drafted = next;
  }

  /** First-time entry into the tournament from the final draft squad. */
  function startTournament() {
    if (!formation || !squad) return;
    tournament = createTournament(squad);
    step = "tournament";
  }

  /** Swap two players between formation slots (or the bench) within the confirmed squad. */
  function swapPlayers(playerId: string, slotIndex: number) {
    if (!squad || !formationKey) return;
    const combined = [...squad.players, ...(squad.bench ?? [])];
    const from = combined.find((p) => p.id === playerId);
    if (!from || from.assignedSlot === undefined) return;
    const next = applySwap(
      combined,
      formationKey,
      from.assignedSlot,
      slotIndex,
    );
    if (!next) return;
    squad = {
      ...squad,
      players: next.filter((p) => p.assignedSlot !== BENCH_SLOT),
      bench: next.filter((p) => p.assignedSlot === BENCH_SLOT),
    };
  }

  $effect(() => {
    if (step === "draft" && formation && drafted.length === DRAFT_ROUNDS) {
      squad = buildUserSquad(formation, drafted);
      step = "ready";
    }
  });

  $effect(() => {
    if (tournament?.phase === "ended") step = "results";
  });

  $effect(() => {
    const onReset = () => reset();
    window.addEventListener("wc:reset", onReset);
    return () => window.removeEventListener("wc:reset", onReset);
  });
</script>

<main class="min-h-screen bg-canvas text-white">
  {#if step === "setup"}
    <FormationPicker onSelect={selectFormation} />
  {:else if step === "draft" && formation}
    <DraftBoard
      {formation}
      {formationKey}
      onPick={handlePick}
      onSwapDrafted={handleSwapDrafted}
    />
  {:else if step === "ready" && formation && squad}
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
    <ResultsView {tournament} {formationKey} onReset={reset} />
  {/if}
</main>
