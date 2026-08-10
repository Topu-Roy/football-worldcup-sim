<script lang="ts">
  let {
    hasScript,
    hasResult,
    finished,
    playing,
    onPlayMatch,
    onTogglePlay,
    onReplay,
    onNext,
    nextLabel = "Next match",
  }: {
    hasScript: boolean;
    hasResult: boolean;
    finished: boolean;
    playing: boolean;
    onPlayMatch: () => void;
    onTogglePlay: () => void;
    onReplay: () => void;
    onNext: () => void;
    nextLabel?: string;
  } = $props();

  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent whitespace-nowrap transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
  const pillSolid =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-black bg-mint border border-mint rounded-full px-5 py-2.5 whitespace-nowrap transition-all duration-150 hover:brightness-110";
</script>

{#if !hasScript && !hasResult}
  <button type="button" class={pillSolid} onclick={onPlayMatch}>Play match</button>
{:else if hasScript && !finished}
  <button type="button" class={pillOutline} onclick={onTogglePlay}>
    {playing ? "Pause" : "Play"}
  </button>
{:else if hasScript}
  <button type="button" class={pillOutline} onclick={onReplay}>Replay</button>
  <button type="button" class={pillSolid} onclick={onNext}>{nextLabel}</button>
{/if}