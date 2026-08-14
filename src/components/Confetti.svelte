<script lang="ts">
  interface Piece {
    left: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    drift: number;
    rotate: number;
    round: boolean;
  }

  const COLORS = ["#3cffd0", "#ff4fd8", "#ffd166", "#60a5fa", "#a78bfa", "#ffffff"];

  const pieces = $state<Piece[]>(
    Array.from({ length: 140 }, () => ({
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2.5,
      duration: 2.5 + Math.random() * 2.5,
      drift: -40 + Math.random() * 80,
      rotate: 180 + Math.random() * 540,
      round: Math.random() < 0.3,
    })),
  );
</script>

<div class="confetti-layer" aria-hidden="true">
  {#each pieces as p, i (i)}
    <span
      class="confetti-piece"
      class:round={p.round}
      style:left={`${p.left}%`}
      style:width={`${p.size}px`}
      style:height={`${p.round ? p.size : p.size * 0.45}px`}
      style:background-color={p.color}
      style:animation-delay={`${p.delay}s`}
      style:animation-duration={`${p.duration}s`}
      style:--drift={`${p.drift}px`}
      style:--rotate={`${p.rotate}deg`}
    ></span>
  {/each}
</div>

<style>
  .confetti-layer {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 50;
  }

  .confetti-piece {
    position: absolute;
    top: -20px;
    border-radius: 2px;
    animation-name: confetti-fall;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .confetti-piece.round {
    border-radius: 9999px;
  }

  @keyframes confetti-fall {
    0% {
      transform: translate3d(0, -20px, 0) rotate(0deg);
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rotate));
      opacity: 0.7;
    }
  }
</style>