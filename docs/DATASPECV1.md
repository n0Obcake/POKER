# DATASPECV1 — scenarios.json
© 2026 Alexander Pisko. All rights reserved.

## File
`data/scenarios.json`

## Top-level
- `version`: integer
- `records`: array of `ScenarioRecord`

## ScenarioRecord
- `id` (string): MUST equal `MODE:SCENARIO:HERO:FACING:BUCKET`.
- `cells` (object): map of `cellKey` → `CellValue`.

## cellKey
- Valid keys are:
  - pairs: `AA..22`
  - suited: `AKs..32s`
  - offsuit: `AKo..32o`

## CellValue
Either:
- string action (e.g. "FOLD", "CALL", "RAISE", "3BET")
OR
- object with at minimum: `{ action: string }`

## Notes
- `cells` may be sparse; renderer uses empty action for unspecified keys.
- Schema forks are prohibited.
