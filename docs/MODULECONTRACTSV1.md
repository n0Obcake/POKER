# MODULECONTRACTSV1 — Poker Engine (ACP1)
© 2026 Alexander Pisko. All rights reserved.

## DATA
- `data/scenarios.json` — records: `{ id, cells }`
- `data/legend.json` — action definitions
- `data/flags.json` — tags/flags

## CORE
- `core/gridMap.js` — cellKey mapping (pure)
- `core/routerKey.js` — gridKey construction (pure)
- `core/bucket.js` — bb→bucket (pure)

## ADAPTERS
- `adapters/normalizeState.js` — normalize UI state (pure-ish: no IO)
- `adapters/resolveActiveGrid.js` — read scenarios JSON (no DOM)
- `adapters/getActiveCells.js` — canonicalize cells (no DOM)
- `adapters/storageAdapter.js` — localStorage IO + migrations

## UI
- `ui/bindControls.js` — DOM event bindings only
- `ui/renderGrid.js` — DOM rendering only

## APP
- `app/main.js` — orchestrates: state → key → data → cells → render → persist
