/* © 2026 Alexander Pisko. All rights reserved.
UI/renderGrid.js
Rendering only. No normalization. No active-grid selection.
*/
import { RANKS } from "../core/handKeys.js";
import { cellKeyAt } from "../core/gridMap.js";

export function renderGrid(cells, mountEl) {
  if (!mountEl) return;
  mountEl.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.fontFamily = "system-ui, sans-serif";
  table.style.fontSize = "12px";

  // header row
  const tr0 = document.createElement("tr");
  tr0.appendChild(document.createElement("th"));
  for (const r of RANKS) {
    const th = document.createElement("th");
    th.textContent = r;
    th.style.padding = "4px";
    th.style.border = "1px solid #333";
    tr0.appendChild(th);
  }
  table.appendChild(tr0);

  for (const row of RANKS) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = row;
    th.style.padding = "4px";
    th.style.border = "1px solid #333";
    tr.appendChild(th);

    for (const col of RANKS) {
      const key = cellKeyAt(row, col);
      const td = document.createElement("td");
      td.style.width = "26px";
      td.style.height = "22px";
      td.style.textAlign = "center";
      td.style.border = "1px solid #333";
      td.title = key || "";
      const action = cells?.[key]?.action ?? "";
      td.textContent = action ? action[0] : "";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  mountEl.appendChild(table);
}
