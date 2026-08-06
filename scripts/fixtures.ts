import type { Player, Squad } from "../src/lib/types.js";

export const FORMATION = { GK: 1, DEF: 4, MID: 3, ATT: 3 };

export function jitter(strength: number): number {
  return Math.max(
    30,
    Math.min(99, strength + Math.floor(Math.random() * 13) - 6),
  );
}

export function makePlayer(
  id: number,
  position: Player["position"],
  strength: number,
): Player {
  const p: Player = {
    id: `p${id}`,
    name: `P${id}`,
    nation: `N${id % 5}`,
    wcYear: 2022,
    position,
    composure: jitter(strength),
  };
  switch (position) {
    case "GK":
      p.reflexes = jitter(strength);
      p.positioning = jitter(strength);
      p.distribution = jitter(strength);
      break;
    case "DEF":
      p.tackling = jitter(strength);
      p.aerial = jitter(strength);
      p.passing = jitter(strength);
      p.pace = jitter(strength);
      break;
    case "MID":
      p.passing = jitter(strength);
      p.dribble = jitter(strength);
      p.workRate = jitter(strength);
      p.stamina = jitter(strength);
      break;
    case "ATT":
      p.finishing = jitter(strength);
      p.dribble = jitter(strength);
      p.pace = jitter(strength);
      p.offBall = jitter(strength);
      break;
  }
  return p;
}

export function makeSquad(
  id: string,
  strength: number,
  historical: boolean,
): Squad {
  const players: Player[] = [];
  let n = 0;
  for (const [pos, count] of Object.entries(FORMATION) as [
    Player["position"],
    number,
  ][]) {
    for (let i = 0; i < count; i++) {
      players.push(makePlayer(n++, pos, strength));
    }
  }
  return {
    id,
    name: `Squad ${id}`,
    nation: historical ? "Brazil" : "Mixed",
    wcYear: 2022,
    formation: FORMATION,
    players,
    isHistorical: historical,
  };
}
