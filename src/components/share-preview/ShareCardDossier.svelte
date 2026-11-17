<script lang="ts">
  import type { SharePreviewData } from "../../data/share-preview.js";

  let { data }: { data: SharePreviewData } = $props();

  const topPlayer = $derived(
    [...data.players].sort((a, b) => b.rating - a.rating)[0],
  );

  const sideStats = $derived([
    { label: "RECORD", value: data.record },
    { label: "GOALS", value: data.goals },
    { label: "CLEAN SHEETS", value: String(data.cleanSheets) },
    { label: "BIGGEST WIN", value: data.biggestWin },
  ]);

  const DEPARTMENTS = [
    { key: "GK", color: "#3cffd0" },
    { key: "DEF", color: "#3c9dff" },
    { key: "MID", color: "#ffd23c" },
    { key: "ATT", color: "#ff8a3c" },
  ] as const;

  // Count the drafted XI by department for the side-panel summary.
  const breakdown = $derived(
    DEPARTMENTS.map((department) => ({
      ...department,
      count: data.players.filter(
        (player) => player.department === department.key,
      ).length,
    })),
  );

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
  <aside class="side">
    <div class="side-brand">
      <span class="brand-mark"></span>
      <span>MY WORLD CUP XI</span>
    </div>

    <p class="kicker">FINAL PLACEMENT</p>
    <h2 class={{ long: data.outcomeTitle.length > 10 }}>
      {data.outcomeTitle}
    </h2>
    <p class="note">{data.outcomeNote}</p>

    <div class="side-rating">
      <span>TEAM RATING</span>
      <div class="side-rating-value">
        <strong>{data.teamRating}</strong>
        <span>OVR</span>
      </div>
      <div class="side-rating-track">
        <i style:width={`${data.teamRating}%`}></i>
      </div>
    </div>

    <div class="mini-pitch" aria-hidden="true">
      <span class="mini-mark outer"></span>
      <span class="mini-mark halfway"></span>
      <span class="mini-mark circle"></span>
      {#each data.players as player (player.id)}
        <span
          class="mini-player"
          style:left={`${player.x}%`}
          style:top={`${player.y}%`}
          style:border-color={player.color}>{player.number}</span
        >
      {/each}
    </div>

    <div class="breakdown">
      <p class="section-label">SQUAD BREAKDOWN</p>
      {#each breakdown as row (row.key)}
        <div class="dept-row">
          <span class="dept-name" style:color={row.color}>{row.key}</span>
          <span class="dept-track">
            <i
              style:width={`${(row.count / data.players.length) * 100}%`}
              style:background={row.color}
            ></i>
          </span>
          <strong>{row.count}</strong>
        </div>
      {/each}
    </div>

    <div class="side-stats">
      {#each sideStats as stat (stat.label)}
        <div class="side-stat">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      {/each}
    </div>
  </aside>

  <div class="main">
    <header class="main-head">
      <span>TEAM SHEET / 03</span>
      <span>FORMATION {data.formation}</span>
    </header>

    <div class="title-row">
      <div>
        <p class="eyebrow">STARTING XI</p>
        <h3>{data.record}</h3>
        <p class="run-line">
          {data.played} matches · {data.points} points
        </p>
      </div>
      {#if topPlayer}
        <div class="top-rated">
          <span>TOP RATED</span>
          <strong>{topPlayer.name}</strong>
          <em>{topPlayer.rating}</em>
        </div>
      {/if}
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
          <span class="shirt" style:border-color={player.color}
            >{player.number}</span
          >
          <span class="name">{player.name}</span>
          <span class="role" style:color={player.color}>{player.role}</span>
          <span class="rating {ratingTier(player.rating)}">{player.rating}</span
          >
        </div>
      {/each}
    </div>

    <footer class="bottom">
      <span class="cta">DRAFT YOUR OWN XI</span>
      <span class="site">myworldcupxi.com</span>
    </footer>
  </div>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
    color: #ffffff;
    font-family: var(--font-sans);
    background-color: #131313;
    background-image:
      radial-gradient(circle at 92% 8%, var(--accent-soft), transparent 26%),
      linear-gradient(145deg, #131313 0%, #171021 70%, #1c0e33 100%);
  }

  .side {
    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: 390px;
    padding: 46px 36px;
    overflow: hidden;
    border-right: 1px solid rgb(255 255 255 / 0.1);
    background:
      radial-gradient(circle at 20% 14%, var(--accent-soft), transparent 38%),
      linear-gradient(180deg, rgb(255 255 255 / 0.045), transparent 62%);
  }

  /* Oversized mark fills the panel space the stats do not use. */
  .side::after {
    position: absolute;
    bottom: 200px;
    left: 0;
    color: transparent;
    font-family: var(--font-display);
    font-size: 220px;
    line-height: 0.7;
    letter-spacing: -6px;
    opacity: 0.7;
    content: "XI";
    -webkit-text-stroke: 2px rgb(255 255 255 / 0.07);
    pointer-events: none;
  }

  .side > * {
    position: relative;
    z-index: 1;
  }

  .side-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 3.4px;
    text-transform: uppercase;
  }

  .brand-mark {
    width: 12px;
    height: 12px;
    background: var(--accent);
  }

  .kicker {
    margin: 40px 0 0;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h2 {
    margin: 14px 0 0;
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 52px;
    line-height: 0.82;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-shadow: 0 0 45px var(--accent-soft);
  }

  h2.long {
    font-size: 38px;
  }

  .note {
    margin: 14px 0 0;
    color: #949494;
    font-size: 14px;
    line-height: 1.45;
  }

  .side-rating {
    margin-top: 18px;
    padding: 14px 16px;
    border: 1px solid color-mix(in srgb, var(--accent) 32%, transparent);
    border-radius: 16px;
    background:
      radial-gradient(
        circle at 100% 0%,
        color-mix(in srgb, var(--accent) 18%, transparent),
        transparent 70%
      ),
      rgb(255 255 255 / 0.035);
  }

  .side-rating > span {
    color: #949494;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.6px;
  }

  .side-rating-value {
    display: flex;
    align-items: flex-end;
    gap: 7px;
  }

  .side-rating-value strong {
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 72px;
    line-height: 0.78;
    letter-spacing: -0.5px;
  }

  .side-rating-value span {
    padding-bottom: 3px;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
  }

  .side-rating-track {
    height: 5px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.1);
  }

  .side-rating-track i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent);
  }

  .mini-pitch {
    position: relative;
    height: 440px;
    margin-top: 18px;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 0.14);
    border-radius: 16px;
    background: repeating-linear-gradient(
      180deg,
      #1d6935 0 44px,
      #23773e 44px 88px
    );
  }

  .mini-mark {
    position: absolute;
    border-color: rgb(226 255 233 / 0.42);
    pointer-events: none;
  }

  .mini-mark.outer {
    inset: 14px;
    border: 2px solid rgb(226 255 233 / 0.42);
  }

  .mini-mark.halfway {
    top: 50%;
    right: 14px;
    left: 14px;
    border-top: 2px solid rgb(226 255 233 / 0.42);
  }

  .mini-mark.circle {
    top: 50%;
    left: 50%;
    width: 52px;
    height: 52px;
    border: 2px solid rgb(226 255 233 / 0.42);
    border-radius: 999px;
    transform: translate(-50%, -50%);
  }

  .mini-player {
    position: absolute;
    display: grid;
    width: 21px;
    height: 21px;
    place-items: center;
    border: 2px solid;
    border-radius: 999px;
    background: #ffffff;
    color: #131313;
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 700;
    transform: translate(-50%, -50%);
  }

  .breakdown {
    margin-top: 14px;
  }

  .section-label {
    margin: 0 0 4px;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  .dept-row {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) 18px;
    align-items: center;
    gap: 10px;
    height: 24px;
  }

  .dept-name,
  .dept-row strong {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .dept-row strong {
    color: #ffffff;
    text-align: right;
  }

  .dept-track {
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.09);
  }

  .dept-track i {
    display: block;
    height: 100%;
    border-radius: inherit;
  }

  .side-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: auto;
    padding-top: 14px;
  }

  .side-stat {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 9px 10px;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 11px;
    background: rgb(255 255 255 / 0.04);
  }

  .side-stat span {
    color: #949494;
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1.1px;
    text-transform: uppercase;
  }

  .side-stat strong {
    font-family: var(--font-display);
    font-size: 23px;
    line-height: 1;
  }

  .main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: 64px 56px 48px;
  }

  .main-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-top: 30px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgb(255 255 255 / 0.12);
  }

  .eyebrow {
    margin: 0;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2.6px;
    text-transform: uppercase;
  }

  h3 {
    margin: 8px 0 0;
    font-family: var(--font-display);
    font-size: 46px;
    line-height: 0.9;
    letter-spacing: 0.5px;
  }

  .run-line {
    margin: 8px 0 0;
    color: #949494;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .top-rated {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 999px;
    background: rgb(255 255 255 / 0.035);
  }

  .top-rated span {
    color: #949494;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.3px;
  }

  .top-rated strong {
    font-size: 15px;
    font-weight: 700;
  }

  .top-rated em {
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 22px;
    font-style: normal;
    line-height: 1;
  }

  .roster {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    margin-top: 14px;
  }

  .roster-head,
  .roster-row {
    display: grid;
    grid-template-columns: 62px minmax(0, 1fr) 78px 58px;
    align-items: center;
    gap: 16px;
  }

  .roster-head {
    padding-bottom: 8px;
    border-bottom: 1px solid rgb(255 255 255 / 0.14);
    color: #949494;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
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

  .shirt {
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
    border: 2px solid;
    border-radius: 11px;
    font-family: var(--font-display);
    font-size: 21px;
    line-height: 1;
  }

  .name {
    overflow: hidden;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 0.2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: right;
  }

  .rating {
    display: grid;
    width: 50px;
    height: 34px;
    place-items: center;
    justify-self: end;
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 8px;
    font-family: var(--font-display);
    font-size: 21px;
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
    padding-top: 16px;
    border-top: 1px solid rgb(255 255 255 / 0.12);
    font-family: var(--font-mono);
    font-size: 16px;
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
