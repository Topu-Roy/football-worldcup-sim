<script lang="ts">
  import {
    ChartColumn,
    ChevronRight,
    LayoutGrid,
    Play,
    Trophy,
  } from "@lucide/svelte";
  import {
    formationOptions,
    DRAFT_ROUNDS,
    POSITION_LABEL,
  } from "../lib/draft.js";
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

  /** One-line play-style hint per formation key. */
  const styleHint: Record<string, string> = {
    "4-3-3": "Balanced · wide attack",
    "4-4-2": "Classic · twin strikers",
    "3-5-2": "Solid · wing-backs",
    "4-2-3-1": "Controlled · deep playmaker",
  };

  /** Dot color per department for the mini pitch preview. */
  const deptDot: Record<string, string> = {
    GK: "bg-mint",
    DEF: "bg-blue",
    MID: "bg-yellow",
    ATT: "bg-orange",
  };

  const steps = [
    {
      icon: LayoutGrid,
      title: "Pick your shape",
      text: `Choose from 4 classic formations. This sets the position limits for all ${DRAFT_ROUNDS} draft rounds.`,
    },
    {
      icon: Trophy,
      title: "Draft your XI",
      text: "Eleven rounds of picks. Each board fits an open slot, so you always have a player to choose.",
    },
    {
      icon: Play,
      title: "Auto-run the cup",
      text: "Your tournament simulates itself, match by match. Pause any run at any time.",
    },
    {
      icon: ChartColumn,
      title: "Replay & results",
      text: "Replay matches, compare squad stats, and see where you finish.",
    },
  ];

  const stats = [
    "4-team group",
    "11 draft rounds",
    "Group → knockout",
    "Replay any match",
  ];

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<section class="relative overflow-hidden">
  <div
    class="pointer-events-none absolute -top-48 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-mint/15 blur-[120px]"
  ></div>
  <div
    class="pointer-events-none absolute top-24 -left-32 h-64 w-64 rounded-full bg-uv/20 blur-[100px]"
  ></div>

  <div
    class="relative mx-auto max-w-5xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24 sm:pb-14"
  >
    <p class="{mono} text-mint">My World Cup XI</p>
    <h2
      class="mt-4 font-display text-6xl leading-[0.85] tracking-[1.07px] text-white sm:text-7xl md:text-8xl"
    >
      Pick your<br />formation
    </h2>
    <p class="mx-auto mt-6 max-w-xl text-secondary">
      Every XI needs a shape. Choose how many defenders, midfielders and
      attackers you'll draft. This sets the position limits across all 11
      rounds.
    </p>

    <ul class="mt-8 flex flex-wrap items-center justify-center gap-2">
      {#each stats as s (s)}
        <li
          class="rounded-full border border-white/15 bg-slate/40 px-4 py-1.5 font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary uppercase"
        >
          {s}
        </li>
      {/each}
    </ul>
  </div>

  <div class="relative mx-auto max-w-5xl px-4 pb-14 sm:px-6 sm:pb-20">
    <div class="grid gap-4 sm:grid-cols-2">
      {#each options as opt (opt.key)}
        <button
          type="button"
          class="group flex items-center gap-5 rounded-3xl border border-white/15 bg-slate/40 p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-mint hover:bg-slate/60 sm:p-6"
          onclick={() => onSelect(opt.key, opt.formation)}
        >
          <span
            class="flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-canvas/80 p-2.5"
          >
            {#each ["ATT", "MID", "DEF", "GK"] as dept (dept)}
              <span class="flex items-center justify-center gap-1">
                {#each Array(opt.formation[dept as keyof Formation]) as _, i (dept + i)}
                  <span
                    class="h-1.5 w-1.5 rounded-full {deptDot[dept]}"
                    aria-hidden="true"
                  ></span>
                {/each}
              </span>
            {/each}
          </span>
          <span class="min-w-0 flex-1">
            <span
              class="block font-display text-3xl tracking-[0.5px] text-white transition-colors duration-150 group-hover:text-mint sm:text-4xl"
              >{opt.key}</span
            >
            <span
              class="mt-2 block font-mono text-[10px] font-semibold tracking-[1.8px] text-secondary uppercase"
            >
              {summary(opt.formation)}
            </span>
            <span class="mt-1.5 block text-xs text-secondary/80">
              {styleHint[opt.key] ?? "Pick a shape"}
            </span>
          </span>
          <ChevronRight
            class="h-6 w-6 shrink-0 text-secondary transition-all duration-150 group-hover:translate-x-1 group-hover:text-mint"
          />
        </button>
      {/each}
    </div>
  </div>
</section>

<section class="border-t border-white/10 bg-slate/20">
  <div class="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
    <p class="{mono} text-center text-mint">How it works</p>
    <h2
      class="mt-3 text-center font-display text-4xl leading-[0.9] tracking-[0.5px] sm:text-5xl"
    >
      Four rounds to glory
    </h2>
    <ol class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each steps as step, i (step.title)}
        <li
          class="flex flex-col rounded-2xl border border-white/10 bg-slate/40 p-5 transition-colors duration-150 hover:border-mint/40"
        >
          <span class="flex items-center justify-between">
            <step.icon class="h-5 w-5 text-mint" />
            <span
              class="font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary"
              >0{i + 1}</span
            >
          </span>
          <span class="mt-4 block font-display text-xl tracking-[0.5px]">
            {step.title}
          </span>
          <span class="mt-2 block text-xs leading-relaxed text-secondary">
            {step.text}
          </span>
        </li>
      {/each}
    </ol>
  </div>
</section>
