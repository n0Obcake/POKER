# ACCEPTANCETESTSV1 — Poker Engine (ACP1)
© 2026 Alexander Pisko. All rights reserved.

## A. Routing + repaint
- Given the app is loaded
- When I change any dropdown
- Then `gridKey` updates immediately and the grid re-renders.

## B. Grid mapping
- Given a 13×13 grid
- Then diagonal cells are pairs (AA..22)
- Above diagonal are suited (AKs..32s)
- Below diagonal are offsuit (AKo..32o)

## C. Data contract
- Given a record `{ id, cells }` in `data/scenarios.json`
- When the id matches `gridKey`
- Then the grid renders those actions at the correct cell keys.

## D. Persistence
- Given I select a state
- When I refresh
- Then the last state is restored.

## Must never regress
- grid mapping correctness
- `gridKey` determinism
- layer separation (DATA/CORE/ADAPTERS/UI/APP)
