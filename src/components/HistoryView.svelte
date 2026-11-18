<script lang="ts">
  import { ChevronDown, ChevronUp, Clock, Trash2 } from "@lucide/svelte";
  import { confirmAction } from "../lib/confirmDialog.js";
  import {
    clearHistory,
    loadHistory,
    type HistoryRecord,
  } from "../lib/history.js";
  // Import the rating helper directly so this page does not pull the whole
  // draft pool (and every squad) into its client bundle.
  import { playerRating } from "../lib/draft/rating.js";
  import { outcomeColor, outcomeLabel } from "../lib/outcome.js";
  import type { TournamentOutcome } from "../lib/tournament.js";

  const formationLabel = (f: HistoryRecord["formation"]) =>
    [
      ["GK", f.GK],
      ["DEF", f.DEF],
      ["MID", f.MID],
      ["ATT", f.ATT],
    ]
      .map(([k, n]) => `${n} ${k}`)
      .join(" · ");

  /** Compact badge text so the header stays one line on small screens. */
  const outcomeShort = (o: TournamentOutcome | null): string =>
    o === "champion"
      ? "Winner"
      : o === "runners-up"
        ? "2nd"
        : o === "semi-final-exit"
          ? "SF"
          : o === "quarter-final-exit"
            ? "QF"
            : o === "round-of-16-exit"
              ? "R16"
              : o === "eliminated"
                ? "Elim."
                : "Incomplete";

  /** Full label for tooltips on the compact badge. */
  const outcomeFull = (o: TournamentOutcome | null): string =>
    o === "champion"
      ? "Champion"
      : o === "runners-up"
        ? "Runners-up"
        : o === "semi-final-exit"
          ? "Eliminated in the semi-final"
          : o === "quarter-final-exit"
            ? "Eliminated in the quarter-final"
            : o === "round-of-16-exit"
              ? "Eliminated in the round of 16"
              : o === "eliminated"
                ? "Eliminated in the group stage"
                : "Run not finished — cannot be resumed";

  const outcomeTone = (o: TournamentOutcome | null): string =>
    o === "champion"
      ? "var(--color-mint)"
      : o === "runners-up"
        ? "var(--color-yellow)"
        : o === "eliminated"
          ? "var(--color-pink)"
          : "var(--color-secondary)";

  const mono = "font-mono font-semibold uppercase tracking-[1.5px]";

  let records = $state<HistoryRecord[]>([]);
  let expandedId = $state<string | null>(null);

  function refresh() {
    records = loadHistory().sort((a, b) => b.playedAt - a.playedAt);
  }

  function toggle(id: string) {
    expandedId = expandedId === id ? null : id;
  }

  async function handleClear() {
    const ok = await confirmAction({
      title: "Clear all history?",
      message: "Every saved run is removed from this device.",
      confirmLabel: "Clear history",
      danger: true,
    });
    if (!ok) return;
    clearHistory();
    expandedId = null;
    refresh();
  }

  /** Browser-history-style date: Today / Yesterday / N days ago / full date. */
  function relativeDate(ts: number): string {
    const d = new Date(ts);
    const today = new Date();
    const day = (x: Date) =>
      new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = Math.round((day(today) - day(d)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function time(ts: number): string {
    return new Date(ts).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function sortedPlayers(r: HistoryRecord) {
    return [...r.squad.players].sort(
      (a, b) => playerRating(b) - playerRating(a),
    );
  }

  refresh();
</script>

<section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
  <header>
    <p class="{mono} text-[10px] text-mint sm:text-[11px]">Match history</p>
    <h2
      class="mt-2 font-display text-3xl leading-[0.95] tracking-[1px] sm:mt-3 sm:text-5xl"
    >
      Your World Cup runs
    </h2>
    <p class="mt-2 max-w-md text-sm text-secondary sm:mt-3">
      One entry per tournament, saved by date — expand a run to see your team
      and every result.
    </p>
    {#if records.length > 0}
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] font-semibold tracking-[1.5px] text-secondary uppercase transition-colors duration-150 hover:border-pink hover:text-pink"
        onclick={handleClear}
      >
        <Trash2 class="h-3.5 w-3.5" /> Clear history
      </button>
    {/if}
  </header>

  {#if records.length === 0}
    <div
      class="mt-10 rounded-3xl border border-white/10 bg-slate/20 px-5 py-14 text-center sm:mt-12 sm:px-6 sm:py-16"
    >
      <p class="font-display text-xl tracking-[0.5px] sm:text-2xl">
        No tournaments played yet
      </p>
      <p class="mx-auto mt-3 max-w-sm text-sm text-secondary">
        Finish a match in the simulator and its run will show up here — your
        team and every result get stored on this device, one entry per
        tournament.
      </p>
      <a
        href="/game/"
        class="mt-6 inline-flex items-center rounded-full bg-mint px-6 py-3 font-mono text-[11px] font-semibold tracking-[1.8px] text-black uppercase transition-colors duration-150 hover:bg-white"
      >
        Play a match
      </a>
    </div>
  {:else}
    <ul class="mt-8 space-y-3 sm:mt-10">
      {#each records as r (r.id)}
        <li
          class="overflow-hidden rounded-2xl border border-white/10 bg-slate/20"
        >
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-slate/30 sm:px-5 sm:py-4"
            aria-expanded={expandedId === r.id}
            onclick={() => toggle(r.id)}
          >
            <span class="min-w-0 flex-1">
              <span
                class="block truncate font-display text-lg leading-tight tracking-[0.5px]"
              >
                {r.squadName}
              </span>
              <span
                class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] font-semibold tracking-[1.5px] text-secondary uppercase sm:text-[10px]"
              >
                <span class="inline-flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {relativeDate(r.playedAt)} · {time(r.playedAt)}
                </span>
                <span class="text-white/25">•</span>
                <span>{r.stats.played} played</span>
                <span class="text-white/25">•</span>
                <span class="text-mint">{r.stats.won}W</span>
                <span class="text-secondary">{r.stats.drawn}D</span>
                <span class="text-pink">{r.stats.lost}L</span>
              </span>
            </span>
            <span class="flex shrink-0 items-center gap-2">
              <span
                class="rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[1.5px] uppercase"
                style:color={outcomeTone(r.outcome)}
                style:border-color={outcomeTone(r.outcome)}
                title={outcomeFull(r.outcome)}
              >
                {outcomeShort(r.outcome)}
              </span>
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-secondary"
              >
                {#if expandedId === r.id}
                  <ChevronUp class="h-4 w-4" />
                {:else}
                  <ChevronDown class="h-4 w-4" />
                {/if}
              </span>
            </span>
          </button>

          {#if expandedId === r.id}
            <div class="border-t border-white/10 px-4 pt-4 pb-6 sm:px-5">
              <div class="grid gap-6 md:grid-cols-2 md:gap-5">
                <div>
                  <p class="{mono} text-[10px] text-mint">
                    Your team · {formationLabel(r.formation)}
                  </p>
                  <ul
                    class="mt-3 overflow-hidden rounded-xl border border-white/10"
                  >
                    {#each sortedPlayers(r) as p, i (p.id)}
                      <li
                        class="flex items-center gap-3 border-t border-white/10 px-3 py-2 first:border-t-0 {i %
                        2
                          ? 'bg-slate/40'
                          : ''}"
                      >
                        <span
                          class="w-6 shrink-0 font-mono text-[10px] font-semibold text-secondary"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="block truncate text-sm font-semibold"
                            >{p.name}</span
                          >
                          <span
                            class="block font-mono text-[9px] font-semibold tracking-[1.5px] text-secondary uppercase"
                          >
                            {p.bestPosition}
                          </span>
                        </span>
                        <span class="shrink-0 font-display text-sm text-mint">
                          {playerRating(p)}
                        </span>
                      </li>
                    {/each}
                  </ul>
                </div>

                <div>
                  <p class="{mono} text-[10px] text-mint">Tournament results</p>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    <div
                      class="rounded-xl border border-white/10 bg-slate/40 px-1 py-2.5 text-center"
                    >
                      <p class="font-display text-lg text-mint">{r.stats.gf}</p>
                      <p
                        class="font-mono text-[10px] font-semibold tracking-[1px] text-secondary uppercase"
                      >
                        GF
                      </p>
                    </div>
                    <div
                      class="rounded-xl border border-white/10 bg-slate/40 px-1 py-2.5 text-center"
                    >
                      <p class="font-display text-lg text-white">
                        {r.stats.ga}
                      </p>
                      <p
                        class="font-mono text-[10px] font-semibold tracking-[1px] text-secondary uppercase"
                      >
                        GA
                      </p>
                    </div>
                    <div
                      class="rounded-xl border border-white/10 bg-slate/40 px-1 py-2.5 text-center"
                    >
                      <p class="font-display text-lg text-yellow">
                        {r.stats.points}
                      </p>
                      <p
                        class="font-mono text-[10px] font-semibold tracking-[1px] text-secondary uppercase"
                      >
                        PTS
                      </p>
                    </div>
                    <div
                      class="rounded-xl border border-white/10 bg-slate/40 px-1 py-2.5 text-center"
                    >
                      <p class="font-display text-lg text-secondary">
                        {r.stats.gd > 0 ? "+" : ""}{r.stats.gd}
                      </p>
                      <p
                        class="font-mono text-[10px] font-semibold tracking-[1px] text-secondary uppercase"
                      >
                        GD
                      </p>
                    </div>
                  </div>

                  <ul
                    class="mt-3 overflow-hidden rounded-xl border border-white/10"
                  >
                    {#each r.matches as m, i (i)}
                      <li
                        class="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2.5 first:border-t-0"
                      >
                        <span class="flex min-w-0 items-center gap-2.5">
                          <span
                            class="inline-flex w-8 shrink-0 items-center justify-center rounded-full border border-white/15 py-0.5 font-mono text-[10px] font-semibold tracking-[1px] uppercase"
                            style:color={outcomeColor(m.outcome)}
                            style:border-color={outcomeColor(m.outcome)}
                          >
                            {outcomeLabel(m.outcome)}
                          </span>
                          <span class="min-w-0">
                            <span class="block truncate text-sm font-semibold">
                              vs. {m.opponent.name}{m.penalties ? " (P)" : ""}
                            </span>
                            <span
                              class="block font-mono text-[9px] font-semibold tracking-[1.5px] text-secondary uppercase"
                            >
                              {m.roundLabel}
                            </span>
                          </span>
                        </span>
                        <span
                          class="shrink-0 font-mono text-base font-bold tracking-tight text-white"
                        >
                          {m.score[0]}<span class="text-secondary">–</span>{m
                            .score[1]}
                        </span>
                      </li>
                    {/each}
                  </ul>

                  <p
                    class="mt-3 font-mono text-[9px] leading-relaxed font-semibold tracking-[1.5px] text-secondary uppercase sm:text-[10px]"
                  >
                    <span class="text-mint">{r.stats.cleanSheets}</span> clean
                    sheets ·
                    <span class="text-yellow">{r.stats.penaltyWins}</span>
                    penalty wins ·
                    {#if r.stats.biggestWin > 0}<span class="text-mint"
                        >win by {r.stats.biggestWin}</span
                      >{:else}<span>no win</span>{/if} ·
                    {#if r.stats.biggestLoss > 0}<span class="text-pink"
                        >lost by {r.stats.biggestLoss}</span
                      >{/if}
                  </p>
                </div>
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>
