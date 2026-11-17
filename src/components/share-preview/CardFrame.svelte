<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";

  let {
    children,
    label,
  }: {
    children: Snippet;
    /** Summary announced when the card is treated as an image. */
    label: string;
  } = $props();

  // A sensible SSR fallback; the attachment replaces it with the measured width.
  let scale = $state(0.5);

  // Cards are authored at 1080x1350. Scale the fixed canvas to fit its column
  // so every design keeps exact pixel proportions on any screen.
  const fit: Attachment<HTMLDivElement> = (element) => {
    const update = () => {
      scale = (element.clientWidth || 540) / 1080;
    };

    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();

    return () => observer.disconnect();
  };
</script>

<div class="frame" role="img" aria-label={label} {@attach fit}>
  <div class="canvas" style:transform="scale({scale})">
    {@render children()}
  </div>
</div>

<style>
  .frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1080 / 1350;
    overflow: hidden;
    border-radius: 24px;
    background: #131313;
    box-shadow: 0 24px 70px rgb(0 0 0 / 0.45);
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 1080px;
    height: 1350px;
    transform-origin: top left;
  }
</style>
