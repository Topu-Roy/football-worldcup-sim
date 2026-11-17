<script lang="ts">
  import type { SharePreviewData } from "../../data/share-preview.js";

  let { data }: { data: SharePreviewData } = $props();

  const topPlayer = $derived(
    [...data.players].sort((a, b) => b.rating - a.rating)[0],
  );

  const stats = $derived([
    { label: "GOALS", value: data.goals },
    { label: "CLEAN SHEETS", value: String(data.cleanSheets) },
    { label: "BIGGEST WIN", value: data.biggestWin },
    {
      label: "TOP RATED",
      value: topPlayer ? `${topPlayer.name} ${topPlayer.rating}` : "—",
    },
  ]);

  /** Elite ratings get the accent, stars stay white, the rest are muted. */
  function ratingTier(rating: number): string {
    if (rating >= 94) return "elite";
    if (rating >= 90) return "star";
    return "standard";
  }
</script>

<article
  class="card"
  style={`--accent: ${data.accent}; --accent-soft: ${data.accentSoft};`}
>
  <header class="top">
    <div class="brand">
      <span class="brand-mark"></span>
      <span>MY WORLD CUP XI</span>
    </div>
    <span class="meta">TEAM SHEET / 02</span>
  </header>

  <div class="hero">
    <div class="hero-copy">
      <p class="kicker">FINAL PLACEMENT</p>
      <h2 class={{ long: data.outcomeTitle.length > 10 }}>
        {data.outcomeTitle}
      </h2>
      <p class="note">{data.outcomeNote}</p>
      <div class="chips">
        <span>FORMATION {data.formation}</span>
        <span>RECORD {data.record}</span>
      </div>
    </div>

    <div class="rating-wrap">
      <span class="rating-label">TEAM RATING</span>
      <div class="rating-ring" style={`--value: ${data.teamRating};`}>
        <div class="ring-inner">
          <strong>{data.teamRating}</strong>
          <span>OVR</span>
        </div>
      </div>
    </div>
  </div>

  <div class="pitch-band" aria-hidden="true">
    <span class="pitch-mark outer"></span>
    <span class="pitch-mark halfway"></span>
    <span class="pitch-mark circle"></span>
    <span class="pitch-mark box left"></span>
    <span class="pitch-mark box right"></span>
    {#each data.players as player (player.id)}
      <span
        class="pitch-player"
        style:left={`${100 - player.y}%`}
        style:top={`${player.x}%`}
      >
        <i style:border-color={player.color}>{player.number}</i>
        <span class="pitch-name">{player.name}</span>
      </span>
    {/each}
  </div>

  <div class="stat-strip">
    {#each stats as stat (stat.label)}
      <div class="stat">
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
      </div>
    {/each}
  </div>

  <div class="roster">
    {#each data.players as player (player.id)}
      <div class="player" style={`--dept: ${player.color};`}>
        <span class="num">{player.number}</span>
        <span class="player-copy">
          <span class="name">{player.name}</span>
          <span class="role">{player.role}</span>
        </span>
        <span class="rating {ratingTier(player.rating)}">{player.rating}</span>
      </div>
    {/each}
  </div>

  <footer class="bottom">
    <span class="cta">DRAFT YOUR OWN XI</span>
    <span class="site">myworldcupxi.com</span>
  </footer>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
    padding: 64px;
    color: #ffffff;
    font-family: var(--font-sans);
    background:
      radial-gradient(circle at 78% 6%, var(--accent-soft), transparent 30%),
      linear-gradient(155deg, #131313 0%, #171020 64%, #1d0f35 100%);
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 5.5px;
    text-transform: uppercase;
  }

  .brand-mark {
    width: 14px;
    height: 14px;
    background: var(--accent);
  }

  .meta {
    color: #949494;
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 170px;
    align-items: center;
    gap: 34px;
    height: 176px;
    margin-top: 22px;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .kicker,
  .note,
  .chips span,
  .rating-label,
  .stat span,
  .pitch-name,
  .role {
    font-family: var(--font-mono);
    font-weight: 600;
    text-transform: uppercase;
  }

  .kicker {
    margin: 0;
    color: #949494;
    font-size: 16px;
    letter-spacing: 4px;
  }

  h2 {
    margin: 14px 0 0;
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 62px;
    line-height: 0.82;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-shadow: 0 0 50px var(--accent-soft);
  }

  h2.long {
    font-size: 40px;
  }

  .note {
    margin: 12px 0 0;
    color: #949494;
    font-size: 16px;
    letter-spacing: 0.5px;
  }

  .chips {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .chips span {
    padding: 6px 10px;
    border: 1px solid rgb(255 255 255 / 0.14);
    border-radius: 999px;
    color: #e9e9e9;
    font-size: 10px;
    letter-spacing: 1.3px;
  }

  .rating-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .rating-label {
    color: #949494;
    font-size: 10px;
    letter-spacing: 1.8px;
  }

  .rating-ring {
    display: grid;
    width: 156px;
    height: 156px;
    place-items: center;
    border-radius: 999px;
    background: conic-gradient(
      var(--accent) calc(var(--value) * 1%),
      rgb(255 255 255 / 0.08) 0
    );
    box-shadow: 0 0 50px var(--accent-soft);
  }

  .ring-inner {
    display: flex;
    width: 126px;
    height: 126px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #171021;
  }

  .ring-inner strong {
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 56px;
    line-height: 0.9;
  }

  .ring-inner span {
    margin-top: 1px;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.4px;
  }

  .pitch-band {
    position: relative;
    height: 240px;
    margin-top: 18px;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 0.14);
    border-radius: 18px;
    background: repeating-linear-gradient(
      90deg,
      #1d6935 0 58px,
      #23773e 58px 116px
    );
  }

  .pitch-mark {
    position: absolute;
    border-color: rgb(226 255 233 / 0.42);
    pointer-events: none;
  }

  .pitch-mark.outer {
    inset: 16px;
    border: 2px solid rgb(226 255 233 / 0.42);
  }

  .pitch-mark.halfway {
    top: 16px;
    bottom: 16px;
    left: 50%;
    border-left: 2px solid rgb(226 255 233 / 0.42);
  }

  .pitch-mark.circle {
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    border: 2px solid rgb(226 255 233 / 0.42);
    border-radius: 999px;
    transform: translate(-50%, -50%);
  }

  .pitch-mark.box {
    top: 50%;
    width: 14%;
    height: 54%;
    border: 2px solid rgb(226 255 233 / 0.42);
    transform: translateY(-50%);
  }

  .pitch-mark.box.left {
    left: 16px;
  }

  .pitch-mark.box.right {
    right: 16px;
  }

  .pitch-player {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    transform: translate(-50%, -50%);
  }

  .pitch-player i {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border: 2px solid;
    border-radius: 999px;
    background: #ffffff;
    color: #131313;
    font-family: var(--font-mono);
    font-size: 8px;
    font-style: normal;
    font-weight: 700;
  }

  .pitch-name {
    max-width: 96px;
    overflow: hidden;
    color: #ffffff;
    font-size: 10px;
    letter-spacing: 0.4px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgb(0 0 0 / 0.7);
    white-space: nowrap;
  }

  .stat-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 16px;
    border-top: 1px solid rgb(255 255 255 / 0.1);
    border-bottom: 1px solid rgb(255 255 255 / 0.1);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 0 12px 24px;
    border-left: 1px solid rgb(255 255 255 / 0.1);
  }

  .stat:first-child {
    padding-left: 0;
    border-left: 0;
  }

  .stat span {
    color: #949494;
    font-size: 11px;
    letter-spacing: 1.6px;
  }

  .stat strong {
    font-family: var(--font-display);
    font-size: 28px;
    line-height: 1;
  }

  .roster {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 72px;
    gap: 10px;
    margin-top: 16px;
  }

  .player {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 0 16px;
    border: 1px solid rgb(255 255 255 / 0.09);
    border-left: 3px solid var(--dept);
    border-radius: 12px;
    background: rgb(255 255 255 / 0.035);
  }

  /* The eleventh player stretches across the last row so the grid stays flush. */
  .player:last-child {
    grid-column: span 2;
  }

  .num {
    flex-shrink: 0;
    color: var(--dept);
    font-family: var(--font-display);
    font-size: 32px;
    line-height: 1;
  }

  .player-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .name {
    overflow: hidden;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: 0.2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role {
    color: var(--dept);
    font-size: 9px;
    letter-spacing: 1.1px;
  }

  .rating {
    display: grid;
    flex-shrink: 0;
    width: 42px;
    height: 30px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 8px;
    font-family: var(--font-display);
    font-size: 20px;
    line-height: 1;
  }

  .rating.elite {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--accent);
  }

  .rating.star {
    color: #ffffff;
  }

  .rating.standard {
    color: #949494;
  }

  .bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgb(255 255 255 / 0.12);
    font-family: var(--font-mono);
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .cta {
    color: var(--accent);
    letter-spacing: 2.6px;
  }

  .site {
    color: #949494;
    letter-spacing: 0.5px;
    text-transform: none;
  }
</style>
