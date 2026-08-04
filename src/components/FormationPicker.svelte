<script lang="ts">
  import { formationOptions, POSITION_LABEL } from '../lib/draft.js';
  import type { Formation } from '../lib/types.js';

  let { onSelect }: { onSelect: (key: string, formation: Formation) => void } = $props();
  const options = formationOptions();

  const summary = (f: Formation) =>
    ['GK', 'DEF', 'MID', 'ATT']
      .map((pos) => `${f[pos as keyof Formation]} ${POSITION_LABEL[pos as keyof typeof POSITION_LABEL]}${f[pos as keyof Formation] > 1 ? 's' : ''}`)
      .join(' · ');
</script>

<section class="mx-auto max-w-3xl px-6 py-16">
  <p class="mono-label mb-4 text-mint">World Cup Draft Simulator</p>
  <h1 class="font-display text-6xl leading-[0.85] tracking-[1.07px] md:text-7xl">
    Pick your<br />formation
  </h1>
  <p class="mt-6 max-w-xl text-secondary">
    Every XI needs a shape. Choose how many defenders, midfielders and attackers you'll draft —
    this sets the position limits for all 11 rounds.
  </p>

  <div class="mt-12 grid gap-4 sm:grid-cols-2">
    {#each options as opt (opt.key)}
      <button
        type="button"
        class="group rounded-[24px] border border-white/15 bg-slate/40 p-6 text-left transition-colors duration-150 hover:border-mint"
        onclick={() => onSelect(opt.key, opt.formation)}
      >
        <span class="font-display text-4xl text-white group-hover:text-mint">{opt.key}</span>
        <span class="mt-3 block font-mono text-[11px] uppercase tracking-[1.8px] text-secondary">
          {summary(opt.formation)}
        </span>
      </button>
    {/each}
  </div>
</section>

<style>
  .mono-label {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }
</style>
