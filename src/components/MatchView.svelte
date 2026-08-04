<script lang="ts">
  import { NATION_NAMES } from '../lib/draft.js';
  import { simulateMatch } from '../lib/matchEngine.js';
  import type { Squad } from '../lib/types.js';
  import { HISTORICAL_SQUADS } from '../data/historical/index.js';
  import { countSameNation } from '../lib/team.js';

  let {
    userSquad,
    onReset,
  }: { userSquad: Squad; onReset: () => void } = $props();

  let opponentId = $state<string | null>(null);
  let result = $state<ReturnType<typeof simulateMatch> | null>(null);
  let isSimulating = $state(false);

  $effect(() => {
    if (!opponentId) {
      opponentId = randomOpponent().id;
    }
    if (opponentId && !result) {
      result = simulateMatch(userSquad, opponent());
    }
  });

  function randomOpponent(): Squad {
    const filtered = HISTORICAL_SQUADS.filter((s) => s.id !== 'user-squad');
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function opponent(): Squad {
    return HISTORICAL_SQUADS.find((s) => s.id === opponentId) ?? HISTORICAL_SQUADS[0];
  }

  function simulate() {
    isSimulating = true;
    setTimeout(() => {
      result = simulateMatch(userSquad, opponent());
      isSimulating = false;
    }, 60);
  }

  const userNationCount = $derived(countSameNation(userSquad.players));

  const userGoals = $derived(result?.winner === 0 ? result.score[0] : result.score[1]);
  const oppGoals = $derived(result?.winner === 1 ? result.score[1] : result.score[0]);
</script>

<section class="mx-auto max-w-4xl px-6 py-12">
  <p class="mono-label text-mint">Matchday</p>
  <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">Your XI vs. History</h2>

  <div class="mt-8 flex flex-wrap items-center gap-4">
    <label class="mono-label text-secondary" for="opponent">OPPONENT</label>
    <select
      id="opponent"
      bind:value={opponentId}
      class="rounded-full border border-white/25 bg-slate px-4 py-2 text-white"
    >
      {#each HISTORICAL_SQUADS as s (s.id)}
        <option value={s.id}>{s.name}</option>
      {/each}
    </select>
    <button type="button" class="pill-outline" onclick={simulate} disabled={isSimulating}>
      {isSimulating ? 'Simulating…' : 'Simulate match'}
    </button>
  </div>

  {#if result}
    <div class="mt-10 grid gap-6 lg:grid-cols-2">
      <div class="rounded-[24px] border border-white/15 bg-slate/30 p-8">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-display text-4xl">You</p>
            <p class="mono-label mt-1 text-secondary">{userSquad.players.length} players · {userNationCount} same nation</p>
          </div>
          <p class="font-display text-5xl text-mint">{userGoals}</p>
        </div>
      </div>

      <div class="rounded-[24px] border border-white/15 bg-slate/30 p-8">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-display text-4xl">{opponent().name}</p>
            <p class="mono-label mt-1 text-secondary">
              {NATION_NAMES[opponent().nation] ?? opponent().nation} · {opponent().wcYear}
            </p>
          </div>
          <p class="font-display text-5xl text-secondary">{oppGoals}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 rounded-[24px] border border-white/15 p-6">
      <div class="flex items-center justify-between">
        <p class="mono-label text-mint">
          {result.winner === 0 ? 'YOU WIN' : result.winner === 1 ? 'YOU LOSE' : 'DRAW'}
        </p>
        <p class="mono-label text-secondary">
          {result.extraTime ? '· Extra time' : ''}{result.penalties ? ' · Penalties' : ''}
        </p>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4 text-center">
        <div>
          <p class="mono-label text-secondary">SHOTS</p>
          <p class="font-display text-3xl">{result.shots[0]} : {result.shots[1]}</p>
        </div>
        <div>
          <p class="mono-label text-secondary">ON TARGET</p>
          <p class="font-display text-3xl">{result.shotsOnTarget[0]} : {result.shotsOnTarget[1]}</p>
        </div>
        <div>
          <p class="mono-label text-secondary">POSSESSION</p>
          <p class="font-display text-3xl">{Math.round(result.possession[0] * 100)} : {Math.round(result.possession[1] * 100)}</p>
        </div>
        <div>
          <p class="mono-label text-secondary">SCORERS</p>
          <p class="text-sm text-secondary">{result.events.length} goals</p>
        </div>
      </div>
    </div>

    {#if result.events.length > 0}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6">
        <p class="mono-label text-secondary mb-4">TIMELINE</p>
        <ul class="space-y-2">
          {#each result.events as ev (ev.minute + ev.teamIndex)}
            <li class="flex items-center gap-3 text-sm">
              <span class="font-mono text-xs text-secondary">{ev.minute}'</span>
              <span class="h-2 w-2 rounded-full" style:background={ev.teamIndex === 0 ? '#3cffd0' : '#5200ff'}></span>
              <span>{ev.teamIndex === 0 ? 'You' : opponent().name}</span>
              <span class="text-mint">GOAL</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if result.penalties && result.penaltyScore}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6 text-center">
        <p class="mono-label text-mint">PENALTIES</p>
        <p class="mt-2 font-display text-4xl">{result.penaltyScore[0]} : {result.penaltyScore[1]}</p>
      </div>
    {/if}

    <div class="mt-8 flex justify-center gap-4">
      <button type="button" class="pill-outline" onclick={onReset}>New draft</button>
    </div>
  {/if}
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
    padding: 10px 20px;
    background: transparent;
    transition: all 150ms ease;
  }

  .pill-outline:hover:not(:disabled) {
    background: var(--color-mint);
    color: #000;
  }
</style>
