import type { Squad } from "../types.js";
import { simulateMatch } from "../matchEngine.js";
import { drawStrong, drawWeak } from "./matchmaking.js";
import type { Tournament, TournamentMatch } from "./types.js";

function roundRobinPairs(teams: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push([teams[i], teams[j]]);
    }
  }
  return pairs;
}

/** Build a new tournament: draw 2 weak + 1 historical group opponent, pre-simulate all non-user group matches. */
export function createTournament(userSquad: Squad): Tournament {
  const weak = drawWeak(2);
  const strong = drawStrong(1);
  const group = [
    userSquad.id,
    ...weak.map((s) => s.id),
    ...strong.map((s) => s.id),
  ];

  const squads: Record<string, Squad> = { [userSquad.id]: userSquad };
  for (const s of weak) squads[s.id] = s;
  for (const s of strong) squads[s.id] = s;

  const matches: TournamentMatch[] = [];
  for (const [home, away] of roundRobinPairs(group)) {
    const isUser = home === userSquad.id;
    matches.push({
      id: `G-${home}-${away}`,
      round: "group",
      home,
      away,
      result: isUser
        ? null
        : simulateMatch(squads[home], squads[away], { regulationOnly: true }),
      isUser,
    });
  }

  return {
    phase: "group",
    userSquad,
    squads,
    group,
    matches,
  };
}
