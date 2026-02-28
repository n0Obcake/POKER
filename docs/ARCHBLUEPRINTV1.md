# ARCHBLUEPRINTV1 — Poker Engine (ACP1)
© 2026 Alexander Pisko. All rights reserved.

## Layers (LAW)
DATA → CORE → ADAPTERS → UI → APP (orchestrator)

## Dataflow
1. UI events → APP.setState(patch)
2. APP merges patch → ADAPTERS.normalizeState
3. APP computes `gridKey(state)` (CORE)
4. APP resolves record by id (ADAPTERS)
5. APP canonicalizes 169-cell map (ADAPTERS)
6. UI renders (UI)
7. APP persists lastState (ADAPTERS/storage)

## SSOT
- Scenario SSOT: `data/scenarios.json`
- Mapping SSOT: `src/core/gridMap.js`
- Routing SSOT: `src/core/routerKey.js`
