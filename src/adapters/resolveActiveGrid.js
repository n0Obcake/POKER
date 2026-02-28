/* © 2026 Alexander Pisko. All rights reserved.
ADAPTERS/resolveActiveGrid.js
Resolves the canonical scenario record by gridKey.
Deterministic: O(1) lookup from in-memory index.
*/
import scenarios from "../../data/scenarios.json" assert { type: "json" };

const INDEX = (() => {
  const m = new Map();
  const recs = Array.isArray(scenarios.records) ? scenarios.records : [];
  for (const r of recs) {
    const id = String(r?.id ?? "").trim().toUpperCase();
    if (!id) continue;
    m.set(id, r);
  }
  return m;
})();

export function resolveActiveGrid(key) {
  const k = String(key ?? "").trim().toUpperCase();
  return INDEX.get(k) || null;
}
