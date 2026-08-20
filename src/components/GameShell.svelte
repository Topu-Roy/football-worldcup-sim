<script lang="ts">
  import FormationPicker from "./FormationPicker.svelte";
  import DraftApp from "./DraftApp.svelte";
  import type { Formation } from "../lib/types.js";

  type Tab = "formations" | "play";

  let tab = $state<Tab>("formations");
  let formation = $state<Formation | null>(null);
  let formationKey = $state("");

  function pickFormation(key: string, f: Formation) {
    const changed =
      formation === null ||
      formationKey !== key ||
      JSON.stringify(formation) !== JSON.stringify(f);
    if (formation && changed && !confirm("Changing formation restarts your draft. Continue?")) {
      return;
    }
    if (changed) {
      formation = f;
      formationKey = key;
    }
    tab = "play";
  }

  function goToFormations() {
    tab = "formations";
  }

  function resetAll() {
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
      <DraftApp {formation} {formationKey} onBack={goToFormations} />
    {:else}
      <div class="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p class="font-display text-3xl tracking-[0.5px]">No formation yet</p>
        <p class="max-w-md text-secondary">
          Pick a formation to unlock the draft. Your XI's shape locks the
          position limits for all 12 rounds.
        </p>
      </div>
    {/if}
  </div>
</div>