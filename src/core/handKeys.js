/* © 2026 Alexander Pisko. All rights reserved.
CORE/handKeys.js
Cell key contract: AA..22, AKs..32s, AKo..32o (uppercase)
*/
export const RANKS = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

export function isValidCellKey(key) {
  if (typeof key !== "string") return false;
  const k = key.trim();
  return /^([AKQJT98765432]{2})$/.test(k) || /^([AKQJT98765432]{2}s)$/.test(k) || /^([AKQJT98765432]{2}o)$/.test(k);
}
