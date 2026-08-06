<script lang="ts">
  import { NATION_NAMES } from "../lib/draft.js";
  import { simulateMatchScript } from "../lib/matchEngine.js";
  import type {
    MatchEvent,
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
  }: {
    userSquad: Squad;
    opponentSquad: Squad;
    roundLabel: string;
    onResult: (r: MatchResult) => void;
    onNext: () => void;
    nextLabel?: string;
    regulationOnly?: boolean;
  } = $props();

  const teamName = (t: 0 | 1) => (t === 0 ? "Your XI" : opponentSquad.name);

  const preMatch: SegmentSnapshot = {
    minute: 0,
    isET: false,
    score: [0, 0],
    shots: [0, 0],
    shotsOnTarget: [0, 0],
    possession: [0.5, 0.5],
    events: [],
  };

  let script = $state<MatchScript | null>(null);
  let segIndex = $state(0);
  let penIndex = $state(0);
  let playing = $state(false);
  let speed = $state(1);
  let finished = $state(false);
  let flashCount = $state(0);
  let flashEvent = $state<MatchEvent | null>(null);

  const snaps = $derived(
    script ? [...script.regulation, ...(script.extraTime ?? [])] : [],
  );
  const currentSnap = $derived(segIndex > 0 ? snaps[segIndex - 1] : preMatch);
  const phase = $derived<"pre" | "play" | "pens" | "done">(
    finished
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

  function reachIndex(i: number) {
    segIndex = i;
    const snap = snaps[i - 1];
    if (snap && snap.events.length > 0) {
      flashEvent = snap.events[snap.events.length - 1];
      flashCount += 1;
    }
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

  function skip() {
    if (!script || finished) return;
    segIndex = snaps.length;
    if (script.penalties) penIndex = script.penalties.length;
    finish();
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
    const id = setInterval(advance, 550 / speed);
    return () => clearInterval(id);
  });

  $effect(() => {
    if (flashCount === 0) return;
    const t = setTimeout(() => {
      flashEvent = null;
    }, 1800);
    return () => clearTimeout(t);
  });

  const clockLabel = $derived(
    phase === "pre"
      ? "KO"
      : phase === "play"
        ? `${currentSnap.minute}'${currentSnap.isET ? " ET" : ""}`
        : phase === "pens"
          ? `PENS ${penIndex}/${script?.penalties?.length ?? 0}`
          : script?.result.penalties
            ? "FT · PENS"
            : "FT",
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
    finished && script ? script.result.score : currentSnap.score,
  );
  const displayPossession = $derived(
    finished && script ? script.result.possession : currentSnap.possession,
  );
  const displayShots = $derived(
    finished && script ? script.result.shots : currentSnap.shots,
  );
  const displayOnTarget = $derived(
    finished && script
      ? script.result.shotsOnTarget
      : currentSnap.shotsOnTarget,
  );

  const commentary = $derived<{ id: string; text: string; team?: 0 | 1 }[]>(
    (() => {
      if (!script) return [];
      const lines: { id: string; text: string; team?: 0 | 1 }[] = [];
      for (let i = 0; i < Math.min(segIndex, snaps.length); i++) {
        for (const ev of snaps[i].events) {
          lines.push({
            id: `g-${i}-${ev.minute}-${ev.teamIndex}`,
            text: `${ev.minute}' GOAL ${teamName(ev.teamIndex)} — ${ev.scorerName ?? "Goal"}`,
            team: ev.teamIndex,
          });
        }
      }
      if (script.penalties) {
        for (const k of script.penalties.slice(0, penIndex)) {
          lines.push({
            id: `p-${script.penalties.indexOf(k)}`,
            text: `PEN ${teamName(k.team)} — ${k.takerName} ${k.scored ? "SCORED" : "SAVED"}`,
            team: k.team,
          });
        }
      }
      if (finished) {
        const w = script.result.winner;
        lines.push({
          id: "ft",
          text:
            w === 0
              ? `FULL TIME — YOUR XI WIN ${script.result.score[0]}–${script.result.score[1]}`
              : w === 1
                ? `FULL TIME — ${opponentSquad.name} WIN ${script.result.score[0]}–${script.result.score[1]}`
                : `FULL TIME — DRAW ${script.result.score[0]}–${script.result.score[1]}`,
        });
      }
      return lines;
    })(),
  );

  const visibleKicks = $derived<PenaltyKick[]>(
    script?.penalties?.slice(0, penIndex) ?? [],
  );
  const speedOptions = [1, 2, 4];
</script>

<section class="mx-auto max-w-4xl px-6 py-12">
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="mono-label text-mint">{roundLabel}</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
        Your XI <span class="text-secondary">vs.</span>
        {opponentSquad.name}
      </h2>
      <p class="mono-label mt-3 text-secondary">
        {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear}
      </p>
    </div>

    {#if !script}
      <button type="button" class="pill-solid" onclick={playMatch}
        >Play match</button
      >
    {:else if !finished}
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="pill-outline"
          onclick={() => (playing = !playing)}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div class="flex overflow-hidden rounded-full border border-mint">
          {#each speedOptions as s (s)}
            <button
              type="button"
              class={speed === s ? "speed-btn speed-on" : "speed-btn"}
              onclick={() => (speed = s)}>{s}x</button
            >
          {/each}
        </div>
        <button type="button" class="pill-outline" onclick={skip}>Skip</button>
      </div>
    {:else}
      <div class="flex items-center gap-2">
        <button type="button" class="pill-outline" onclick={replay}
          >Replay</button
        >
        <button type="button" class="pill-solid" onclick={onNext}
          >{nextLabel}</button
        >
      </div>
    {/if}
  </div>

  {#if script}
    <div
      class="mt-8 overflow-hidden rounded-[24px] border border-white/15 bg-slate/30"
    >
      <div class="scoreboard px-6 py-5">
        <div class="team-col items-end">
          <p class="font-display text-2xl leading-none text-mint">Your XI</p>
          <p class="mono-label mt-2 text-secondary">
            {userSquad.players.length} players · {userNationCount} same nation
          </p>
        </div>
        <div class="text-center">
          <p class="mono-label text-secondary">
            {displayScore[0]} : {displayScore[1]}
          </p>
          <p class="score-text">{clockLabel}</p>
          {#if phase === "play" && currentSnap.isET}
            <p class="mono-label mt-2 text-yellow">EXTRA TIME</p>
          {/if}
          {#if phase === "pens" || (phase === "done" && script.result.penalties)}
            <p class="mono-label mt-2 text-yellow">
              PENS {pensScore[0]} : {pensScore[1]}
            </p>
          {/if}
        </div>
        <div class="team-col items-start">
          <p class="font-display text-2xl leading-none text-secondary">
            {opponentSquad.name}
          </p>
          <p class="mono-label mt-2 text-secondary">
            {NATION_NAMES[opponentSquad.nation] ?? opponentSquad.nation} · {opponentSquad.wcYear}
          </p>
        </div>
      </div>

      <div class="mx-6 mb-4">
        <div class="flex items-center justify-between">
          <p class="mono-label text-secondary">{teamName(0)}</p>
          <p class="mono-label text-secondary">{teamName(1)}</p>
        </div>
        <div class="mt-1 flex h-2 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full bg-mint transition-all duration-500"
            style:width={`${displayPossession[0] * 100}%`}
          ></div>
          <div
            class="h-full bg-uv transition-all duration-500"
            style:width={`${displayPossession[1] * 100}%`}
          ></div>
        </div>
        <p class="mt-1 text-center font-mono text-[11px] text-secondary">
          {Math.round(displayPossession[0] * 100)} : {Math.round(
            displayPossession[1] * 100,
          )} possession
        </p>
      </div>

      <div class="px-6 pb-5">
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="mono-label text-secondary">SHOTS</p>
            <p class="font-display text-3xl">
              {displayShots[0]} : {displayShots[1]}
            </p>
          </div>
          <div>
            <p class="mono-label text-secondary">ON TARGET</p>
            <p class="font-display text-3xl">
              {displayOnTarget[0]} : {displayOnTarget[1]}
            </p>
          </div>
        </div>
      </div>
    </div>

    {#if phase === "pre"}
      <p class="mono-label mt-6 text-center text-secondary">
        KICK OFF — {teamName(0)} vs {teamName(1)}
      </p>
    {/if}

    {#if flashEvent}
      {#key flashCount}
        <div
          class="goal-flash"
          class:text-mint={flashEvent.teamIndex === 0}
          class:text-uv={flashEvent.teamIndex === 1}
        >
          GOAL! <span class="font-mono">{teamName(flashEvent.teamIndex)}</span>
          —
          <span class="font-display">{flashEvent.scorerName ?? "Goal"}</span>
        </div>
      {/key}
    {/if}

    {#if phase === "pens" || (phase === "done" && script.result.penalties)}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6">
        <p class="mono-label mb-4 text-yellow">PENALTY SHOOTOUT</p>
        <ul class="space-y-2">
          {#each visibleKicks as k, i (i)}
            <li
              class="flex items-center gap-3 text-sm"
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
              <span class="ml-auto font-mono text-xs"
                >{k.scored ? "SCORED" : "SAVED"}</span
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if commentary.length > 0}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6">
        <p class="mono-label mb-4 text-secondary">COMMENTARY</p>
        <ul class="flex max-h-56 flex-col-reverse gap-2 overflow-y-auto pr-2">
          {#each [...commentary].reverse() as line (line.id)}
            <li
              class="text-sm"
              class:text-mint={line.team === 0}
              class:text-uv={line.team === 1}
              class:text-secondary={line.team === undefined}
            >
              {line.text}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if phase === "done" && script.result.events.length > 0}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6">
        <p class="mono-label mb-4 text-secondary">SCORERS</p>
        <ul class="space-y-2">
          {#each script.result.events as ev, i (i)}
            <li class="flex items-center gap-3 text-sm">
              <span class="w-8 font-mono text-xs text-secondary"
                >{ev.minute}'</span
              >
              <span
                class="h-2 w-2 rounded-full"
                style:background={ev.teamIndex === 0 ? "#3cffd0" : "#5200ff"}
              ></span>
              <span>{teamName(ev.teamIndex)}</span>
              <span class="ml-auto text-secondary"
                >{ev.scorerName ?? "Goal"}</span
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if phase === "done"}
      <div class="mt-6 rounded-[24px] border border-white/15 p-6 text-center">
        <p class="mono-label text-mint">
          {script.result.winner === 0
            ? "YOU WIN"
            : script.result.winner === 1
              ? "YOU LOSE"
              : "DRAW"}
        </p>
        {#if script.result.extraTime}
          <p class="mono-label mt-2 text-yellow">
            Extra time{script.result.penalties ? " · decided on penalties" : ""}
          </p>
        {/if}
        {#if script.result.penalties && script.result.penaltyScore}
          <p class="mt-2 font-display text-4xl">
            {script.result.penaltyScore[0]} : {script.result.penaltyScore[1]}
          </p>
        {/if}
      </div>
    {/if}
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
    white-space: nowrap;
  }

  .pill-outline:hover:not(:disabled) {
    background: var(--color-mint);
    color: #000;
  }

  .pill-solid {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #000;
    background: var(--color-mint);
    border: 1px solid var(--color-mint);
    border-radius: 40px;
    padding: 10px 20px;
    transition: all 150ms ease;
    white-space: nowrap;
  }

  .pill-solid:hover {
    filter: brightness(1.1);
  }

  .speed-btn {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    padding: 10px 14px;
    color: var(--color-mint);
    background: transparent;
    transition: all 150ms ease;
  }

  .speed-on {
    background: var(--color-mint);
    color: #000;
  }

  .scoreboard {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 12px;
    align-items: center;
  }

  .team-col {
    display: flex;
    flex-direction: column;
  }

  .score-text {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 600;
    color: var(--color-secondary);
    margin-top: 4px;
  }

  .goal-flash {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: rgba(19, 19, 19, 0.92);
    animation: goalPulse 1.8s ease-out forwards;
    pointer-events: none;
  }

  .goal-flash .font-display {
    text-transform: none;
    letter-spacing: 0;
  }

  @keyframes goalPulse {
    0% {
      opacity: 0;
    }
    12% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
