import { describe, expect, test } from "bun:test";
import { pitchSlots } from "../src/lib/draft/pitch.js";
import { FORMATIONS } from "../src/lib/types.js";
import type { Squad } from "../src/lib/types.js";
import type {
  AggregateStats,
  Tournament,
} from "../src/lib/tournament/types.js";
import {
  buildShareCardData,
  fitFontSize,
  outcomeAccent,
  outcomeSlug,
  outcomeTitle,
  pitchLabel,
  shareFilename,
  shareText,
  truncateToWidth,
} from "../src/lib/shareCard.js";
import { makePlayer } from "./helpers/players.js";

const FORMATION_KEY = "4-3-3";

function userSquad(): Squad {
  const players = pitchSlots(FORMATION_KEY).map((slot, i) =>
    makePlayer(`p${i}`, "BRA", {
      positions: [slot.role],
      bestPosition: slot.role,
      assignedPosition: slot.role,
      assignedSlot: i,
    }),
  );
  return {
    id: "user-squad",
    name: "Your team",
    nation: "MIX",
    wcYear: 2026,
    formation: FORMATIONS[FORMATION_KEY],
    players,
    isHistorical: false,
    isUser: true,
  };
}

const stats: AggregateStats = {
  matches: [],
  played: 7,
  won: 6,
  drawn: 0,
  lost: 1,
  points: 18,
  gf: 16,
  ga: 5,
  gd: 11,
  cleanSheets: 3,
  penaltyWins: 1,
  biggestWin: 4,
  biggestLoss: 1,
  avgGoalsFor: 2.285,
};

function tournament(outcome: Tournament["outcome"]): Tournament {
  const squad = userSquad();
  return {
    id: "run",
    phase: "ended",
    userSquad: squad,
    squads: { [squad.id]: squad },
    group: [],
    matches: [],
    outcome,
  };
}

describe("share card data", () => {
  test("builds eleven slots in formation order", () => {
    const data = buildShareCardData(
      tournament("champion"),
      FORMATION_KEY,
      stats,
    );

    expect(data.players).toHaveLength(11);
    expect(data.players.map((p) => p.role)).toEqual([
      "GK",
      "LB",
      "CB",
      "CB",
      "RB",
      "CDM",
      "CM",
      "CAM",
      "LW",
      "ST",
      "RW",
    ]);
    expect(data.players[0]).toMatchObject({
      number: 1,
      color: "#3cffd0",
      rating: 80,
    });
    expect(data.outcomeTitle).toBe("CHAMPION");
    expect(data.outcomeAccent).toBe("#3cffd0");
    expect(data.outcomeNote).toBe("7 matches · lifted the trophy");
    expect(data.teamRating).toBe(80);
    expect(data.points).toBe(18);
    expect(data.biggestWin).toBe(4);
    expect(data.avgGoalsFor).toBeCloseTo(2.285);
    expect(data.stats).toEqual({
      played: 7,
      won: 6,
      drawn: 0,
      lost: 1,
      gf: 16,
      ga: 5,
      cleanSheets: 3,
      penaltyWins: 1,
    });
  });

  test("uses the pink accent for every non-champion outcome", () => {
    const data = buildShareCardData(
      tournament("eliminated"),
      FORMATION_KEY,
      stats,
    );

    expect(data.outcomeTitle).toBe("ELIMINATED IN GROUP STAGE");
    expect(data.outcomeSlug).toBe("group-stage-exit");
    expect(data.outcomeAccent).toBe("#ff3c9e");
  });

  test("keeps long names inside the card", () => {
    const squad = userSquad();
    squad.players[0] = {
      ...squad.players[0],
      name: "Alexandros Verylongname",
    };
    const data = buildShareCardData(
      { ...tournament("champion"), userSquad: squad },
      FORMATION_KEY,
      stats,
    );

    expect(data.players[0].name.length).toBeLessThanOrEqual(15);
  });
});

describe("pitch labels", () => {
  test("uses compact surname labels on the pitch", () => {
    expect(pitchLabel("Roberto Carlos")).toBe("Carlos");
    expect(pitchLabel("Maldini")).toBe("Maldini");
    expect(pitchLabel("Kevin De Bruyne")).toBe("De Bruyne");
  });
});

describe("share copy", () => {
  test("builds the filename and text for a champion", () => {
    const data = buildShareCardData(
      tournament("champion"),
      FORMATION_KEY,
      stats,
    );
    const date = new Date("2026-11-17T12:00:00Z");

    expect(shareFilename(data, date)).toBe(
      "my-world-cup-xi-champion-2026-11-17.png",
    );
    expect(shareText(data)).toContain("won the World Cup");
    expect(shareText(data)).toContain("myworldcupxi.com");
  });

  test("groups every non-champion outcome under the pink accent", () => {
    expect(outcomeAccent("champion")).toBe("#3cffd0");
    expect(outcomeAccent("runners-up")).toBe("#ff3c9e");
    expect(outcomeAccent("semi-final-exit")).toBe("#ff3c9e");
    expect(outcomeAccent("quarter-final-exit")).toBe("#ff3c9e");
    expect(outcomeAccent("round-of-16-exit")).toBe("#ff3c9e");
    expect(outcomeAccent("eliminated")).toBe("#ff3c9e");
  });

  test("maps every outcome label and slug", () => {
    expect(outcomeTitle("champion")).toBe("CHAMPION");
    expect(outcomeTitle("runners-up")).toBe("RUNNERS-UP");
    expect(outcomeSlug("semi-final-exit")).toBe("semi-final-exit");
    expect(outcomeSlug("round-of-16-exit")).toBe("round-of-16-exit");
  });
});

describe("canvas text fitting", () => {
  test("shrinks an oversized line to the available width", () => {
    const measure = (text: string, size: number) => text.length * size * 0.5;

    expect(fitFontSize("AAAA", 100, 100, measure)).toBe(50);
  });

  test("keeps the starting size when the line already fits", () => {
    const measure = (text: string, size: number) => text.length * size * 0.5;

    expect(fitFontSize("AAAA", 1000, 100, measure)).toBe(100);
  });

  test("truncates a long name with an ellipsis", () => {
    const measure = (text: string) => text.length * 10;

    expect(truncateToWidth("ABCDEFG", 50, measure)).toBe("ABCD…");
  });
});
