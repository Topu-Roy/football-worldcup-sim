<script lang="ts">
  import MatchView from './MatchView.svelte';
  import { NATION_NAMES } from '../lib/draft.js';
  import {
    advanceToKnockout,
    aggregateStats,
    groupDone,
    matchTeams,
    nextUserMatch,
    registerUserResult,
    resolveKnockout,
    standingsFor,
    type Tournament,
    type TournamentMatch,
  } from '../lib/tournament.js';
  import type { MatchResult, Squad } from '../lib/types.js';

  let {
    tournament,
    onNewTournament,
    onReset,
  }: {
    tournament: Tournament;
    onNewTournament: () => void;
    onReset: () => void;
  } = $props();

  let activeMatchId = $state<string | null>(null);

  function formatSigned(n: number): string {
    if (n > 0) return `+${n}`;
    if (n < 0) return `−${Math.abs(n)}`;
    return '0';
  }

  function startNewTournament() {
    activeMatchId = null;
    onNewTournament();
  }

  const playing = $derived(
    activeMatchId ? (tournament.matches.find((m) => m.id === activeMatchId) ?? null) : null,
  );

  const userGroupMatches = $derived(tournament.matches.filter((m) => m.isUser && m.round === 'group'));

  const groupDoneNow = $derived(groupDone(tournament));

  const standingsA = $derived(standingsFor(tournament, 'A'));
  const standingsB = $derived(standingsFor(tournament, 'B'));

  const stats = $derived(aggregateStats(tournament));

  const knockoutMatches = $derived(tournament.matches.filter((m) => m.round !== 'group'));
  const knockoutByRound = $derived({
    sf: knockoutMatches.filter((m) => m.round === 'sf'),
    final: knockoutMatches.filter((m) => m.round === 'final'),
  });

  function opponentOf(m: TournamentMatch): Squad {
    return m.home === tournament.userSquad.id ? tournament.squads[m.away] : tournament.squads[m.home];
  }

  function roundLabel(m: TournamentMatch): string {
    if (m.round === 'sf') return 'Semi-final';
    if (m.round === 'final') return 'Final';
    const idx = userGroupMatches.findIndex((x) => x.id === m.id);
    return `Group A · Match ${idx + 1} of 3`;
  }

  function nextLabel(m: TournamentMatch): string {
    if (m.round === 'group') return 'Back to group';
    if (m.round === 'final') return 'See results';
    return 'Continue';
  }

  function handleResult(m: TournamentMatch) {
    return (r: MatchResult) => {
      registerUserResult(tournament, m.id, r);
      if (tournament.phase === 'knockout') resolveKnockout(tournament);
    };
  }

  function handleNext() {
    activeMatchId = null;
  }

  function playMatch(m: TournamentMatch) {
    activeMatchId = m.id;
  }

  function outcomeBadge(m: TournamentMatch): string {
    if (!m.result) return '';
    if (m.result.winner === null) return 'D';
    const userHome = m.home === tournament.userSquad.id;
    return m.result.winner === (userHome ? 0 : 1) ? 'W' : 'L';
  }

  function outcomeColor(o: string): string {
    if (o === 'W') return 'var(--color-mint)';
    if (o === 'L') return 'var(--color-pink)';
    return 'var(--color-secondary)';
  }

  function outcomeTitle(o: string): string {
    if (o === 'champion') return 'CHAMPION';
    if (o === 'runners-up') return 'RUNNERS-UP';
    if (o === 'semi-final-exit') return 'SEMI-FINAL EXIT';
    return 'ELIMINATED IN GROUP STAGE';
  }
</script>

<section class="mx-auto max-w-6xl px-6 py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="mono-label text-mint">Tournament · 8 teams</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">World Cup Run</h2>
      <p class="mono-label mt-3 text-secondary">
        Group A + Group B · top 2 advance to knockouts
      </p>
    </div>
    <button type="button" class="pill-outline" onclick={onReset}>New draft</button>
  </header>

  {#if playing}
    {@const teams = matchTeams(tournament, playing)}
    <div class="mt-8">
      <MatchView
        userSquad={teams.home.id === tournament.userSquad.id ? teams.home : teams.away}
        opponentSquad={teams.home.id === tournament.userSquad.id ? teams.away : teams.home}
        roundLabel={roundLabel(playing)}
        onResult={handleResult(playing)}
        onNext={handleNext}
        nextLabel={nextLabel(playing)}
        regulationOnly={playing.round === 'group'}
      />
    </div>
  {:else if tournament.phase === 'group'}
    <div class="mt-10 grid gap-6 lg:grid-cols-2">
      <div class="rounded-[24px] border border-white/15 bg-slate/30 p-6">
        <p class="mono-label text-secondary mb-4">GROUP A</p>
        <StandingsTable rows={standingsA} userId={tournament.userSquad.id} />
      </div>
      <div class="rounded-[24px] border border-white/15 bg-slate/30 p-6">
        <p class="mono-label text-secondary mb-4">GROUP B</p>
        <StandingsTable rows={standingsB} userId={null} />
      </div>
    </div>

    <div class="mt-6 rounded-[24px] border border-white/15 p-6">
      <p class="mono-label text-secondary mb-4">YOUR GROUP MATCHES</p>
      <ul class="space-y-3">
        {#each userGroupMatches as m (m.id)}
          <li class="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-slate/20 px-4 py-3">
            <div>
              <p class="font-bold">
                vs. {opponentOf(m).name}
                <span class="mono-label !ml-2 text-secondary">
                  {NATION_NAMES[opponentOf(m).nation] ?? opponentOf(m).nation} · {opponentOf(m).wcYear}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-4">
              {#if m.result}
                <span
                  class="mono-label"
                  style:color={outcomeColor(outcomeBadge(m))}
                >{outcomeBadge(m)} {m.result.score[0]}–{m.result.score[1]}</span>
              {:else}
                <span class="mono-label text-secondary">NOT PLAYED</span>
              {/if}
              <button
                type="button"
                class="pill-small"
                disabled={m.result !== null}
                onclick={() => playMatch(m)}
              >
                {m.result ? 'Played' : 'Play'}
              </button>
            </div>
          </li>
        {/each}
      </ul>

      {#if groupDoneNow}
        <div class="mt-6 flex justify-center">
          <button type="button" class="pill-outline" onclick={() => advanceToKnockout(tournament)}>
            Proceed to knockouts
          </button>
        </div>
      {/if}
    </div>
  {:else if tournament.phase === 'knockout'}
    <div class="mt-10 grid gap-6 lg:grid-cols-3">
      {#each knockoutByRound.sf as m (m.id)}
        <div class="rounded-[24px] border border-white/15 bg-slate/30 p-6">
          <p class="mono-label text-secondary mb-4">SEMI-FINAL</p>
          <BracketMatch
            m={m}
            userId={tournament.userSquad.id}
            squads={tournament.squads}
            onPlay={() => playMatch(m)}
          />
        </div>
      {/each}
      {#each knockoutByRound.final as m (m.id)}
        <div class="rounded-[24px] border border-yellow bg-yellow/10 p-6">
          <p class="mono-label mb-4" style:color="var(--color-yellow)">FINAL</p>
          <BracketMatch
            m={m}
            userId={tournament.userSquad.id}
            squads={tournament.squads}
            onPlay={() => playMatch(m)}
          />
        </div>
      {/each}
    </div>

    {#if !nextUserMatch(tournament)}
      <div class="mt-8 flex justify-center">
        <button type="button" class="pill-outline" onclick={() => resolveKnockout(tournament)}>
          Finish tournament
        </button>
      </div>
    {/if}
  {:else}
    <div class="mt-10 flex flex-col items-center gap-8">
      <div class="rounded-[24px] border border-white/15 bg-slate/30 px-10 py-8 text-center">
        <p class="mono-label text-secondary">TOURNAMENT OVER</p>
        <p
          class="font-display mt-3 text-6xl tracking-[1px]"
          style:color={tournament.outcome === 'champion' ? 'var(--color-mint)' : tournament.outcome === 'runners-up' ? 'var(--color-yellow)' : 'var(--color-secondary)'}
        >{outcomeTitle(tournament.outcome ?? '')}</p>
      </div>

      {#if tournament.outcome === 'eliminated'}
        <div class="w-full max-w-2xl rounded-[24px] border border-white/15 bg-slate/30 p-6">
          <p class="mono-label text-secondary mb-4">FINAL GROUP A TABLE</p>
          <StandingsTable rows={standingsA} userId={tournament.userSquad.id} />
        </div>
      {/if}

      {#if stats}
        <div class="w-full max-w-4xl">
          <div class="grid grid-cols-3 gap-4 sm:grid-cols-6">
            <Stat label="Played" value={String(stats.played)} />
            <Stat label="Won" value={String(stats.won)} />
            <Stat label="Drawn" value={String(stats.drawn)} />
            <Stat label="Lost" value={String(stats.lost)} />
            <Stat label="Points" value={String(stats.points)} />
            <Stat label="Goal diff" value={formatSigned(stats.gd)} />
          </div>

          <div class="mt-6 rounded-[24px] border border-white/15 p-6">
            <p class="mono-label text-secondary mb-4">MATCH RESULTS</p>
            <div class="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              <Stat label="Goals for" value={String(stats.gf)} />
              <Stat label="Goals against" value={String(stats.ga)} />
              <Stat label="Clean sheets" value={String(stats.cleanSheets)} />
              <Stat label="Penalty wins" value={String(stats.penaltyWins)} />
              <Stat label="Biggest win" value={stats.biggestWin > 0 ? `+${stats.biggestWin}` : '–'} />
              <Stat label="Biggest loss" value={stats.biggestLoss > 0 ? `−${stats.biggestLoss}` : '–'} />
              <Stat label="Avg goals/match" value={stats.avgGoalsFor.toFixed(2)} />
            </div>
          </div>

          <div class="mt-6 overflow-x-auto rounded-[24px] border border-white/15 p-6">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="mono-label text-secondary">
                  <th class="pb-3 pr-4">Round</th>
                  <th class="pb-3 pr-4">Opponent</th>
                  <th class="pb-3 pr-4">Score</th>
                  <th class="pb-3 pr-4">Result</th>
                  <th class="pb-3 pr-4">Shots</th>
                  <th class="pb-3 pr-4">On target</th>
                  <th class="pb-3 pr-4">Possession</th>
                  <th class="pb-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {#each stats.matches as sm (sm.id)}
                  <tr class="border-t border-white/10">
                    <td class="py-3 pr-4 mono-label !text-[10px] text-secondary">{sm.roundLabel}</td>
                    <td class="py-3 pr-4 font-bold">{sm.opponentName}</td>
                    <td class="py-3 pr-4 font-mono">{sm.result.score[0]}–{sm.result.score[1]}</td>
                    <td class="py-3 pr-4 mono-label !text-[10px]" style:color={outcomeColor(sm.outcome)}>{sm.outcome}</td>
                    <td class="py-3 pr-4 font-mono">{sm.result.shots[0]}–{sm.result.shots[1]}</td>
                    <td class="py-3 pr-4 font-mono">{sm.result.shotsOnTarget[0]}–{sm.result.shotsOnTarget[1]}</td>
                    <td class="py-3 pr-4 font-mono">{Math.round(sm.result.possession[0] * 100)}%</td>
                    <td class="py-3 mono-label !text-[10px] text-secondary">
                      {sm.result.extraTime ? 'ET' : ''}{sm.result.penalties ? '·PEN' : ''}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      <div class="flex gap-4">
        <button type="button" class="pill-outline" onclick={startNewTournament}>New tournament (same XI)</button>
        <button type="button" class="pill-outline" onclick={onReset}>New draft</button>
      </div>
    </div>
  {/if}
</section>

{#snippet StandingsTable(rows: import('../lib/tournament.js').GroupStanding[], userId: string | null)}
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="mono-label text-secondary">
        <th class="pb-2 pr-3">#</th>
        <th class="pb-2 pr-3">Team</th>
        <th class="pb-2 pr-3 text-center">P</th>
        <th class="pb-2 pr-3 text-center">W</th>
        <th class="pb-2 pr-3 text-center">D</th>
        <th class="pb-2 pr-3 text-center">L</th>
        <th class="pb-2 pr-3 text-center">GF</th>
        <th class="pb-2 pr-3 text-center">GA</th>
        <th class="pb-2 pr-3 text-center">GD</th>
        <th class="pb-2 text-center">Pts</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (row.squadId)}
        <tr class:user-row={row.squadId === userId}>
          <td class="py-2 pr-3 font-mono text-secondary">{i + 1}</td>
          <td class="py-2 pr-3 font-bold">
            {row.squadId === userId ? 'You' : row.name}
            <span class="mono-label !ml-2 text-secondary">
              {NATION_NAMES[row.nation] ?? row.nation}
            </span>
          </td>
          <td class="py-2 pr-3 text-center font-mono">{row.played}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.won}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.drawn}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.lost}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.gf}</td>
          <td class="py-2 pr-3 text-center font-mono">{row.ga}</td>
          <td class="py-2 pr-3 text-center font-mono">{formatSigned(row.gd)}</td>
          <td class="py-2 text-center font-mono font-bold">{row.points}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}

{#snippet BracketMatch(m: TournamentMatch, userId: string, squads: Record<string, import('../lib/types.js').Squad>, onPlay: () => void)}
  <div class="space-y-3">
    {#each [m.home, m.away] as side, i (side + i)}
      <div class="flex items-center justify-between gap-3">
        <span class:font-bold={side === userId}>
          {side === userId ? 'You' : squads[side].name}
        </span>
        <span class="font-mono text-sm">
          {m.result ? m.result.score[i] : '–'}
        </span>
      </div>
    {/each}
    <div class="mt-3 flex justify-center">
      {#if m.isUser && !m.result}
        <button type="button" class="pill-small" onclick={onPlay}>Play</button>
      {:else if m.result}
        <span class="mono-label !text-[10px] text-secondary">
          {m.result.winner === 0 ? squads[m.home].name : squads[m.away].name} advance
          {m.result.penalties ? ' · pens' : m.result.extraTime ? ' · ET' : ''}
        </span>
      {:else}
        <span class="mono-label !text-[10px] text-secondary">AUTO</span>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet Stat(label: string, value: string)}
  <div class="rounded-[16px] border border-white/10 bg-slate/20 px-4 py-3 text-center">
    <p class="mono-label !text-[10px] text-secondary">{label}</p>
    <p class="font-display mt-1 text-2xl">{value}</p>
  </div>
{/snippet}

<style>
  :global(.user-row) {
    background: rgba(60, 255, 208, 0.08);
  }

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

  .pill-outline:hover {
    background: var(--color-mint);
    color: #000;
  }

  .pill-small {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--color-mint);
    border: 1px solid var(--color-mint);
    border-radius: 40px;
    padding: 6px 14px;
    background: transparent;
    transition: all 150ms ease;
  }

  .pill-small:hover:not(:disabled) {
    background: var(--color-mint);
    color: #000;
  }

  .pill-small:disabled {
    opacity: 0.3;
  }
</style>