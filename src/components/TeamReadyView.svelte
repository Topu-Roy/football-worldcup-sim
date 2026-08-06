<script lang="ts">
  import { chemistryBonus, countSameNation } from "../lib/team.js";
  import type { Squad } from "../lib/types.js";
  import PitchView from "./PitchView.svelte";

  let {
    formationKey,
    squad,
    onStart,
    onReset,
    onAssignRole,
  }: {
    formationKey: string;
    squad: Squad;
    onStart: () => void;
    onReset: () => void;
    onAssignRole: (playerId: string, role: string) => void;
  } = $props();

  const drafted = $derived(squad.players);
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

  <div class="mt-8">
    <PitchView players={drafted} {formationKey} {onAssignRole} />
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
    <button type="button" class={pillOutline} onclick={onStart}
      >Start tournament</button
    >
    <button type="button" class={pillOutlineAlt} onclick={onReset}
      >Start over</button
    >
  </div>
</section>
