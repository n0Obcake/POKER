# Poker Engine — ACP1 Foundation (V003)
© 2026 Alexander Pisko. All rights reserved.

This repo is an **ACP1 Build-Mode** foundation: deterministic, compartmentalized, and recoverable.

## Compartments (NON-NEGOTIABLE)
- `data/` — SSOT JSON only (no logic)
- `src/core/` — pure logic only
- `src/adapters/` — normalization + IO (storage, schema mapping)
- `src/ui/` — DOM rendering + bindings only (no business logic)
- `src/app/` — orchestration only (wires the layers)
- `tests/` — minimal regression tests
- `docs/` — blueprint + contracts

## Run
- `npm install`
- `npm run dev`
- open http://localhost:8000

## Tests
- `npm test`

## Golden rules
- UI must never normalize.
- CORE must never touch DOM/storage.
- DATA schema changes require a version bump + migration plan.
- If something breaks twice: rollback, then revise blueprint. No hotfix stacking.
