<script lang="ts">
  import type { SharePreviewData } from "../../data/share-preview.js";

  let { data }: { data: SharePreviewData } = $props();

  const topPlayer = $derived(
    [...data.players].sort((a, b) => b.rating - a.rating)[0],
  );

  const stats = $derived([
    { label: "RECORD", value: data.record },
    { label: "GOALS", value: data.goals },
    { label: "CLEAN SHEETS", value: String(data.cleanSheets) },
    { label: "BIGGEST WIN", value: data.biggestWin },
  ]);

  const miniStats = $derived([
    { label: "MATCHES", value: String(data.played) },
    { label: "GOALS / GAME", value: data.avgGoals },
    { label: "PEN WINS", value: String(data.penaltyWins) },
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
  <div class="glow" aria-hidden="true"></div>

  <header class="top">
    <div class="brand">
      <span class="brand-mark"></span>
      <span>MY WORLD CUP XI</span>
    </div>
    <span class="meta">TEAM SHEET / 01</span>
  </header>

  <div class="banner">
    <div class="banner-copy">
      <p class="kicker">FINAL PLACEMENT</p>
      <h2 class={{ long: data.outcomeTitle.length > 10 }}>
        {data.outcomeTitle}
      </h2>
      <p class="note">{data.outcomeNote}</p>
      <span class="formation">FORMATION {data.formation}</span>
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

  <div class="stat-strip">
    {#each stats as stat (stat.label)}
      <div class="stat">
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
      </div>
    {/each}
  </div>

  <div class="body">
    <div class="pitch-column">
      <div class="pitch" aria-hidden="true">
        <span class="pitch-mark outer"></span>
        <span class="pitch-mark halfway"></span>
        <span class="pitch-mark circle"></span>
        <span class="pitch-mark box top"></span>
        <span class="pitch-mark box bottom"></span>
        {#each data.players as player (player.id)}
          <span
            class="pitch-player"
            style:left={`${player.x}%`}
            style:top={`${player.y}%`}
            style:border-color={player.color}>{player.number}</span
          >
        {/each}
      </div>

      {#if topPlayer}
        <div class="top-player" style={`--dept: ${topPlayer.color};`}>
          <div>
            <span class="top-player-label">TOP RATED</span>
            <p>{topPlayer.name}</p>
            <span class="top-player-role">
              {topPlayer.role} · #{topPlayer.number}
            </span>
          </div>
          <strong>{topPlayer.rating}</strong>
        </div>
      {/if}

      <div class="mini-stats">
        {#each miniStats as stat (stat.label)}
          <div class="mini-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        {/each}
      </div>
    </div>

    <div class="roster">
      <div class="roster-head">
        <span>NO.</span>
        <span>PLAYER</span>
        <span>ROLE</span>
        <span>OVR</span>
      </div>
      {#each data.players as player (player.id)}
        <div class="roster-row" style={`--dept: ${player.color};`}>
          <span class="roster-num" style:color={player.color}
            >{player.number}</span
          >
          <span class="roster-name">{player.name}</span>
          <span class="roster-role" style:color={player.color}
            >{player.role}</span
          >
          <span class="rating {ratingTier(player.rating)}">{player.rating}</span
          >
        </div>
      {/each}
    </div>
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
      radial-gradient(circle at 82% 10%, var(--accent-soft), transparent 28%),
      linear-gradient(150deg, #131313 0%, #171020 66%, #1c0e33 100%);
  }

  .glow {
    position: absolute;
    top: -220px;
    right: -150px;
    width: 560px;
    height: 560px;
    border-radius: 999px;
    background: var(--accent-soft);
    filter: blur(120px);
    pointer-events: none;
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

  .banner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 190px;
    gap: 34px;
    height: 178px;
    margin-top: 26px;
  }

  .banner-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .kicker,
  .note,
  .formation,
  .rating-label,
  .stat span,
  .mini-stat span,
  .top-player-label,
  .top-player-role,
  .roster-head,
  .roster-role {
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
    margin: 16px 0 0;
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 70px;
    line-height: 0.82;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-shadow: 0 0 50px var(--accent-soft);
  }

  h2.long {
    font-size: 46px;
  }

  .note {
    margin: 12px 0 0;
    color: #949494;
    font-size: 17px;
    letter-spacing: 0.5px;
  }

  .formation {
    width: fit-content;
    margin-top: auto;
    padding: 7px 12px;
    border: 1px solid rgb(255 255 255 / 0.14);
    border-radius: 999px;
    color: #e9e9e9;
    font-size: 11px;
    letter-spacing: 1.6px;
  }

  .rating-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;
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

  .stat-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 18px;
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
    font-size: 12px;
    letter-spacing: 1.8px;
  }

  .stat strong {
    font-family: var(--font-display);
    font-size: 30px;
    line-height: 1;
  }

  .body {
    display: grid;
    flex: 1;
    grid-template-columns: 360px minmax(0, 1fr);
    gap: 28px;
    min-height: 0;
    margin-top: 20px;
  }

  .pitch-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    min-height: 0;
  }

  .pitch {
    position: relative;
    flex: 1;
    min-height: 430px;
    max-height: 560px;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 0.14);
    border-radius: 18px;
    background: repeating-linear-gradient(
      180deg,
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
    inset: 18px;
    border: 2px solid rgb(226 255 233 / 0.42);
  }

  .pitch-mark.halfway {
    top: 50%;
    right: 18px;
    left: 18px;
    border-top: 2px solid rgb(226 255 233 / 0.42);
  }

  .pitch-mark.circle {
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    border: 2px solid rgb(226 255 233 / 0.42);
    border-radius: 999px;
    transform: translate(-50%, -50%);
  }

  .pitch-mark.box {
    left: 50%;
    width: 54%;
    height: 13%;
    border: 2px solid rgb(226 255 233 / 0.42);
    transform: translateX(-50%);
  }

  .pitch-mark.box.top {
    top: 18px;
  }

  .pitch-mark.box.bottom {
    bottom: 18px;
  }

  .pitch-player {
    position: absolute;
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border: 2px solid;
    border-radius: 999px;
    background: #ffffff;
    color: #131313;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 700;
    transform: translate(-50%, -50%);
  }

  .top-player {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px;
    border: 1px solid color-mix(in srgb, var(--dept) 40%, transparent);
    border-radius: 16px;
    background: color-mix(in srgb, var(--dept) 9%, transparent);
  }

  .top-player-label {
    color: #949494;
    font-size: 10px;
    letter-spacing: 1.6px;
  }

  .top-player p {
    margin: 3px 0 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .top-player-role {
    display: block;
    margin-top: 4px;
    color: var(--dept);
    font-size: 10px;
    letter-spacing: 1.2px;
  }

  .top-player strong {
    color: var(--dept);
    font-family: var(--font-display);
    font-size: 44px;
    line-height: 1;
  }

  .mini-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .mini-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 12px;
    background: rgb(255 255 255 / 0.035);
  }

  .mini-stat span {
    color: #949494;
    font-size: 9px;
    letter-spacing: 1.2px;
  }

  .mini-stat strong {
    font-family: var(--font-display);
    font-size: 24px;
    line-height: 1;
  }

  .roster {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .roster-head,
  .roster-row {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr) 46px 54px;
    align-items: center;
    gap: 14px;
  }

  .roster-head {
    padding-bottom: 8px;
    border-bottom: 1px solid rgb(255 255 255 / 0.14);
    color: #949494;
    font-size: 11px;
    letter-spacing: 1.8px;
  }

  .roster-head span:nth-child(3),
  .roster-head span:nth-child(4) {
    text-align: right;
  }

  .roster-row {
    flex: 1;
    min-height: 0;
    border-bottom: 1px solid rgb(255 255 255 / 0.07);
  }

  .roster-num {
    font-family: var(--font-mono);
    font-size: 20px;
    font-weight: 700;
  }

  .roster-name {
    overflow: hidden;
    font-size: 23px;
    font-weight: 700;
    letter-spacing: 0.2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .roster-role {
    color: var(--dept);
    font-size: 10px;
    letter-spacing: 1.1px;
    text-align: right;
  }

  .rating {
    display: grid;
    width: 46px;
    height: 32px;
    place-items: center;
    justify-self: end;
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
    margin-top: 18px;
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
