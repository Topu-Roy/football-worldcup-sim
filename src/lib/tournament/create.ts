import type { MatchResult, Squad } from "../types.js";
import { HISTORICAL_SQUADS } from "../../data/historical/index.js";
import { shuffle } from "../random.js";
import { simulateMatch } from "../matchEngine.js";
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

function simResult(
  home: Squad,
  away: Squad,
  regulationOnly = false,
): MatchResult {
  return simulateMatch(home, away, { regulationOnly });
}

export function createTournament(userSquad: Squad): Tournament {
  const pool = HISTORICAL_SQUADS.filter((s) => s.id !== userSquad.id);
  const drawn = shuffle(pool).slice(0, 7);

  const groupA = [userSquad.id, drawn[0].id, drawn[1].id, drawn[2].id];
  const groupB = [drawn[3].id, drawn[4].id, drawn[5].id, drawn[6].id];

  const squads: Record<string, Squad> = { [userSquad.id]: userSquad };
  for (const s of drawn) squads[s.id] = s;

  const matches: TournamentMatch[] = [];
  for (const [home, away] of roundRobinPairs(groupA)) {
    const isUser = home === userSquad.id;
    matches.push({
      id: `A-${home}-${away}`,
      round: "group",
      group: "A",
      home,
      away,
      result: isUser ? null : simResult(squads[home], squads[away], true),
      isUser,
    });
  }
  for (const [home, away] of roundRobinPairs(groupB)) {
    matches.push({
      id: `B-${home}-${away}`,
      round: "group",
      group: "B",
      home,
      away,
      result: simResult(squads[home], squads[away], true),
      isUser: false,
    });
  }

  return {
    phase: "group",
    userSquad,
    squads,
    groups: { A: groupA, B: groupB },
    matches,
  };
}
