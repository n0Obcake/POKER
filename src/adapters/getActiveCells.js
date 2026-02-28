/* © 2026 Alexander Pisko. All rights reserved.
ADAPTERS/getActiveCells.js
Canonicalizes a scenario record into a full 169-cell map.

DATA contract:
- scenario record shape: { id: string, cells: Record<cellKey, CellValue> }
- cellKey must satisfy CORE/isValidCellKey
- CellValue is either string action or object { action, ... }

This adapter intentionally supports ONLY the canonical shape.
*/
import { cellKeyAt } from "../core/gridMap.js";
import { RANKS, isValidCellKey } from "../core/handKeys.js";

function emptyCellsMap() {
  const out = {};
  for (const row of RANKS) {
    for (const col of RANKS) {
      const key = cellKeyAt(row, col);
      out[key] = { action: "" };
    }
  }
  return out;
}

function normalizeCellValue(value) {
  if (typeof value === "string") return { action: value.trim().toUpperCase() };
  if (value && typeof value === "object") {
    return { ...value, action: String(value.action ?? "").trim().toUpperCase() };
  }
  return { action: "" };
}

export function getActiveCells(activeGrid) {
  const result = emptyCellsMap();
  if (!activeGrid) return result;

  const cells = activeGrid.cells;
  if (!cells || typeof cells !== "object") return result;

  for (const [key, value] of Object.entries(cells)) {
    if (!isValidCellKey(key)) continue;
    result[key] = normalizeCellValue(value);
  }

  return result;
}
