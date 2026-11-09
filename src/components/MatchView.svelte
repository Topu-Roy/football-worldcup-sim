<script lang="ts">
  import { untrack } from "svelte";
  import { simulateMatchScript } from "../lib/matchEngine.js";
  import type {
    MatchResult,
    MatchScript,
    PenaltyKick,
    SegmentSnapshot,
    Squad,
  } from "../lib/types.js";
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
    presetScript = null,
  }: {
    userSquad: Squad;
    opponentSquad: Squad;
    roundLabel: string;
    onResult: (r: MatchResult, script?: MatchScript) => void;
    onNext: () => void;
    nextLabel?: string;
    regulationOnly?: boolean;
    autoStart?: boolean;
    presetResult?: MatchResult | null;
    presetScript?: MatchScript | null;
  } = $props();

  const teamName = (t: 0 | 1) => (t === 0 ? "Your team" : opponentSquad.name);

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

  const shouldAutoStart = $derived(autoStart && !presetResult);

  // A stored script lets the card replay the exact match that was played. The
  // initial read is intentional: the card is mounted once per expanded match.
  let script = $state<MatchScript | null>(untrack(() => presetScript ?? null));
  let segIndex = $state(0);
  let penIndex = $state(untrack(() => presetScript?.penalties?.length ?? 0));
  let playing = $state(false);
  let finished = $state(untrack(() => !!presetScript));

  // Auto-starting matches simulate the full script on mount so the first
  // "Play" press (or auto-run) has everything it needs to start instantly.
  // The playMatch guard makes any re-run of this effect a no-op.
  $effect(() => {
    if (shouldAutoStart && !script) playMatch();
  });

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
        ? script?.penalties?.length
          ? "pens"
          : "done"
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
      : (result?.penaltyScore ?? [0, 0]),
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

  // Reveal goals segment by segment while a script is playing; the full list
  // only appears once the match is done.
  const goalEvents = $derived(
    done && result
      ? result.events.slice().sort((a, b) => a.minute - b.minute)
      : snaps.slice(0, segIndex).flatMap((s) => s.events),
  );

  const visibleKicks = $derived<PenaltyKick[]>(
    script?.penalties?.slice(0, penIndex) ?? result?.penaltyKicks ?? [],
  );

  /** Kick off the match: simulate the full script (regulation + pens) up front, then reveal it segment by segment. */
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

  /** Advance one segment: regulation snap, penalty kick, or finish when the script is exhausted. */
  function advance() {
    if (!script || finished) return;
    if (segIndex < snaps.length) {
      reachIndex(segIndex + 1);
      // No shootout to reveal: finish as soon as the last segment is shown.
      if (segIndex >= snaps.length && !script.penalties?.length) finish();
    } else if (script.penalties && penIndex < script.penalties.length) {
      penIndex += 1;
    } else {
      finish();
    }
  }

  /** End the match and report the final result to the parent. Replaying a stored result must not re-register it. */
  function finish() {
    if (finished || !script) return;
    finished = true;
    playing = false;
    if (!presetResult) onResult(script.result, script);
  }

  /** Restart playback from the opening whistle using the already-simulated script. */
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

    {#if showPens}
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
