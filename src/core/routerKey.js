/* © 2026 Alexander Pisko. All rights reserved.
CORE/routerKey.js
*/
export function gridKey(state) {
  const mode = String(state?.mode ?? "").trim().toUpperCase();
  const scenario = String(state?.scenario ?? "").trim().toUpperCase();
  const hero = String(state?.hero ?? "").trim().toUpperCase();
  const facing = String(state?.facing ?? "").trim().toUpperCase();
  const bucket = String(state?.bucket ?? "").trim().toUpperCase();
  return [mode, scenario, hero, facing, bucket].join(":");
}
