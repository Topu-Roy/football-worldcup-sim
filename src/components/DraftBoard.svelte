<script lang="ts">
  import {
    MAX_REROLLS,
    NATION_NAMES,
    POSITION_LABEL,
    draftableNations,
    fits,
    makeOffer,
    nationYears,
    newNationReroll,
    playerRating,
    positionColor,
    sameNationReroll,
    slotDepartment,
    slotsLeft,
    squadOf,
    validateDraft,
  } from "../lib/draft.js";
  import { countSameNation, chemistryBonus } from "../lib/team.js";
  import type { Formation, Player, Position } from "../lib/types.js";

  let {
    formation,
    formationKey,
    onPick,
  }: {
    formation: Formation;
    formationKey: string;
    onPick: (p: Player) => void;
  } = $props();

  let offer = $state<ReturnType<typeof makeOffer> | null>(null);
  let offerHistory: ReturnType<typeof makeOffer>[] = $state([]);
  let rerollsLeft = $state(MAX_REROLLS);
  let drafted = $state<Player[]>([]);

  $effect(() => {
    if (!offer) {
      const first = makeOffer(formation, drafted);
      offer = first;
      offerHistory = [first];
    }
  });

  const left = $derived(slotsLeft(formation, drafted));
  const positionOrder: Position[] = ["GK", "ATT", "MID", "DEF"];
  const round = $derived(drafted.length + 1);
  const complete = $derived(validateDraft(formation, drafted));
  const sameNation = $derived(countSameNation(drafted));
  const chemistry = $derived(chemistryBonus(drafted, false));
  const offerPlayers = $derived(
    [...(offer?.players ?? [])].sort(
      (a, b) =>
        positionOrder.indexOf(slotDepartment(a)) -
        positionOrder.indexOf(slotDepartment(b)),
    ),
  );

  const canSameNation = $derived(
    !!offer &&
      nationYears(offer.nation).some(
        (y) =>
          y !== offer.year &&
          !offerHistory.some(
            (o) => o.nation === offer.nation && o.year === y,
          ) &&
          squadOf(offer.nation, y).some((p) => fits(p, left)),
      ),
  );

  const canNewNation = $derived(
    !!offer &&
      draftableNations().some(
        (n) =>
          n !== offer.nation &&
          nationYears(n).some((y) =>
            squadOf(n, y).some((p) => fits(p, left)),
          ),
      ),
  );

  function newOffer() {
    const next = makeOffer(formation, drafted, offerHistory);
    offer = next;
    offerHistory = [...offerHistory, next];
  }

  function reroll(kind: "same" | "new") {
    if (rerollsLeft <= 0 || complete || !offer) return;
    const next =
      kind === "same"
        ? sameNationReroll(formation, drafted, offer, offerHistory)
        : newNationReroll(formation, drafted, offer, offerHistory);
    if (!next) return;
    rerollsLeft -= 1;
    offer = next;
    offerHistory = [...offerHistory, next];
  }

  function pick(p: Player) {
    if (complete || left[slotDepartment(p)] <= 0) return;
    const next = [...drafted, p];
    drafted = next;
    onPick(p);
    rerollsLeft = MAX_REROLLS;
    if (!validateDraft(formation, next)) {
      newOffer();
    }
  }

  function statRows(p: Player): [string, number][] {
    const map: Record<Position, [string, keyof Player][]> = {
      GK: [
        ["Reflexes", "reflexes"],
        ["Positioning", "positioning"],
        ["Distribution", "distribution"],
      ],
      DEF: [
        ["Tackling", "tackling"],
        ["Aerial", "aerial"],
        ["Passing", "passing"],
        ["Pace", "pace"],
      ],
      MID: [
        ["Passing", "passing"],
        ["Dribble", "dribble"],
        ["Work Rate", "workRate"],
        ["Stamina", "stamina"],
      ],
      ATT: [
        ["Finishing", "finishing"],
        ["Dribble", "dribble"],
        ["Pace", "pace"],
        ["Off Ball", "offBall"],
      ],
    };
    return (map[slotDepartment(p)] ?? []).map(([label, key]) => [
      label,
      (p[key as keyof Player] as number) ?? 0,
    ]);
  }

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-5 py-2.5 bg-transparent transition-all duration-150 enabled:hover:bg-mint enabled:hover:text-black";
  const playerCard =
    "border border-white/15 rounded-[20px] bg-[#1a1a1a] p-5 transition-all duration-150 enabled:hover:border-mint enabled:hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed";
  const pillTag =
    "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase rounded-full py-1 px-2.5";
</script>

<section class="mx-auto max-w-6xl px-6 py-12">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="{mono} text-mint">Draft Round {round} / 11</p>
      <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
        {formationKey}
        <span class="text-secondary"
          >{sameNation > 1 ? ` · ${sameNation} same nation` : ""}</span
        >
      </h2>
    </div>
    <div class="flex items-center">
      <div class="text-right">
        <p class="{mono} text-secondary">REROLLS LEFT</p>
        <p class="font-display text-3xl">{rerollsLeft}</p>
      </div>
    </div>
  </header>

  <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
    {#if offer}
      <div>
        <div
          class="mb-5 flex items-center justify-between gap-4 font-display text-3xl text-white"
        >
          <span>
            {NATION_NAMES[offer.nation] ?? offer.nation}
            <span class="text-mint">{offer.year}</span>
          </span>
          <div class="flex shrink-0 flex-wrap justify-end gap-2">
            <button
              type="button"
              class="{pillOutline} disabled:opacity-30"
              disabled={!canSameNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("same")}
            >
              Different year
            </button>
            <button
              type="button"
              class="{pillOutline} disabled:opacity-30"
              disabled={!canNewNation || rerollsLeft <= 0 || complete}
              onclick={() => reroll("new")}
            >
              Different nation
            </button>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {#each offerPlayers as p (p.id)}
            <button
              type="button"
              class="{playerCard} text-left"
              disabled={complete || left[slotDepartment(p)] <= 0}
              onclick={() => pick(p)}
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline justify-between gap-2">
                    <p class="min-w-0 flex-1 truncate text-lg font-bold">
                      {p.name}
                    </p>
                    <span
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mint/30 bg-slate font-mono text-xs text-mint"
                      >{playerRating(p)}</span
                    >
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-1">
                    {#each p.positions as role (role)}
                      <span
                        class="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[1px] uppercase {role ===
                        p.bestPosition
                          ? "bg-mint text-black"
                          : "border border-white/15 text-secondary"}"
                      >
                        {role}
                      </span>
                    {/each}
                  </div>
                </div>
                {#if left[slotDepartment(p)] <= 0}
                  <span class="{pillTag} shrink-0 bg-slate text-secondary"
                    >FULL</span
                  >
                {/if}
              </div>
              <dl class="mt-4 space-y-1.5">
                {#each statRows(p) as [label, val] (label)}
                  <div class="flex items-center gap-3">
                    <dt
                      class="{mono} min-w-0 flex-1 truncate leading-none text-[10px] text-secondary"
                    >
                      {label}
                    </dt>
                    <div class="flex shrink-0 items-center gap-2">
                      <div class="h-1 w-24 rounded-full bg-slate">
                        <div
                          class="h-1 rounded-full bg-secondary"
                          style:width={`${val}%`}
                        ></div>
                      </div>
                      <dd class="w-6 text-right font-mono text-xs">{val}</dd>
                    </div>
                  </div>
                {/each}
              </dl>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <aside
      class="h-fit rounded-3xl border border-white/15 bg-slate/30 p-6 lg:sticky lg:top-6"
    >
      <p class="{mono} text-mint">
        Your XI <span class="text-secondary">({drafted.length}/11)</span>
      </p>
      <div class="mt-4 space-y-4">
        {#each positionOrder as pos (pos)}
          <div>
            <p class="{mono} text-[10px]" style:color={positionColor(pos)}>
              {POSITION_LABEL[pos]}
              <span class="text-secondary">
                {formation[pos]}
              </span>
            </p>
            <div class="mt-2 space-y-1.5">
              {#each Array(formation[pos]) as _, i (pos + i)}
                {@const p = drafted.filter((x) => slotDepartment(x) === pos)[i]}
                {#if p}
                  <div
                    class="flex items-center justify-between rounded-full border px-3 py-1.5"
                    style:border-color={positionColor(pos)}
                  >
                    <span class="text-sm">{p.name} ({playerRating(p)})</span>
                    <span class="font-mono text-[10px] text-secondary">
                      {NATION_NAMES[p.nation] ?? p.nation}
                      {p.wcYear}
                    </span>
                  </div>
                {:else}
                  <div
                    class="rounded-full border border-dashed border-white/15 px-3 py-1.5"
                  >
                    <span class="text-sm text-secondary">Empty</span>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/each}
      </div>
      {#if chemistry > 0}
        <div class="mt-6 rounded-full border border-mint px-4 py-2 text-center">
          <span class="{mono} text-[10px] text-mint"
            >CHEMISTRY +{Math.round(chemistry * 100)}%</span
          >
        </div>
      {/if}
    </aside>
  </div>
</section>
