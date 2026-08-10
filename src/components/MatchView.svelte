<script lang="ts">
  import { NATION_NAMES } from "../lib/draft.js";
import { playerRating } from "../lib/draft.js";
  import { simulateMatchScript } from "../lib/matchEngine.js";
  import type {
    MatchResult,
    MatchScript,
    PenaltyKick,
    SegmentSnapshot,
    Squad,
  } from "../lib/types.js";
  import { countSameNation } from "../lib/team.js";

  let {
    userSquad,
    opponentSquad,
    roundLabel,
    onResult,
    onNext,
    nextLabel = "Next match",
    regulationOnly = false,
    autoStart = false,
    embedded = false,
    presetResult = null,
  }: {
    userSquad: Squad;
    opponentSquad: Squad;
    roundLabel: string;
    onResult: (r: MatchResult) => void;
    onNext: () => void;
    nextLabel?: string;
    regulationOnly?: boolean;
    autoStart?: boolean;
    embedded?: boolean;
    presetResult?: MatchResult | null;
  } = $props();

  const teamName = (t: 0 | 1) => (t === 0 ? "Your XI" : opponentSquad.name);

  const teamAvg = (squad: Squad): number =>
    squad.players.length > 0
      ? Math.round(
          squad.players.reduce((a, p) => a + playerRating(p), 0) /
            squad.players.length,
        )
      : 0;

  const userAvg = $derived(teamAvg(userSquad));
  const oppAvg = $derived(teamAvg(opponentSquad));

  const preMatch: SegmentSnapshot = {
    minute: 0,
    isET: false,
    score: [0, 0],
    shots: [0, 0],
    shotsOnTarget: [0, 0],
    xg: [0, 0],
    possession: [0.5, 0.5],
    events: [],
  };

  let script = $state<MatchScript | null>(null);
  let segIndex = $state(0);
  let penIndex = $state(0);
  let playing = $state(false);
  let finished = $state(false);

  const snaps = $derived(
    script ? [...script.regulation, ...(script.extraTime ?? [])] : [],
  );
  const currentSnap = $derived(segIndex > 0 ? snaps[segIndex - 1] : preMatch);
  const result = $derived(script?.result ?? presetResult ?? null);
  const done = $derived(finished || (!script && presetResult != null));
  const phase = $derived<"pre" | "play" | "pens" | "done">(
    done
      ? "done"
      : segIndex >= snaps.length
        ? "pens"
        : segIndex > 0
          ? "play"
          : "pre",
  );

  const userNationCount = $derived(countSameNation(userSquad.players));

  function playMatch() {
    if (script) return;
    script = simulateMatchScript(userSquad, opponentSquad, { regulationOnly });
    segIndex = 0;
    penIndex = 0;
    finished = false;
    playing = true;
  }

  $effect(() => {
    if (autoStart && !script && !presetResult) playMatch();
  });

  function reachIndex(i: number) {
    segIndex = i;
  }

  function finish() {
    if (finished || !script) return;
    finished = true;
    playing = false;
    onResult(script.result);
  }

  function advance() {
    if (!script || finished) return;
    if (segIndex < snaps.length) {
      reachIndex(segIndex + 1);
    } else if (script.penalties && penIndex < script.penalties.length) {
      penIndex += 1;
    } else {
      finish();
    }
  }

  function replay() {
    if (!script) return;
    segIndex = 0;
    penIndex = 0;
    finished = false;
    playing = true;
  }

  $effect(() => {
    if (!playing || finished) return;
    const id = setInterval(advance, 550);
    return () => clearInterval(id);
  });

  const clockLabel = $derived(
    done && result
      ? result.penalties
        ? "FT · PENS"
        : result.extraTime
          ? "ET"
          : "FT"
      : phase === "pre"
        ? "KO"
        : phase === "play"
          ? `${currentSnap.minute}'${currentSnap.isET ? " ET" : ""}`
          : phase === "pens"
            ? `PENS ${penIndex}/${script?.penalties?.length ?? 0}`
            : "",
  );

  const pensScore = $derived<[number, number]>(
    script?.penalties
      ? script.penalties.slice(0, penIndex).reduce(
          (acc, k) => {
            if (k.scored) acc[k.team] += 1;
            return acc;
          },
          [0, 0] as [number, number],
        )
      : [0, 0],
  );

  const displayScore = $derived(
    done && result ? result.score : currentSnap.score,
  );
  const displayPossession = $derived(
    done && result ? result.possession : currentSnap.possession,
  );
  const displayShots = $derived(
    done && result ? result.shots : currentSnap.shots,
  );
  const displayOnTarget = $derived(
    done && result ? result.shotsOnTarget : currentSnap.shotsOnTarget,
  );
  const displayXg = $derived(done && result ? result.xg : currentSnap.xg);

  const goalEvents = $derived(
    (result?.events ?? []).slice().sort((a, b) => a.minute - b.minute),
  );

  const visibleKicks = $derived<PenaltyKick[]>(
    script?.penalties?.slice(0, penIndex) ?? [],
  );

  const liveStatus = $derived(
    phase === "pre"
      ? "KICK OFF"
      : phase === "play"
        ? "LIVE"
        : phase === "pens"
          ? "PENS"
          : "",
  );

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent whitespace-nowrap transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
  const pillSolid =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-black bg-mint border border-mint rounded-full px-5 py-2.5 whitespace-nowrap transition-all duration-150 hover:brightness-110";
</script>

<section class="{embedded ? 'w-full' : 'mx-auto max-w-4xl px-6 py-12'}">
  {#if !embedded}
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="{mono} text-mint">{roundLabel}</p>
        <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
          Your XI <span class="text-secondary">vs.</span>
          {opponentSquad.name}
        </h2>
        <p class="{mono} mt-3 text-secondary">
          {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear}
        </p>
      </div>

      {#if !script && !presetResult}
        <button type="button" class={pillSolid} onclick={playMatch}
          >Play match</button
        >
      {:else if script && !finished}
        <div class="flex items-center gap-2">
          <button
            type="button"
            class={pillOutline}
            onclick={() => (playing = !playing)}
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      {:else if script}
        <div class="flex items-center gap-2">
          <button type="button" class={pillOutline} onclick={replay}
            >Replay</button
          >
          <button type="button" class={pillSolid} onclick={onNext}
            >{nextLabel}</button
          >
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p class="{mono} text-mint">{roundLabel}</p>
        <p class="mt-1 font-display text-2xl leading-[0.9] tracking-[1px]">
          Your XI <span class="text-secondary">vs.</span>
          {opponentSquad.name}
        </p>
      </div>
      {#if !script && !presetResult}
        <button type="button" class={pillSolid} onclick={playMatch}
          >Play match</button
        >
      {:else if script && !finished}
        <div class="flex items-center gap-2">
          <button
            type="button"
            class={pillOutline}
            onclick={() => (playing = !playing)}
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      {:else if script}
        <div class="flex items-center gap-2">
          <button type="button" class={pillOutline} onclick={replay}
            >Replay</button
          >
        </div>
      {/if}
    </div>
  {/if}

  {#if script || presetResult}
    <div
      class="mt-5 overflow-hidden rounded-3xl border border-white/15 bg-slate/30"
    >
      <div class="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-2">
        <div class="flex items-center gap-3">
          <span
            class="{mono} text-[10px] {phase === 'play'
              ? 'text-mint'
              : 'text-secondary'}"
            >{liveStatus}</span
          >
          {#if phase === "play"}
            <span class="h-2 w-2 animate-pulse rounded-full bg-mint"></span>
          {/if}
        </div>
        <div class="text-center">
          <p class="font-mono text-[15px] font-semibold text-white">
            {clockLabel}
          </p>
        </div>
        <div class="flex items-center gap-3">
          {#if phase === "pens" || (phase === "done" && result?.penalties)}
            <span class="{mono} text-[10px] text-yellow"
              >PENS {pensScore[0]} : {pensScore[1]}</span
            >
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4">
        <div class="flex flex-col items-end">
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-mint font-display text-lg leading-none text-black"
            >XI</span
          >
          <p class="mt-1.5 font-display text-xl leading-none text-mint">Your XI</p>
          <p class="{mono} mt-1.5 text-secondary">
            {userSquad.players.length} players · {userNationCount} same nation · AVG {userAvg}
          </p>
        </div>
        <div class="min-w-40 text-center">
          {#key displayScore[0] + "-" + displayScore[1]}
            <p
              class="score-bump font-mono text-5xl font-bold tracking-tight text-white"
            >
              {displayScore[0]}<span class="text-secondary">–</span
              >{displayScore[1]}
            </p>
          {/key}
        </div>
        <div class="flex flex-col items-start">
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-uv font-display text-lg leading-none text-white"
            >{opponentSquad.name.slice(0, 3).toUpperCase()}</span
          >
          <p class="mt-1.5 font-display text-xl leading-none text-secondary">
            {opponentSquad.name}
          </p>
          <p class="{mono} mt-1.5 text-secondary">
            {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear} · AVG {oppAvg}
          </p>
        </div>
      </div>

      <div class="grid gap-4 px-6 py-6 md:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-slate/20 p-4">
          <p class="{mono} text-[10px] text-secondary">GOALS</p>
          {#if goalEvents.length > 0}
            <ul class="mt-3 space-y-2">
              {#each goalEvents as ev (ev.minute + "-" + ev.teamIndex + "-" + (ev.scorerName ?? "goal"))}
                <li class="flex items-center gap-3 text-[13px]">
                  <span
                    class="w-11 shrink-0 font-mono text-xs text-secondary"
                    >{ev.minute}'{ev.minute > 90 ? " ET" : ""}</span
                  >
                  <span
                    class="h-2 w-2 shrink-0 rounded-full"
                    style:background={ev.teamIndex === 0 ? "#3cffd0" : "#5200ff"}
                  ></span>
                  <span
                    class="min-w-0 truncate font-semibold"
                    style:color={ev.teamIndex === 0 ? "#3cffd0" : "#5200ff"}
                    >{teamName(ev.teamIndex)}</span
                  >
                  <span class="ml-auto truncate text-secondary"
                    >{ev.scorerName ?? "Goal"}</span
                  >
                </li>
              {/each}
            </ul>
          {:else}
            <p class="{mono} mt-3 text-secondary">NO GOALS</p>
          {/if}
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate/20 p-4">
          <div class="mt-6">
            <p class="text-center text-sm text-secondary">Ball possession</p>
            <div class="relative mt-2 h-8 overflow-hidden rounded-full bg-white/5">
              <div
                class="absolute inset-y-0 left-0 rounded-full bg-white/15 transition-all duration-500"
                style:width={`${displayPossession[0] * 100}%`}
              ></div>
              <div
                class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20"
              ></div>
              <div class="absolute inset-y-0 flex w-full items-center px-4">
                <span class="text-sm font-bold text-white"
                  >{Math.round(displayPossession[0] * 100)}%</span
                >
                <span class="ml-auto text-sm font-bold text-white/60"
                  >{Math.round(displayPossession[1] * 100)}%</span
                >
              </div>
            </div>
          </div>

          <div class="mt-7 space-y-5">
            <div class="flex items-center gap-4">
              <div class="w-16 shrink-0 text-left">
                <span class="text-xl font-bold text-white"
                  >{displayXg[0].toFixed(2)}</span
                >
              </div>
              <div class="min-w-0 flex-1 text-center">
                <span class="text-sm text-secondary">Expected goals (xG)</span>
              </div>
              <div class="w-16 shrink-0 text-right">
                <span class="text-xl font-bold text-white"
                  >{displayXg[1].toFixed(2)}</span
                >
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-16 shrink-0 text-left">
                <span class="text-xl font-bold text-white">{displayShots[0]}</span>
              </div>
              <div class="min-w-0 flex-1 text-center">
                <span class="text-sm text-secondary">Total shots</span>
              </div>
              <div class="w-16 shrink-0 text-right">
                <span class="text-xl font-bold text-white">{displayShots[1]}</span>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-16 shrink-0 text-left">
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white"
                  >{displayOnTarget[0]}</span
                >
              </div>
              <div class="min-w-0 flex-1 text-center">
                <span class="text-sm text-secondary">Shots on target</span>
              </div>
              <div class="w-16 shrink-0 text-right">
                <span class="text-xl font-bold text-white"
                  >{displayOnTarget[1]}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    {#if phase === "pre"}
      <p class="{mono} mt-6 text-center text-secondary">
        KICK OFF — {teamName(0)} vs {teamName(1)}
      </p>
    {/if}

    {#if script && (phase === "pens" || (phase === "done" && script.result.penalties))}
      <div class="mt-4 rounded-2xl border border-white/15 p-4">
        <p class="{mono} mb-3 text-yellow">PENALTY SHOOTOUT</p>
        <ul class="space-y-1.5">
          {#each visibleKicks as k, i (i)}
            <li
              class="flex items-center gap-3 text-[13px]"
              class:text-mint={k.team === 0}
              class:text-uv={k.team === 1}
            >
              <span class="w-6 font-mono text-xs text-secondary"
                >R{k.round}</span
              >
              <span
                class="h-2 w-2 rounded-full"
                style:background={k.team === 0 ? "#3cffd0" : "#5200ff"}
              ></span>
              <span>{k.takerName}</span>
              <span
                class="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-[1px] uppercase {k.scored
                  ? 'bg-mint/15 text-mint'
                  : 'bg-white/5 text-secondary'}"
                >{k.scored ? "SCORED" : "SAVED"}</span
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}

  {/if}
</section>

<style>
  .score-bump {
    display: inline-block;
    animation: score-pop 0.45s ease-out;
  }

  @keyframes score-pop {
    0% {
      transform: scale(1.25);
      filter: brightness(1.8);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
</style>
