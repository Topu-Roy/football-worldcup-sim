import type { Position } from "../types.js";

export function positionColor(position: Position): string {
  switch (position) {
    case "GK":
      return "#3cffd0";
    case "DEF":
      return "#5200ff";
    case "MID":
      return "#ffd23c";
    case "ATT":
      return "#ff3c9e";
  }
}
