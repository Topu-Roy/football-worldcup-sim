<script lang="ts">
  import FormationPicker from "./FormationPicker.svelte";
  import DraftApp from "./DraftApp.svelte";
  import { loadGame, clearGame, type SavedGame } from "../lib/gameSession.js";
  import { confirmAction } from "../lib/confirmDialog.js";
  import type { Formation } from "../lib/types.js";

  type Tab = "formations" | "play";

  // This shell only renders on the client, so reading storage during
  // initialisation is safe (no SSR/hydration mismatch).
  const saved = loadGame();

  let initialGame = $state<SavedGame | null>(saved);
  let tab = $state<Tab>(saved ? "play" : "formations");
  let formation = $state<Formation | null>(saved?.formation ?? null);
  let formationKey = $state(saved?.formationKey ?? "");

  async function pickFormation(key: string, f: Formation) {
    const changed =
      formation === null ||
      formationKey !== key ||
      JSON.stringify(formation) !== JSON.stringify(f);
    if (formation && changed) {
      const ok = await confirmAction({
        title: "Change formation?",
        message: "Changing shape restarts your draft.",
        confirmLabel: "Change formation",
      });
      if (!ok) return;
    }
    if (changed) {
      initialGame = null;
      clearGame();
      formation = f;
      formationKey = key;
    }
    tab = "play";
  }

  function goToFormations() {
    tab = "formations";
  }

  function resetAll() {
    initialGame = null;
    clearGame();
    formation = null;
    formationKey = "";
    tab = "formations";
  }

  $effect(() => {
    const onReset = () => resetAll();
    window.addEventListener("wc:reset", onReset);
    return () => window.removeEventListener("wc:reset", onReset);
  });
</script>

<div class="game-shell min-h-screen bg-canvas text-white">
  <div class:hidden={tab !== "formations"}>
    <FormationPicker onSelect={pickFormation} />
  </div>

  <div class:hidden={tab !== "play"}>
    {#if formation && formationKey}
      {#key formationKey}
        <DraftApp
          {formation}
          {formationKey}
          initial={initialGame}
          onBack={goToFormations}
        />
      {/key}
    {:else}
      <div
        class="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <p class="font-display text-3xl tracking-[0.5px]">No formation yet</p>
        <p class="max-w-md text-secondary">
          Pick a formation to unlock the draft. Your XI's shape locks the
          position limits for all 11 rounds.
        </p>
      </div>
    {/if}
  </div>
</div>
