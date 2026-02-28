/* © 2026 Alexander Pisko. All rights reserved.
tests/run_tests.js
Deterministic test runner (node).
Purpose:
- Prove core invariants
- Enforce schema + repo hardening (no drift)
*/

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gridKey } from "../src/core/routerKey.js";
import { cellKeyAt } from "../src/core/gridMap.js";
import { getActiveCells } from "../src/adapters/getActiveCells.js";
import { isValidCellKey } from "../src/core/handKeys.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

async function readText(relPath) {
  return fs.readFile(path.join(REPO_ROOT, relPath), "utf8");
}

async function readJSON(relPath) {
  const raw = await readText(relPath);
  return JSON.parse(raw);
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function stableStringify(obj) {
  // Deterministic JSON stringify: sorts object keys recursively.
  // Arrays keep order (order must already be deterministic by contract).
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

function assertAllowedAction(action, allowed) {
  assert.equal(typeof action, "string");
  const a = action.trim().toUpperCase();
  assert.ok(allowed.has(a), `Invalid action: ${action}`);
}

// ---------------------------------------------------------------------------
// Core invariants
// ---------------------------------------------------------------------------

assert.equal(
  gridKey({ mode: "PREFLOP", scenario: "VS_OPEN", hero: "BB", facing: "CO", bucket: "STANDARD" }),
  "PREFLOP:VS_OPEN:BB:CO:STANDARD"
);

// mapping sanity: AA on diagonal (A,A)
assert.equal(cellKeyAt("A", "A"), "AA");
// suited above diagonal: row A (idx0) col K (idx1) => AKs
assert.equal(cellKeyAt("A", "K"), "AKs");
// offsuit below diagonal: row K col A => AKo
assert.equal(cellKeyAt("K", "A"), "AKo");

// getActiveCells: always returns full 169 map + normalizes values
const normalized = getActiveCells({ cells: { AA: { action: "raise" }, AKo: "call" } });
assert.equal(Object.keys(normalized).length, 169);
assert.equal(normalized.AA.action, "RAISE");
assert.equal(normalized.AKo.action, "CALL");
assert.equal(normalized["72o"].action, "");

const empty = getActiveCells(null);
assert.equal(Object.keys(empty).length, 169);

// ---------------------------------------------------------------------------
// Data schema validation (fail-fast)
// ---------------------------------------------------------------------------

const legend = await readJSON("data/legend.json");
assert.ok(Number.isInteger(legend.version), "legend.json version must be integer");
assert.ok(Array.isArray(legend.actions), "legend.json actions must be array");

const ALLOWED_ACTIONS = new Set(
  legend.actions
    .map(a => String(a.id || "").trim().toUpperCase())
    .filter(Boolean)
);
assert.ok(ALLOWED_ACTIONS.size > 0, "legend.json must define action ids");

const scenarios = await readJSON("data/scenarios.json");
assert.ok(Number.isInteger(scenarios.version), "scenarios.json version must be integer");
assert.ok(Array.isArray(scenarios.records), "scenarios.json records must be array");

// Deterministic ordering: keep scenarios stable for diffs.
const ids = scenarios.records.map(r => r.id);
const sorted = [...ids].sort((a, b) => a.localeCompare(b));
assert.deepEqual(ids, sorted, "scenarios.records must be sorted by id (deterministic ordering)");

for (const rec of scenarios.records) {
  assert.equal(typeof rec.id, "string", "record.id must be string");
  const parts = rec.id.split(":");
  assert.equal(parts.length, 5, `record.id must have 5 parts: ${rec.id}`);
  const [mode, scenario, hero, facing, bucket] = parts;

  assert.equal(
    rec.id,
    gridKey({ mode, scenario, hero, facing, bucket }),
    `record.id must equal gridKey normalization: ${rec.id}`
  );

  assert.ok(rec.cells && typeof rec.cells === "object" && !Array.isArray(rec.cells), `cells must be object: ${rec.id}`);

  for (const [k, v] of Object.entries(rec.cells)) {
    assert.ok(isValidCellKey(k), `Invalid cellKey '${k}' in ${rec.id}`);

    if (typeof v === "string") {
      assertAllowedAction(v, ALLOWED_ACTIONS);
      continue;
    }

    assert.ok(v && typeof v === "object" && !Array.isArray(v), `CellValue must be string or object: ${rec.id}.${k}`);
    assert.ok("action" in v, `CellValue object must include action: ${rec.id}.${k}`);
    assertAllowedAction(v.action, ALLOWED_ACTIONS);
  }
}

// ---------------------------------------------------------------------------
// Repo hardening (ACP1: no drift)
// ---------------------------------------------------------------------------

// 1) File allowlist: prevent silent creep of legacy artifacts.
const ALLOWED_TOP_LEVEL = new Set([
  ".gitignore",
  "AGENTS.md",
  "README.md",
  "index.html",
  "app_v1.html",
  "package.json",
  "data/legend.json",
  "data/legend.sha256",
  "data/scenarios.json",
  "data/scenarios.sha256",
  "docs/ACCEPTANCETESTSV1.md",
  "docs/ARCHBLUEPRINTV1.md",
  "docs/DATASPECV1.md",
  "docs/INTENTLOCKV1.md",
  "docs/MODULECONTRACTSV1.md",
  "docs/POKERENGINE_MASTERSSOTV015.docx",
  "tests/run_tests.js",
]);

async function listFiles() {
  const out = [];
  async function walk(relDir) {
    const abs = path.join(REPO_ROOT, relDir);
    const entries = await fs.readdir(abs, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.posix.join(relDir, e.name);
      const relNorm = rel.startsWith("./") ? rel.slice(2) : rel;
      if (e.isDirectory()) await walk(relNorm);
      else out.push(relNorm);
    }
  }
  await walk(".");
  return out
    .map(f => f.replace(/^\.\//, ""))
    .filter(f => f !== "")
    .sort();
}

const allFiles = await listFiles();
const filteredFiles = allFiles.filter(f => !f.startsWith("node_modules/") && f !== ".DS_Store");

for (const f of filteredFiles) {
  if (f.startsWith("src/")) continue;
  assert.ok(ALLOWED_TOP_LEVEL.has(f), `Unexpected file present (remove or archive): ${f}`);
}

// 2) Layer boundary guard: prevent UI↔CORE tangling and random cross-imports.
function layerOf(relPath) {
  if (relPath.startsWith("data/")) return "data";
  if (relPath.startsWith("src/core/")) return "core";
  if (relPath.startsWith("src/adapters/")) return "adapters";
  if (relPath.startsWith("src/ui/")) return "ui";
  if (relPath.startsWith("src/app/")) return "app";
  return "other";
}

const LAYER_RULES = {
  data: new Set(["data"]),
  core: new Set(["core"]),
  adapters: new Set(["adapters", "core", "data"]),
  ui: new Set(["ui", "adapters", "core", "data"]),
  app: new Set(["app", "ui", "adapters", "core", "data"]),
};

function parseImports(sourceText) {
  const re = /\bimport\s+(?:[^;]*?)\s+from\s+["']([^"']+)["']\s*;?/g;
  const out = [];
  let m;
  while ((m = re.exec(sourceText))) out.push(m[1]);
  return out;
}

const srcFiles = filteredFiles.filter(f => f.startsWith("src/") && f.endsWith(".js"));

for (const f of srcFiles) {
  const layer = layerOf(f);
  assert.notEqual(layer, "other", `Unexpected JS file outside layers: ${f}`);

  const allowed = LAYER_RULES[layer];
  assert.ok(allowed, `No layer rules for: ${layer}`);

  const txt = await readText(f);
  for (const spec of parseImports(txt)) {
    if (!spec.startsWith("./") && !spec.startsWith("../")) continue; // bare imports allowed

    const fromDir = path.posix.dirname(f);
    const resolved = path.posix.normalize(path.posix.join(fromDir, spec));
    const target = (resolved.endsWith(".js") || resolved.endsWith(".json")) ? resolved : `${resolved}.js`;
    const targetLayer = layerOf(target);

    assert.ok(
      allowed.has(targetLayer),
      `Layer violation: ${f} (${layer}) imports ${spec} (${targetLayer})`
    );
  }
}

// 3) Reachability guard: no dead modules.
// Walk relative import graph starting at the browser entrypoint.
function normalizeImportToFile(fromFile, spec) {
  const fromDir = path.posix.dirname(fromFile);
  const resolved = path.posix.normalize(path.posix.join(fromDir, spec));
  if (resolved.endsWith(".json") || resolved.endsWith(".js")) return resolved;
  return `${resolved}.js`;
}

async function buildImportGraph(entry) {
  const visited = new Set();
  const stack = [entry];

  while (stack.length) {
    const f = stack.pop();
    if (visited.has(f)) continue;
    visited.add(f);

    const txt = await readText(f);
    for (const spec of parseImports(txt)) {
      if (!spec.startsWith("./") && !spec.startsWith("../")) continue;
      const target = normalizeImportToFile(f, spec);
      if (target.startsWith("src/") && target.endsWith(".js")) {
        stack.push(target);
      }
    }
  }

  return visited;
}

const reachable = await buildImportGraph("src/app/main.js");
for (const f of srcFiles) {
  assert.ok(reachable.has(f), `Dead/unreferenced module (delete it): ${f}`);
}

// 4) Schema hash lock: detect any unintentional edits.
const legendHashExpected = (await readText("data/legend.sha256")).trim();
const scenariosHashExpected = (await readText("data/scenarios.sha256")).trim();
assert.ok(/^[a-f0-9]{64}$/i.test(legendHashExpected), "legend.sha256 must be 64-char hex sha256");
assert.ok(/^[a-f0-9]{64}$/i.test(scenariosHashExpected), "scenarios.sha256 must be 64-char hex sha256");

const legendHashActual = sha256(stableStringify(legend));
const scenariosHashActual = sha256(stableStringify(scenarios));
assert.equal(legendHashActual, legendHashExpected, "legend.json hash mismatch (update legend.sha256 intentionally)");
assert.equal(scenariosHashActual, scenariosHashExpected, "scenarios.json hash mismatch (update scenarios.sha256 intentionally)");

console.log("OK — cock-hard suite passed");
