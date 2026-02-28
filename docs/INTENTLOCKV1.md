# INTENTLOCKV1 — Poker Engine (ACP1)
© 2026 Alexander Pisko. All rights reserved.

## Purpose (one sentence)
A fast, offline, microstakes preflop range trainer + leak guardrail that renders a standard 13×13 matrix for a selected scenario.

## Target user
Microstakes 6-max online player (ACR 10NL focus).

## V1 Scope (≤10 bullets)
1. Render a 13×13 preflop matrix (standard mapping).
2. Deterministic routing via `gridKey = MODE:SCENARIO:HERO:FACING:BUCKET`.
3. Load scenario data from `data/scenarios.json`.
4. Show active `gridKey` onscreen.
5. Persist last UI state in localStorage.
6. Basic legend/flags JSON present (no UI yet).
7. Minimal tests for routing + mapping + cell normalization.

## NON-GOALS (NOT IN V1)
- No solver integration.
- No hand history parsing.
- No multiway support.
- No postflop.
- No fancy styling.

## Success metrics
- Switching any dropdown deterministically recomputes key and repaints grid.
- Tests pass.
- No mixed-layer edits required to add new scenarios.

## Failure conditions
- Any business logic appears in `src/ui/`.
- Any DOM/storage access appears in `src/core/`.
- Scenario schema forks or compatibility hacks reappear.
