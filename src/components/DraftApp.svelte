<script lang="ts">
  import FormationPicker from './FormationPicker.svelte';
  import DraftBoard from './DraftBoard.svelte';
  import MatchView from './MatchView.svelte';
  import { buildUserSquad } from '../lib/draft.js';
  import type { Formation, Player, Squad } from '../lib/types.js';

  type Step = 'setup' | 'draft' | 'match';

  let step = $state<Step>('setup');
  let formation = $state<Formation | null>(null);
  let formationKey = $state('');
  let drafted = $state<Player[]>([]);
  let squad = $state<Squad | null>(null);
  let rerollsUsed = $state(0);

  function selectFormation(key: string, f: Formation) {
    formation = f;
    formationKey = key;
    step = 'draft';
  }

  function reset() {
    drafted = [];
    rerollsUsed = 0;
    squad = null;
    step = 'setup';
  }

  function handlePick(p: Player) {
    drafted = [...drafted, p];
  }

  function handleReroll(n: number) {
    rerollsUsed += n;
  }

  $effect(() => {
    if (formation && drafted.length === 11) {
      squad = buildUserSquad(formation, drafted);
      step = 'match';
    }
  });
</script>

<main class="min-h-screen bg-canvas text-white">
  {#if step === 'setup'}
    <FormationPicker onSelect={selectFormation} />
  {:else if step === 'draft' && formation}
    <DraftBoard
      formation={formation}
      formationKey={formationKey}
      onPick={handlePick}
      onRerollUsed={handleReroll}
    />
  {:else if step === 'match' && squad}
    <MatchView userSquad={squad} onReset={reset} />
  {/if}
</main>
