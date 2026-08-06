<script lang="ts">
  import {
    ROLE_LABELS,
    assignedRole,
    assignSlots,
    outOfPosition,
    playerRating,
    rolesForDepartment,
    slotDepartment,
  } from "../lib/draft.js";
  import type { Player } from "../lib/types.js";

  let {
    players,
    formationKey,
    onAssignRole,
    size = "md",
  }: {
    players: Player[];
    formationKey: string;
    onAssignRole?: (playerId: string, role: string) => void;
    size?: "sm" | "md";
  } = $props();

  const slots = $derived(assignSlots(players, formationKey));
  const widthClass = $derived(size === "sm" ? "max-w-64" : "max-w-md");
</script>

<div class="relative mx-auto aspect-3/4 w-full {widthClass}">
  <svg
    viewBox="0 0 600 800"
    class="absolute inset-0 h-full w-full overflow-hidden rounded-2xl"
    preserveAspectRatio="none"
  >
    <defs>
      <clipPath id="pitch-clip-{formationKey}-{size}">
        <rect x="0" y="0" width="600" height="800" rx="16" ry="16" />
      </clipPath>
    </defs>

    <g clip-path="url(#pitch-clip-{formationKey}-{size})">
      <rect x="0" y="0" width="600" height="800" fill="#207238" />

      <g fill="#278140">
        <rect x="0" y="0" width="600" height="53.33" />
        <rect x="0" y="106.66" width="600" height="53.33" />
        <rect x="0" y="213.33" width="600" height="53.33" />
        <rect x="0" y="320" width="600" height="53.33" />
        <rect x="0" y="426.66" width="600" height="53.33" />
        <rect x="0" y="533.33" width="600" height="53.33" />
        <rect x="0" y="640" width="600" height="53.33" />
        <rect x="0" y="746.66" width="600" height="53.33" />
      </g>

      <rect
        x="25"
        y="25"
        width="550"
        height="750"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <line
        x1="25"
        y1="400"
        x2="575"
        y2="400"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle
        cx="300"
        cy="400"
        r="85"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="400" r="4" fill="#7cb68d" />

      <rect
        x="130"
        y="25"
        width="340"
        height="135"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="225"
        y="25"
        width="150"
        height="45"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="250"
        y="10"
        width="100"
        height="15"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="115" r="4" fill="#7cb68d" />
      <path
        d="M 235 160 A 85 85 0 0 0 365 160"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />

      <rect
        x="130"
        y="640"
        width="340"
        height="135"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="225"
        y="730"
        width="150"
        height="45"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <rect
        x="250"
        y="775"
        width="100"
        height="15"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <circle cx="300" cy="685" r="4" fill="#7cb68d" />
      <path
        d="M 235 640 A 85 85 0 0 1 365 640"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />

      <path
        d="M 25 40 A 15 15 0 0 0 40 25"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 560 25 A 15 15 0 0 0 575 40"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 25 760 A 15 15 0 0 0 40 775"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
      <path
        d="M 560 775 A 15 15 0 0 0 575 760"
        fill="none"
        stroke="#7cb68d"
        stroke-width="3"
      />
    </g>
  </svg>

  {#each slots as s, i (i)}
    {#if s.player}
      <div
        class="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
        style:left={`${s.slot.x}%`}
        style:top={`${s.slot.y}%`}
      >
        <div
          class="inline-flex max-w-28 items-center gap-1 rounded-full border bg-black/75 px-2 py-0.5 {outOfPosition(
            s.player,
          )
            ? 'border-red-500/70'
            : 'border-white/20'}"
        >
          <span class="min-w-0 truncate text-[10px] leading-none font-bold">
            {s.player.name}
          </span>
          <span class="shrink-0 font-mono text-[10px] leading-none text-mint">
            {playerRating(s.player)}
          </span>
        </div>
        {#if onAssignRole}
          <div class="mt-1 flex justify-center">
            <select
              class="rounded bg-black/80 px-1 py-0.5 font-mono text-[9px] text-white"
              value={assignedRole(s.player)}
              onchange={(e) =>
                s.player && onAssignRole(s.player.id, e.currentTarget.value)}
            >
              {#each rolesForDepartment(slotDepartment(s.player)) as role (role)}
                <option value={role}>{ROLE_LABELS[role]}</option>
              {/each}
            </select>
          </div>
        {:else}
          <p class="mt-0.5 font-mono text-[8px] leading-none text-white/45">
            {ROLE_LABELS[s.slot.role]}
          </p>
        {/if}
      </div>
    {:else}
      <div
        class="absolute -translate-x-1/2 -translate-y-1/2"
        style:left={`${s.slot.x}%`}
        style:top={`${s.slot.y}%`}
      >
        <div
          class="h-4 w-4 rounded-full border border-dashed border-white/40 opacity-40"
        ></div>
      </div>
    {/if}
  {/each}
</div>
