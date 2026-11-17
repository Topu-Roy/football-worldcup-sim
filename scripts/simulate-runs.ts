import {
  buildUserSquad,
  canPlayRole,
  makeOffer,
  pitchSlots,
  roleRating,
  type Offer,
} from "../src/lib/draft/index.js";
import { simulateMatchScript } from "../src/lib/match/script.js";
import { FORMATIONS, type Player } from "../src/lib/types.js";
import {
  advanceToKnockout,
  createTournament,
  groupDone,
  matchTeams,
  nextUserMatch,
  registerUserResult,
  resolveKnockout,
  standingsFor,
  type MatchRound,
} from "../src/lib/tournament/index.js";
import type { TournamentOutcome } from "../src/lib/tournament/types.js";

const runs = Number(process.argv[2] ?? 1000);
const formationKeys = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1"] as const;

interface CandidatePair {
  player: Player;
  role: string;
  slotIndex: number;
}

const outcomeDisplayOrder: TournamentOutcome[] = [
  "champion",
  "runners-up",
  "semi-final-exit",
  "quarter-final-exit",
  "round-of-16-exit",
  "eliminated",
];

const roundNames: Exclude<MatchRound, "group">[] = ["r16", "qf", "sf", "final"];

function placeablePairs(
  offer: Offer,
  drafted: Player[],
  formationKey: string,
): CandidatePair[] {
  const draftedNames = new Set(drafted.map((player) => player.name));
  return pitchSlots(formationKey).flatMap((slot, slotIndex) => {
    if (drafted.some((player) => player.assignedSlot === slotIndex)) return [];
    return offer.players
      .filter(
        (player) =>
          !draftedNames.has(player.name) && canPlayRole(player, slot.role),
      )
      .map((player) => ({ player, role: slot.role, slotIndex }));
  });
}

function autoDraft(formationKey: (typeof formationKeys)[number]) {
  const formation = FORMATIONS[formationKey];
  const history = [makeOffer(formationKey, formation, [])];
  let offer = history[0];
  const drafted: Player[] = [];

  while (drafted.length < 11) {
    let pairs = placeablePairs(offer, drafted, formationKey);
    let guard = 0;
    while (pairs.length === 0 && guard < 100) {
      offer = makeOffer(formationKey, formation, drafted, history);
      history.push(offer);
      pairs = placeablePairs(offer, drafted, formationKey);
      guard++;
    }
    if (pairs.length === 0) {
      throw new Error(
        `Could not fill a slot for ${formationKey} after 100 offers`,
      );
    }

    const best = pairs.reduce((current, candidate) =>
      roleRating(candidate.player, candidate.role) >
      roleRating(current.player, current.role)
        ? candidate
        : current,
    );
    drafted.push({
      ...best.player,
      assignedPosition: best.role,
      assignedSlot: best.slotIndex,
    });

    if (drafted.length < 11) {
      offer = makeOffer(formationKey, formation, drafted, history);
      history.push(offer);
    }
  }

  return buildUserSquad(formation, drafted);
}

function runTournament(squad: ReturnType<typeof autoDraft>) {
  const state = createTournament(squad);
  const roundCounts: Record<
    Exclude<MatchRound, "group">,
    { played: number; won: number }
  > = {
    r16: { played: 0, won: 0 },
    qf: { played: 0, won: 0 },
    sf: { played: 0, won: 0 },
    final: { played: 0, won: 0 },
  };
  let qualified = false;

  while (state.phase !== "ended") {
    const match = nextUserMatch(state);
    if (!match) {
      if (groupDone(state)) {
        const userRank = standingsFor(state).findIndex(
          (standing) => standing.squadId === state.userSquad.id,
        );
        qualified = userRank < 2;
        advanceToKnockout(state);
      } else {
        throw new Error(`No pending user match during ${state.phase} phase`);
      }
      continue;
    }

    const teams = matchTeams(state, match);
    const user = teams.home.id === state.userSquad.id ? teams.home : teams.away;
    const opponent =
      teams.home.id === state.userSquad.id ? teams.away : teams.home;
    const script = simulateMatchScript(user, opponent, {
      regulationOnly: match.round === "group",
    });
    registerUserResult(state, match.id, script.result, script);

    if (match.round !== "group") {
      roundCounts[match.round].played++;
      const recordedMatch = state.matches.find((item) => item.id === match.id)!;
      const userIndex = recordedMatch.home === state.userSquad.id ? 0 : 1;
      if (recordedMatch.result?.winner === userIndex) {
        roundCounts[match.round].won++;
      }
    }

    if (state.phase === "knockout") {
      resolveKnockout(state);
    } else if (groupDone(state)) {
      const userRank = standingsFor(state).findIndex(
        (standing) => standing.squadId === state.userSquad.id,
      );
      qualified = userRank < 2;
      advanceToKnockout(state);
    }
  }

  if (state.outcome === undefined) {
    throw new Error("Tournament ended without an outcome");
  }

  return {
    outcome: state.outcome,
    qualified,
    roundCounts,
  };
}

const outcomes: Record<TournamentOutcome, number> = {
  champion: 0,
  "runners-up": 0,
  "semi-final-exit": 0,
  "quarter-final-exit": 0,
  "round-of-16-exit": 0,
  eliminated: 0,
};
let groupQualifiers = 0;
const knockoutCounts: Record<
  Exclude<MatchRound, "group">,
  { played: number; won: number }
> = {
  r16: { played: 0, won: 0 },
  qf: { played: 0, won: 0 },
  sf: { played: 0, won: 0 },
  final: { played: 0, won: 0 },
};
const formationCounts = Object.fromEntries(
  formationKeys.map((key) => [key, { played: 0, champions: 0 }]),
) as Record<
  (typeof formationKeys)[number],
  { played: number; champions: number }
>;

for (let i = 0; i < runs; i++) {
  const formationKey = formationKeys[i % formationKeys.length];
  const result = runTournament(autoDraft(formationKey));
  outcomes[result.outcome]++;
  if (result.qualified) groupQualifiers++;
  formationCounts[formationKey].played++;
  if (result.outcome === "champion") formationCounts[formationKey].champions++;
  for (const round of roundNames) {
    knockoutCounts[round].played += result.roundCounts[round].played;
    knockoutCounts[round].won += result.roundCounts[round].won;
  }
}

const percentage = (count: number, total: number) =>
  `${((count / total) * 100).toFixed(1)}%`;

console.log(`\n=== Balance report: ${runs} runs ===`);
console.log("Outcomes:");
for (const outcome of outcomeDisplayOrder) {
  console.log(
    `  ${outcome}: ${outcomes[outcome]} (${percentage(outcomes[outcome], runs)})`,
  );
}
console.log(
  `Group qualify: ${groupQualifiers}/${runs} (${percentage(groupQualifiers, runs)})`,
);
console.log("Knockout win rates (wins / played):");
for (const round of roundNames) {
  const { played, won } = knockoutCounts[round];
  console.log(
    `  ${round}: ${won}/${played} (${played ? percentage(won, played) : "n/a"})`,
  );
}
console.log("Champion rate by formation:");
for (const key of formationKeys) {
  const { played, champions } = formationCounts[key];
  console.log(
    `  ${key}: ${champions}/${played} (${played ? percentage(champions, played) : "n/a"})`,
  );
}
