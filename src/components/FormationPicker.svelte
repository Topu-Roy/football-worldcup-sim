<script lang="ts">
  import { ChevronRight } from "@lucide/svelte";
  import { formationOptions, POSITION_LABEL } from "../lib/draft.js";
  import type { Formation } from "../lib/types.js";

  let { onSelect }: { onSelect: (key: string, formation: Formation) => void } =
    $props();
  const options = formationOptions();

  // e.g. "4 DEFs · 3 MIDs · 3 ATTs" — a compact breakdown of slot counts per department.
  const summary = (f: Formation) =>
    ["GK", "DEF", "MID", "ATT"]
      .map(
        (pos) =>
          `${f[pos as keyof Formation]} ${POSITION_LABEL[pos as keyof typeof POSITION_LABEL]}${f[pos as keyof Formation] > 1 ? "s" : ""}`,
      )
      .join(" · ");

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<section class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
  <p class="{mono} mb-4 text-mint">World Cup Draft Simulator</p>
  <h1
    class="font-display text-5xl leading-[0.85] tracking-[1.07px] sm:text-6xl md:text-7xl"
  >
    Pick your<br />formation
  </h1>
  <p class="mt-6 max-w-xl text-secondary">
    Every XI needs a shape. Choose how many defenders, midfielders and attackers
    you'll draft — this sets the position limits for all 11 rounds.
  </p>

  <div class="mt-12 grid gap-4 sm:grid-cols-2">
    {#each options as opt (opt.key)}
      <button
        type="button"
        class="group flex items-center justify-between rounded-3xl border border-white/15 bg-slate/40 p-5 text-left transition-colors duration-150 hover:border-mint sm:p-6"
        onclick={() => onSelect(opt.key, opt.formation)}
      >
        <span>
          <span class="font-display text-3xl text-white group-hover:text-mint sm:text-4xl"
            >{opt.key}</span
          >
          <span
            class="mt-3 block font-mono text-[11px] tracking-[1.8px] text-secondary uppercase"
          >
            {summary(opt.formation)}
          </span>
        </span>
        <ChevronRight
          class="h-6 w-6 text-secondary transition-all duration-150 group-hover:translate-x-1 group-hover:text-mint"
        />
      </button>
    {/each}
  </div>
</section>
