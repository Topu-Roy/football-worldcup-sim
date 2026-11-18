<script lang="ts">
  import FormationPicker from "./FormationPicker.svelte";
  import DraftApp from "./DraftApp.svelte";
  import { confirmAction } from "../lib/confirmDialog.js";
  import type { Formation } from "../lib/types.js";

  type Tab = "formations" | "play";

  // No in-progress game is restored: every visit starts on the formation picker.
  let tab = $state<Tab>("formations");
  let formation = $state<Formation | null>(null);
  let formationKey = $state("");

  /** Start a screen at the top after switching tabs. */
  function scrollToTop() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

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
      formation = f;
      formationKey = key;
    }
    tab = "play";
    scrollToTop();
  }

  function goToFormations() {
    tab = "formations";
    scrollToTop();
  }

  function resetAll() {
    formation = null;
    formationKey = "";
    tab = "formations";
    scrollToTop();
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
        <DraftApp {formation} {formationKey} onBack={goToFormations} />
      {/key}
    {:else}
      <div
        class="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <p class="font-display text-3xl tracking-[0.5px]">No formation yet</p>
        <p class="max-w-md text-secondary">
          Pick a formation to start the draft. Your XI's shape sets the position
          limits for all 11 rounds.
        </p>
      </div>
    {/if}
  </div>
</div>
