/* © 2026 Alexander Pisko. All rights reserved.
UI/bindControls.js
Binds dropdown events to APP.setState only.
*/
export function bindControls({ setState }) {
  const mode = document.getElementById("mode");
  const scenario = document.getElementById("scenario");
  const hero = document.getElementById("hero");
  const facing = document.getElementById("facing");
  const bucket = document.getElementById("bucket");

  const bind = (el, key) => {
    if (!el) return;
    el.addEventListener("change", () => setState({ [key]: el.value }));
  };

  bind(mode, "mode");
  bind(scenario, "scenario");
  bind(hero, "hero");
  bind(facing, "facing");
  bind(bucket, "bucket");
}
