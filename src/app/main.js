/* © 2026 Alexander Pisko. All rights reserved.
APP/main.js
Orchestration only:
state → normalize → gridKey → resolve → cells → render → persist
*/
import { gridKey } from "../core/routerKey.js";
import { normalizeState } from "../adapters/normalizeState.js";
import { resolveActiveGrid } from "../adapters/resolveActiveGrid.js";
import { getActiveCells } from "../adapters/getActiveCells.js";
import { loadLastState, saveLastState } from "../adapters/storageAdapter.js";
import { renderGrid } from "../ui/renderGrid.js";
import { bindControls } from "../ui/bindControls.js";

let state = {
  mode: "PREFLOP",
  scenario: "VS_OPEN",
  hero: "BB",
  facing: "CO",
  bucket: "STANDARD"
};

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

function render() {
  state = normalizeState(state);
  const key = gridKey(state);
  const activeGrid = resolveActiveGrid(key);
  const cells = getActiveCells(activeGrid);

  const keyEl = document.getElementById("gridKey");
  if (keyEl) keyEl.textContent = key;

  const gridEl = document.getElementById("grid");
  renderGrid(cells, gridEl);

  saveLastState({ ...state });
}

export function init() {
  bindControls({ setState });

  const last = loadLastState();
  if (last) state = { ...state, ...last };

  render();
}
