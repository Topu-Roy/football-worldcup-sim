<script lang="ts">
  import { Pause, Play, RotateCcw, SkipForward } from "@lucide/svelte";

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
  <button
    type="button"
    class="{pillSolid} inline-flex items-center gap-2"
    onclick={onPlayMatch}
  >
    <Play class="h-3.5 w-3.5" /> Play match
  </button>
{:else if hasScript && !finished}
  <button
    type="button"
    class="{pillOutline} inline-flex items-center gap-2"
    onclick={onTogglePlay}
  >
    {#if playing}
      <Pause class="h-3.5 w-3.5" /> Pause
    {:else}
      <Play class="h-3.5 w-3.5" /> Play
    {/if}
  </button>
{:else if hasScript}
  <button
    type="button"
    class="{pillOutline} inline-flex items-center gap-2"
    onclick={onReplay}
  >
    <RotateCcw class="h-3.5 w-3.5" /> Replay
  </button>
  <button
    type="button"
    class="{pillSolid} inline-flex items-center gap-2"
    onclick={onNext}
  >
    {nextLabel}
    <SkipForward class="h-3.5 w-3.5" />
  </button>
{/if}
