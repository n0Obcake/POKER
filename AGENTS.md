# AGENTS.md
© 2026 Alexander Pisko. All rights reserved.

Coders/AI agents must follow ACP1 boundaries strictly.

## Absolute Rules
- **DDD:** output full replacement files with the **same filename** (drag-drop replace).
- **One patch = one compartment:** DATA / CORE / ADAPTERS / UI / APP / DOCS.
- **No mixed patches.** If you touch UI, do not touch CORE/STATE/etc in the same patch.
- **gridKey(state) is the single render truth.** State change must recompute key → repaint.
- **Normalization lives only in ADAPTERS.**
- **13×13 mapping lives only in CORE.**
- **DATA schema is canonical:** `data/scenarios.json` records are `{ id, cells }` and **cells are keyed by valid cellKey**.
- If 2 attempts fail → rollback and return to `docs/` (blueprint). No third blind attempt.

## Repo Compartments
- `docs/` blueprint + contracts
- `data/` scenario SSOT (no logic)
- `src/core/` pure deterministic logic
- `src/adapters/` normalization + IO (storage, migrations)
- `src/ui/` DOM rendering + bindings only
- `src/app/` orchestration only
- `tests/` minimal regression tests
