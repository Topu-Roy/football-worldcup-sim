import type { AggregateStats, MatchRound, Tournament } from "./types.js";

export function aggregateStats(state: Tournament): AggregateStats {
  const stats: AggregateStats = {
    matches: [],
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    points: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    cleanSheets: 0,
    penaltyWins: 0,
    biggestWin: 0,
    biggestLoss: 0,
    avgGoalsFor: 0,
  };

  const roundLabel = (r: MatchRound): string =>
    r === "group" ? "Group stage" : r === "sf" ? "Semi-final" : "Final";

  for (const m of state.matches.filter((x) => x.isUser && x.result)) {
    const opp =
      m.home === state.userSquad.id
        ? state.squads[m.away]
        : state.squads[m.home];
    const userHome = m.home === state.userSquad.id;
    const gf = userHome ? m.result!.score[0] : m.result!.score[1];
    const ga = userHome ? m.result!.score[1] : m.result!.score[0];
    const outcome: "W" | "D" | "L" =
      m.result!.winner === null
        ? "D"
        : m.result!.winner === (userHome ? 0 : 1)
          ? "W"
          : "L";

    stats.matches.push({
      id: m.id,
      roundLabel: roundLabel(m.round),
      opponentId: opp.id,
      opponentName: opp.name,
      opponentNation: opp.nation,
      opponentYear: opp.wcYear,
      result: m.result!,
      outcome,
    });

    stats.played++;
    stats.gf += gf;
    stats.ga += ga;
    if (outcome === "W") {
      stats.won++;
      stats.points += 3;
      stats.biggestWin = Math.max(stats.biggestWin, gf - ga);
    } else if (outcome === "D") {
      stats.drawn++;
      stats.points += 1;
    } else {
      stats.lost++;
      stats.biggestLoss = Math.max(stats.biggestLoss, ga - gf);
    }
    if (ga === 0) stats.cleanSheets++;
    if (m.result!.penalties && outcome === "W") stats.penaltyWins++;
  }

  stats.gd = stats.gf - stats.ga;
  stats.avgGoalsFor = stats.played > 0 ? stats.gf / stats.played : 0;
  return stats;
}
