<script lang="ts">
  import { NATION_NAMES, POSITION_LABEL, positionColor } from '../lib/draft.js';
  import { chemistryBonus, countSameNation } from '../lib/team.js';
  import type { Formation, Player, Position } from '../lib/types.js';

  let {
    formation,
    formationKey,
    drafted,
    onStart,
    onReset,
  }: {
    formation: Formation;
    formationKey: string;
    drafted: Player[];
    onStart: () => void;
    onReset: () => void;
  } = $props();

  const positionOrder: Position[] = ['GK', 'DEF', 'MID', 'ATT'];
  const sameNation = $derived(countSameNation(drafted));
  const chemistry = $derived(chemistryBonus(drafted, false));
</script>

<section class="mx-auto max-w-3xl px-6 py-12">
  <p class="mono-label text-mint">Team complete</p>
  <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
    {formationKey}
    <span class="text-secondary">· {drafted.length} players</span>
  </h2>

  <div class="mt-8 grid gap-4 lg:grid-cols-2">
    {#each positionOrder as pos (pos)}
      <div class="rounded-[24px] border border-white/15 bg-slate/30 p-5">
        <p class="mono-label !text-[10px]" style:color={positionColor(pos)}>
          {POSITION_LABEL[pos]}
          <span class="text-secondary">({formation[pos]})</span>
        </p>
        <div class="mt-3 space-y-1.5">
          {#each Array(formation[pos]) as _, i (pos + i)}
            {@const p = drafted.filter((x) => x.position === pos)[i]}
            <div
              class="flex items-center justify-between rounded-full border px-3 py-1.5"
              style:border-color={positionColor(pos)}
            >
              <span class="text-sm font-bold">{p?.name ?? 'Empty'}</span>
              {#if p}
                <span class="font-mono text-[10px] text-secondary">
                  {NATION_NAMES[p.nation] ?? p.nation} {p.wcYear}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-8 grid grid-cols-3 gap-4 text-center">
    <div class="rounded-[16px] border border-white/10 bg-slate/20 px-4 py-3">
      <p class="mono-label !text-[10px] text-secondary">PLAYERS</p>
      <p class="font-display mt-1 text-3xl">{drafted.length}</p>
    </div>
    <div class="rounded-[16px] border border-white/10 bg-slate/20 px-4 py-3">
      <p class="mono-label !text-[10px] text-secondary">SAME NATION</p>
      <p class="font-display mt-1 text-3xl">{sameNation}</p>
    </div>
    <div class="rounded-[16px] border border-mint bg-mint/10 px-4 py-3">
      <p class="mono-label !text-[10px] text-mint">CHEMISTRY</p>
      <p class="font-display mt-1 text-3xl text-mint">+{Math.round(chemistry * 100)}%</p>
    </div>
  </div>

  <div class="mt-10 flex flex-wrap justify-center gap-4">
    <button type="button" class="pill-outline" onclick={onStart}>Start tournament</button>
    <button type="button" class="pill-outline-alt" onclick={onReset}>Start over</button>
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

  .pill-outline {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-mint);
    border: 1px solid var(--color-mint);
    border-radius: 40px;
    padding: 12px 24px;
    background: transparent;
    transition: all 150ms ease;
  }

  .pill-outline:hover {
    background: var(--color-mint);
    color: #000;
  }

  .pill-outline-alt {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
    border-radius: 40px;
    padding: 12px 24px;
    background: transparent;
    transition: all 150ms ease;
  }

  .pill-outline-alt:hover {
    background: var(--color-secondary);
    color: #000;
  }
</style>