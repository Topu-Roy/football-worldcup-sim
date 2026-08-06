<script lang="ts">
  import {
    NATION_NAMES,
    POSITION_LABEL,
    ROLE_LABELS,
    assignedRole,
    outOfPosition,
    playerRating,
    positionColor,
    rolesForDepartment,
    slotDepartment,
  } from "../lib/draft.js";
  import { chemistryBonus, countSameNation } from "../lib/team.js";
  import type { Formation, Position, Squad } from "../lib/types.js";

  let {
    formation,
    formationKey,
    squad,
    onStart,
    onReset,
    onAssignRole,
  }: {
    formation: Formation;
    formationKey: string;
    squad: Squad;
    onStart: () => void;
    onReset: () => void;
    onAssignRole: (playerId: string, role: string) => void;
  } = $props();

  const drafted = $derived(squad.players);
  const positionOrder: Position[] = ["GK", "ATT", "MID", "DEF"];
  const sameNation = $derived(countSameNation(drafted));
  const chemistry = $derived(chemistryBonus(drafted, false));

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
  const pillOutline =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-mint border border-mint rounded-full px-6 py-3 bg-transparent transition-all duration-150 hover:bg-mint hover:text-black";
  const pillOutlineAlt =
    "font-mono text-xs font-semibold tracking-[1.5px] uppercase text-secondary border border-secondary rounded-full px-6 py-3 bg-transparent transition-all duration-150 hover:bg-secondary hover:text-black";
</script>

<section class="mx-auto max-w-3xl px-6 py-12">
  <p class="{mono} text-mint">Team complete</p>
  <h2 class="font-display text-5xl leading-[0.85] tracking-[1px]">
    {formationKey}
    <span class="text-secondary">· {drafted.length} players</span>
  </h2>

  <div class="mt-8 grid gap-4 lg:grid-cols-2">
    {#each positionOrder as pos (pos)}
      <div class="rounded-3xl border border-white/15 bg-slate/30 p-5">
        <p class="{mono} text-[10px]" style:color={positionColor(pos)}>
          {POSITION_LABEL[pos]}
          <span class="text-secondary">({formation[pos]})</span>
        </p>
        <div class="mt-3 space-y-1.5">
          {#each Array(formation[pos]) as _, i (pos + i)}
            {@const p = drafted.filter((x) => slotDepartment(x) === pos)[i]}
            <div
              class="flex items-center justify-between gap-2 rounded-full border px-3 py-1.5"
              style:border-color={positionColor(pos)}
            >
              <span class="text-sm font-bold">
                {p?.name ?? "Empty"}{p ? ` (${playerRating(p)})` : ""}
              </span>
              {#if p}
                <div class="flex items-center gap-2">
                  {#if outOfPosition(p)}
                    <span
                      class="rounded-full bg-red-500/15 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[1px] text-red-400 uppercase"
                      >OUT −5–10%</span
                    >
                  {/if}
                  {#if pos === "GK"}
                    <span class="font-mono text-[10px] text-secondary">
                      {ROLE_LABELS[assignedRole(p)]}
                    </span>
                  {:else}
                    <select
                      class="rounded-full bg-slate px-2 py-1 font-mono text-[10px] text-white"
                      value={assignedRole(p)}
                      onchange={(e) =>
                        onAssignRole(p.id, e.currentTarget.value)}
                    >
                      {#each rolesForDepartment(slotDepartment(p)) as role (role)}
                        <option value={role}>{ROLE_LABELS[role]}</option>
                      {/each}
                    </select>
                  {/if}
                  <span class="font-mono text-[10px] text-secondary">
                    {NATION_NAMES[p.nation] ?? p.nation}
                    {p.wcYear}
                  </span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-8 grid grid-cols-3 gap-4 text-center">
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">PLAYERS</p>
      <p class="mt-1 font-display text-3xl">{drafted.length}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-slate/20 px-4 py-3">
      <p class="{mono} text-[10px] text-secondary">SAME NATION</p>
      <p class="mt-1 font-display text-3xl">{sameNation}</p>
    </div>
    <div class="rounded-2xl border border-mint bg-mint/10 px-4 py-3">
      <p class="{mono} text-[10px] text-mint">CHEMISTRY</p>
      <p class="mt-1 font-display text-3xl text-mint">
        +{Math.round(chemistry * 100)}%
      </p>
    </div>
  </div>

  <div class="mt-10 flex flex-wrap justify-center gap-4">
    <button type="button" class="{pillOutline}" onclick={onStart}
      >Start tournament</button
    >
    <button type="button" class="{pillOutlineAlt}" onclick={onReset}
      >Start over</button
    >
  </div>
</section>
