/* © 2026 Alexander Pisko. All rights reserved.
ADAPTERS/storageAdapter.js
Minimal localStorage persistence.
SSOT: only persists lastState.
*/

const STORAGE_KEY = "pokerengine.storage.v1";

export function loadLastState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed.lastState ?? null) : null;
  } catch {
    return null;
  }
}

export function saveLastState(lastState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastState }));
  } catch {
    // Non-fatal (private browsing, quota, etc.)
  }
}
