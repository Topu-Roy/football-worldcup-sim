/**
 * Static fixtures for the /share-preview design route.
 *
 * The real share card is built from a finished tournament. These fixtures keep
 * the preview deterministic, so the four layouts can be compared on the same
 * squad, results and stat lines.
 */

export type SharePreviewDepartment = "GK" | "DEF" | "MID" | "ATT";

export interface SharePreviewPlayer {
  id: string;
  name: string;
  role: string;
  number: number;
  /** Player overall rating, 0-99. */
  rating: number;
  /** Slot position as a percentage of the pitch box. */
  x: number;
  y: number;
  department: SharePreviewDepartment;
  color: string;
}

export interface SharePreviewData {
  id: "champion" | "group-exit";
  outcomeTitle: string;
  outcomeNote: string;
  /** Accent color used by borders, glows and the outcome title. */
  accent: string;
  accentSoft: string;
  formation: string;
  /** Average XI rating, the headline number on every variation. */
  teamRating: number;
  record: string;
  goals: string;
  points: number;
  played: number;
  biggestWin: string;
  avgGoals: string;
  cleanSheets: number;
  penaltyWins: number;
  players: SharePreviewPlayer[];
}

const DEPARTMENT_COLORS: Record<SharePreviewDepartment, string> = {
  GK: "#3cffd0",
  DEF: "#3c9dff",
  MID: "#ffd23c",
  ATT: "#ff8a3c",
};

/** Same 4-3-3 slot map as `pitchSlots("4-3-3")`. */
const PLAYERS: SharePreviewPlayer[] = [
  {
    id: "buffon",
    name: "Buffon",
    role: "GK",
    number: 1,
    rating: 90,
    x: 50,
    y: 91,
    department: "GK",
    color: DEPARTMENT_COLORS.GK,
  },
  {
    id: "roberto-carlos",
    name: "Roberto Carlos",
    role: "LB",
    number: 6,
    rating: 91,
    x: 12,
    y: 74,
    department: "DEF",
    color: DEPARTMENT_COLORS.DEF,
  },
  {
    id: "maldini",
    name: "Maldini",
    role: "CB",
    number: 3,
    rating: 94,
    x: 38,
    y: 78,
    department: "DEF",
    color: DEPARTMENT_COLORS.DEF,
  },
  {
    id: "cannavaro",
    name: "Cannavaro",
    role: "CB",
    number: 5,
    rating: 92,
    x: 62,
    y: 78,
    department: "DEF",
    color: DEPARTMENT_COLORS.DEF,
  },
  {
    id: "cafu",
    name: "Cafu",
    role: "RB",
    number: 2,
    rating: 90,
    x: 88,
    y: 74,
    department: "DEF",
    color: DEPARTMENT_COLORS.DEF,
  },
  {
    id: "xavi",
    name: "Xavi",
    role: "CDM",
    number: 8,
    rating: 93,
    x: 50,
    y: 58,
    department: "MID",
    color: DEPARTMENT_COLORS.MID,
  },
  {
    id: "zidane",
    name: "Zidane",
    role: "CM",
    number: 10,
    rating: 95,
    x: 32,
    y: 46,
    department: "MID",
    color: DEPARTMENT_COLORS.MID,
  },
  {
    id: "iniesta",
    name: "Iniesta",
    role: "CAM",
    number: 14,
    rating: 93,
    x: 68,
    y: 46,
    department: "MID",
    color: DEPARTMENT_COLORS.MID,
  },
  {
    id: "mbappe",
    name: "Mbappé",
    role: "LW",
    number: 7,
    rating: 92,
    x: 18,
    y: 27,
    department: "ATT",
    color: DEPARTMENT_COLORS.ATT,
  },
  {
    id: "ronaldo",
    name: "Ronaldo",
    role: "ST",
    number: 9,
    rating: 94,
    x: 50,
    y: 21,
    department: "ATT",
    color: DEPARTMENT_COLORS.ATT,
  },
  {
    id: "messi",
    name: "Messi",
    role: "RW",
    number: 30,
    rating: 96,
    x: 82,
    y: 27,
    department: "ATT",
    color: DEPARTMENT_COLORS.ATT,
  },
];

export const CHAMPION_CARD: SharePreviewData = {
  id: "champion",
  outcomeTitle: "CHAMPION",
  outcomeNote: "7 matches · lifted the trophy",
  accent: "#3cffd0",
  accentSoft: "rgba(60, 255, 208, 0.16)",
  formation: "4-3-3",
  teamRating: 93,
  record: "6-1-0",
  goals: "13-4",
  points: 19,
  played: 7,
  biggestWin: "3-0",
  avgGoals: "1.9",
  cleanSheets: 3,
  penaltyWins: 1,
  players: PLAYERS,
};

export const EXIT_CARD: SharePreviewData = {
  id: "group-exit",
  outcomeTitle: "GROUP STAGE EXIT",
  outcomeNote: "3 matches · out before the knockouts",
  accent: "#ff3c9e",
  accentSoft: "rgba(255, 60, 158, 0.16)",
  formation: "4-3-3",
  teamRating: 93,
  record: "1-0-2",
  goals: "3-5",
  points: 3,
  played: 3,
  biggestWin: "2-0",
  avgGoals: "1.0",
  cleanSheets: 1,
  penaltyWins: 0,
  players: PLAYERS,
};

export const SHARE_PREVIEW_VARIANTS = {
  champion: CHAMPION_CARD,
  "group-exit": EXIT_CARD,
} as const;

export type SharePreviewVariant = keyof typeof SHARE_PREVIEW_VARIANTS;
