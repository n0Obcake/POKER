/* © 2026 Alexander Pisko. All rights reserved.
CORE/gridMap.js
Standard 13×13 matrix mapping:
- pairs on diagonal
- suited above diagonal
- offsuit below diagonal
*/
import { RANKS } from "./handKeys.js";

export function cellKeyAt(rowRank, colRank) {
  // rows/cols are rank letters. row is "left axis", col is "top axis".
  if (rowRank === colRank) return rowRank + colRank; // pair
  const rowIdx = RANKS.indexOf(rowRank);
  const colIdx = RANKS.indexOf(colRank);
  if (rowIdx < 0 || colIdx < 0) return null;
  const hi = rowIdx < colIdx ? rowRank : colRank;
  const lo = rowIdx < colIdx ? colRank : rowRank;
  // If row is higher rank than col (above diagonal region), treat suited
  if (rowIdx < colIdx) return hi + lo + "s";
  // below diagonal region is offsuit
  return hi + lo + "o";
}
