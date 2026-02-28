/* © 2026 Alexander Pisko. All rights reserved.
ADAPTERS/normalizeState.js
Canonical state normalization.
*/

export function normalizeState(state) {
  const s = { ...state };
  s.mode = String(s.mode ?? "").trim().toUpperCase() || "PREFLOP";
  s.scenario = String(s.scenario ?? "").trim().toUpperCase() || "RFI";
  s.hero = String(s.hero ?? "").trim().toUpperCase() || "BB";
  s.facing = String(s.facing ?? "").trim().toUpperCase() || "BTN";
  s.bucket = String(s.bucket ?? "").trim().toUpperCase() || "STANDARD";
  return s;
}
