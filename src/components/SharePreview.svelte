<script lang="ts">
  import { onMount } from "svelte";
  import type { Component } from "svelte";
  import CardFrame from "./share-preview/CardFrame.svelte";
  import ShareCardDossier from "./share-preview/ShareCardDossier.svelte";
  import ShareCardDossierMirror from "./share-preview/ShareCardDossierMirror.svelte";
  import ShareCardTeamSheet from "./share-preview/ShareCardTeamSheet.svelte";
  import ShareCardTeamSheetWide from "./share-preview/ShareCardTeamSheetWide.svelte";
  import {
    SHARE_PREVIEW_VARIANTS,
    type SharePreviewData,
    type SharePreviewVariant,
  } from "../data/share-preview.js";

  interface Design {
    id: string;
    index: string;
    name: string;
    blurb: string;
    component: Component<{ data: SharePreviewData }>;
  }

  const designs: Design[] = [
    {
      id: "team-sheet",
      index: "04.1a",
      name: "Team Sheet",
      blurb: "Rating card · pitch + roster",
      component: ShareCardTeamSheet,
    },
    {
      id: "team-sheet-wide",
      index: "04.1b",
      name: "Team Sheet Wide",
      blurb: "Horizontal pitch · roster grid",
      component: ShareCardTeamSheetWide,
    },
    {
      id: "dossier",
      index: "04.3a",
      name: "Dossier",
      blurb: "Side panel · squad breakdown",
      component: ShareCardDossier,
    },
    {
      id: "dossier-mirror",
      index: "04.3b",
      name: "Dossier Mirror",
      blurb: "Rating ring · flipped panel",
      component: ShareCardDossierMirror,
    },
  ];

  let variant = $state<SharePreviewVariant>("champion");
  const variantData = $derived(SHARE_PREVIEW_VARIANTS[variant]);

  // Allow a direct link to either state, e.g. /share-preview/?variant=group-exit.
  onMount(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "variant",
    );
    if (requested === "champion" || requested === "group-exit") {
      variant = requested;
    }
  });

  /** Keep the URL in sync so a refresh or shared link opens the same state. */
  function selectVariant(next: SharePreviewVariant): void {
    variant = next;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    history.replaceState(null, "", url);
  }

  const tabBase =
    "rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors duration-150";
</script>

<section class="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14">
  <header
    class="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between"
  >
    <div class="max-w-2xl">
      <p
        class="font-mono text-[11px] font-semibold tracking-[1.8px] text-mint uppercase"
      >
        Team Sheet refinements
      </p>
      <h1
        class="mt-3 font-display text-4xl leading-[0.88] tracking-[0.5px] uppercase sm:text-5xl"
      >
        Two Team Sheets, two dossiers
      </h1>
      <p class="mt-4 max-w-xl text-sm leading-relaxed text-secondary">
        Team rating leads every card. Outcome, record and player OVRs carry the
        story; goals, clean sheets and the top-rated pick fill the rest. Switch
        the result to test a winning run and an early exit.
      </p>
    </div>

    <div class="flex flex-col items-start gap-2 lg:items-end">
      <span
        class="font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary uppercase"
      >
        Result variant
      </span>
      <div
        class="inline-flex rounded-full border border-white/15 bg-slate/30 p-1"
        role="group"
        aria-label="Result variant"
      >
        <button
          type="button"
          class="{tabBase} {variant === 'champion'
            ? 'bg-mint text-black'
            : 'text-secondary hover:text-white'}"
          aria-pressed={variant === "champion"}
          onclick={() => selectVariant("champion")}
        >
          Champion
        </button>
        <button
          type="button"
          class="{tabBase} {variant === 'group-exit'
            ? 'bg-pink text-black'
            : 'text-secondary hover:text-white'}"
          aria-pressed={variant === "group-exit"}
          onclick={() => selectVariant("group-exit")}
        >
          Group exit
        </button>
      </div>
    </div>
  </header>

  <div class="mt-8 grid gap-12 xl:grid-cols-2 xl:gap-x-10 xl:gap-y-16">
    {#each designs as design (design.id)}
      {@const Card = design.component}
      <article>
        <div
          class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/10 pb-3"
        >
          <div class="flex items-baseline gap-3">
            <span
              class="font-mono text-[11px] font-semibold tracking-[1.5px]"
              style:color={variantData.accent}>{design.index}</span
            >
            <h2 class="font-display text-2xl tracking-[0.5px] uppercase">
              {design.name}
            </h2>
          </div>
          <p
            class="font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary uppercase"
          >
            {design.blurb}
          </p>
        </div>

        <CardFrame
          label={`${design.name} share card concept, ${variantData.outcomeTitle.toLowerCase()}`}
        >
          <Card data={variantData} />
        </CardFrame>
      </article>
    {/each}
  </div>

  <p
    class="mt-12 border-t border-white/10 pt-6 font-mono text-[10px] tracking-[1.4px] text-secondary uppercase"
  >
    Mockups only · pick one direction to rebuild as the real PNG share renderer
  </p>
</section>
