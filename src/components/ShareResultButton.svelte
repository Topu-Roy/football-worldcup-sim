<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { LoaderCircle, Share2 } from "@lucide/svelte";
  import type { AggregateStats, Tournament } from "../lib/tournament.js";
  import {
    buildShareCardData,
    shareFilename,
    shareText,
    shareTitle,
  } from "../lib/shareCard.js";
  import { downloadShareImage, renderSharePng } from "../lib/shareCanvas.js";

  let {
    tournament,
    formationKey,
    stats,
  }: {
    tournament: Tournament;
    formationKey: string;
    stats: AggregateStats;
  } = $props();

  let busy = $state(false);
  let status = $state("");
  let statusTimer: ReturnType<typeof setTimeout> | undefined;

  // Cached render so the click can reach navigator.share before activation expires.
  let pngPromise: Promise<Blob> | null = null;

  const data = $derived(buildShareCardData(tournament, formationKey, stats));

  // Shared outline pill styling, kept in sync with ResultsView's action pills.
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";

  /** Render the card once; a failed render is not cached so a retry can run. */
  function getPng(): Promise<Blob> {
    if (!pngPromise) {
      pngPromise = renderSharePng(data).catch((error) => {
        pngPromise = null;
        throw error;
      });
    }
    return pngPromise;
  }

  /** Share-sheet cancellation surfaces as `AbortError`, sometimes as a plain object. */
  function isAbortError(error: unknown): boolean {
    return (
      !!error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: unknown }).name === "AbortError"
    );
  }

  /** Show a short-lived status message, replacing any pending one. */
  function setStatus(message: string): void {
    clearTimeout(statusTimer);
    status = message;
    statusTimer = setTimeout(() => {
      status = "";
    }, 4000);
  }

  /** True when the browser can hand the rendered PNG to the native share sheet. */
  function canNativeShare(file: File): boolean {
    if (
      typeof navigator === "undefined" ||
      typeof navigator.share !== "function"
    )
      return false;
    if (!navigator.canShare) return true;
    try {
      return navigator.canShare({ files: [file] });
    } catch {
      // Some browsers throw for unsupported payloads instead of returning false.
      return false;
    }
  }

  async function handleShare(): Promise<void> {
    if (busy) return;

    busy = true;
    clearTimeout(statusTimer);
    status = "";

    try {
      const blob = await getPng();
      const filename = shareFilename(data);
      const file = new File([blob], filename, { type: "image/png" });

      if (canNativeShare(file)) {
        try {
          await navigator.share({
            files: [file],
            title: shareTitle(data),
            text: shareText(data),
          });
          return;
        } catch (error) {
          // Cancelling the share sheet is a normal exit, not a failure.
          if (isAbortError(error)) {
            return;
          }
          downloadShareImage(blob, filename);
          setStatus("Image downloaded");
          return;
        }
      }

      downloadShareImage(blob, filename);
      setStatus("Image downloaded");
    } catch {
      setStatus("Could not create the image");
    } finally {
      busy = false;
    }
  }

  // Warm the render after mount (not during it) so the first click has a ready blob.
  onMount(() => {
    const timer = setTimeout(() => {
      void getPng().catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  });

  // Drop any pending status timer when the component goes away.
  onDestroy(() => {
    clearTimeout(statusTimer);
  });
</script>

<div class="flex flex-col items-end">
  <button
    type="button"
    class="{pillOutline} inline-flex items-center gap-2 disabled:opacity-60"
    title="Share your result as an image"
    aria-label="Share result as image"
    aria-busy={busy}
    disabled={busy}
    onclick={handleShare}
  >
    {#if busy}
      <LoaderCircle class="h-3.5 w-3.5 motion-safe:animate-spin" />
      Preparing…
    {:else}
      <Share2 class="h-3.5 w-3.5" />
      Share
    {/if}
  </button>
  <p
    class="font-mono text-[9px] tracking-[1px] text-secondary uppercase {status
      ? 'mt-1'
      : 'h-0 overflow-hidden'}"
    role="status"
    aria-live="polite"
  >
    {status}
  </p>
</div>
