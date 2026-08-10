<script lang="ts">
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
  import MatchCard from "./match/MatchCard.svelte";
  import MatchControls from "./match/MatchControls.svelte";
  import MatchGoalsPanel from "./match/MatchGoalsPanel.svelte";
  import MatchPenaltyPanel from "./match/MatchPenaltyPanel.svelte";
  import MatchStatsPanel from "./match/MatchStatsPanel.svelte";

  let {
    userSquad,
    opponentSquad,
    roundLabel,
    onResult,
    onNext,
    nextLabel = "Next match",
    regulationOnly = false,
    autoStart = false,
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

  const userNationCount = $derived(countSameNation(userSquad.players));

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

  const shouldAutoStart = autoStart && !presetResult;

  let script = $state<MatchScript | null>(
    shouldAutoStart
      ? simulateMatchScript(userSquad, opponentSquad, { regulationOnly })
      : null,
  );
  let segIndex = $state(0);
  let penIndex = $state(0);
  let playing = $state(shouldAutoStart);
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

  const liveStatus = $derived(
    phase === "pre"
      ? "KICK OFF"
      : phase === "play"
        ? "LIVE"
        : phase === "pens"
          ? "PENS"
          : "",
  );

  const showPens = $derived(
    phase === "pens" || (phase === "done" && !!result?.penalties),
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

  function playMatch() {
    if (script) return;
    script = simulateMatchScript(userSquad, opponentSquad, { regulationOnly });
    segIndex = 0;
    penIndex = 0;
    finished = false;
    playing = true;
  }

  function togglePlay() {
    playing = !playing;
  }

  function reachIndex(i: number) {
    segIndex = i;
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

  function finish() {
    if (finished || !script) return;
    finished = true;
    playing = false;
    onResult(script.result);
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
</script>

{#if script || presetResult}
  <MatchCard
    {userSquad}
    {opponentSquad}
    {roundLabel}
    {userNationCount}
    {userAvg}
    {oppAvg}
    {liveStatus}
    {clockLabel}
    {phase}
    {showPens}
    {pensScore}
    {displayScore}
    controls={cardControls}
  >
    <div class="grid gap-4 md:grid-cols-2">
      <MatchGoalsPanel events={goalEvents} {teamName} />
      <MatchStatsPanel
        possession={displayPossession}
        xg={displayXg}
        shots={displayShots}
        shotsOnTarget={displayOnTarget}
      />
    </div>

    {#if script && (phase === "pens" || (phase === "done" && script.result.penalties))}
      <MatchPenaltyPanel kicks={visibleKicks} />
    {/if}
  </MatchCard>
{/if}

{#snippet cardControls()}
  <MatchControls
    hasScript={!!script}
    hasResult={!!presetResult}
    {finished}
    {playing}
    onPlayMatch={playMatch}
    onTogglePlay={togglePlay}
    onReplay={replay}
    {onNext}
    {nextLabel}
  />
{/snippet}