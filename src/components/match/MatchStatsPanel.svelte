<script lang="ts">
  let {
    possession,
    xg,
    shots,
    shotsOnTarget,
  }: {
    possession: [number, number];
    xg: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
  } = $props();

  const mono = "font-mono text-[11px] font-semibold tracking-[1.8px] uppercase";
</script>

<div class="rounded-2xl border border-white/10 bg-slate/20 p-4">
  <p class="{mono} text-[10px] text-secondary">MATCH STATS</p>

  <div class="mt-4">
    <p class="text-center text-sm text-secondary">Ball possession</p>
    <div class="relative mt-2 h-8 overflow-hidden rounded-full bg-white/5">
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-mint/30 transition-all duration-500"
        style:width={`${possession[0] * 100}%`}
      ></div>
      <div class="absolute inset-y-0 left-0 flex w-full items-center px-4">
        <span class="text-sm font-bold text-white"
          >{Math.round(possession[0] * 100)}%</span
        >
        <span class="ml-auto text-sm font-bold text-white/60"
          >{Math.round(possession[1] * 100)}%</span
        >
      </div>
    </div>
    <div
      class="mt-2 flex justify-between font-mono text-[9px] tracking-[1px] text-secondary uppercase"
    >
      <span>You</span>
      <span>Opponent</span>
    </div>
  </div>

  <div class="mt-5 space-y-5">
    <div class="flex items-center gap-4">
      <div class="w-16 shrink-0 text-left">
        <span class="text-xl font-bold text-white">{xg[0].toFixed(2)}</span>
      </div>
      <div class="min-w-0 flex-1 text-center">
        <span class="text-sm text-secondary">Expected goals (xG)</span>
      </div>
      <div class="w-16 shrink-0 text-right">
        <span class="text-xl font-bold text-white">{xg[1].toFixed(2)}</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="w-16 shrink-0 text-left">
        <span class="text-xl font-bold text-white">{shots[0]}</span>
      </div>
      <div class="min-w-0 flex-1 text-center">
        <span class="text-sm text-secondary">Total shots</span>
      </div>
      <div class="w-16 shrink-0 text-right">
        <span class="text-xl font-bold text-white">{shots[1]}</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="w-16 shrink-0 text-left">
        <span class="text-xl font-bold text-white">{shotsOnTarget[0]}</span>
      </div>
      <div class="min-w-0 flex-1 text-center">
        <span class="text-sm text-secondary">Shots on target</span>
      </div>
      <div class="w-16 shrink-0 text-right">
        <span class="text-xl font-bold text-white">{shotsOnTarget[1]}</span>
      </div>
    </div>
  </div>
</div>
