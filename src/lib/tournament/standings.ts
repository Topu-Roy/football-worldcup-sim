import type { Squad } from "../types.js";
import type { GroupStanding, Tournament, TournamentMatch } from "./types.js";

function standingsForGroup(
  matches: TournamentMatch[],
  teams: string[],
  squads: Record<string, Squad>,
): GroupStanding[] {
  const base: GroupStanding = {
    squadId: "",
    name: "",
    nation: "",
    wcYear: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  };
  const table = new Map<string, GroupStanding>();
  for (const id of teams) {
    const s = squads[id];
    table.set(id, {
      ...base,
      squadId: id,
      name: s.name,
      nation: s.nation,
      wcYear: s.wcYear,
    });
  }

  const groupMatches = matches.filter(
    (m) =>
      m.round === "group" && teams.includes(m.home) && teams.includes(m.away),
  );
  for (const m of groupMatches) {
    if (!m.result) continue;
    const home = table.get(m.home)!;
    const away = table.get(m.away)!;
    const [hg, ag] = m.result.score;
    home.played++;
    away.played++;
    home.gf += hg;
    home.ga += ag;
    away.gf += ag;
    away.ga += hg;
    if (m.result.winner === 0) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (m.result.winner === 1) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }
  for (const s of table.values()) {
    s.gd = s.gf - s.ga;
  }

  return [...table.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });
}

/** Full group standings computed from played matches, sorted by points → GD → GF → name. */
export function standingsFor(state: Tournament): GroupStanding[] {
  return standingsForGroup(state.matches, state.group, state.squads);
}
