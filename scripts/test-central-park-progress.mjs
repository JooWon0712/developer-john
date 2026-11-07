import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

function moduleUrl(name, replacements = {}) {
  let source = readFileSync(new URL(`../src/features/division2/central-park/${name}.ts`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, JSON.stringify(to));
  return `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`;
}

const rewardsUrl = moduleUrl("rewards");
const collectiblesUrl = moduleUrl("collectibles");
const { loadProgress, maxBackupBytes, parseBackup, saveProgress, serializeBackup, storageKey } =
  await import(moduleUrl("progress", { '"./rewards"': rewardsUrl, '"./collectibles"': collectiblesUrl }));
const { rewards } = await import(rewardsUrl);
const { guardianCards } = await import(collectiblesUrl);

function archiveBackup(checked, extra = {}) {
  return JSON.stringify({ schemaVersion: 1, collection: "echoes-of-central-park-2026", checked, ...extra });
}

test("first visits start with no checks and never read the Red Moon or prototype key", () => {
  const keys = [];
  const storage = { getItem(key) { keys.push(key); return null; } };
  const first = loadProgress(storage);
  assert.deepEqual(first, { checked: [], mode: "ready" });
  first.checked.push("ratel");
  assert.deepEqual(loadProgress(storage), { checked: [], mode: "ready" });
  assert.deepEqual(keys, [storageKey, storageKey]);
  assert.equal(storageKey, "developer-john:division2:echoes-of-central-park-2026:v1");
});

test("prototype schema 1 restores only the explicitly selected rewards", () => {
  const backup = archiveBackup(["specters-gloves", "drop-patch", "hunter-murder"], {
    confirmedReportVersion: 2,
    updatedAt: "2026-11-07T01:00:00.000Z",
  });
  assert.deepEqual(parseBackup(backup), ["specters-gloves", "drop-patch", "hunter-murder"]);
  assert.deepEqual(parseBackup(archiveBackup([], { confirmedReportVersion: 8 })), []);
});

test("normalization deduplicates known checks and skips retired IDs", () => {
  const backup = archiveBackup(["paper-route-cap", "retired-reward", "paper-route-cap", "killer-weapon-skin"]);
  assert.deepEqual(parseBackup(backup), ["paper-route-cap", "killer-weapon-skin"]);
  assert.deepEqual(parseBackup(`\uFEFF${backup}`), ["paper-route-cap", "killer-weapon-skin"]);
});

test("Guardian card checks share reward storage and backups without counting as rewards", () => {
  const cardIds = guardianCards.map(card => card.id);
  const checked = ["specters-gloves", ...cardIds];
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  assert.equal(rewards.length, 33);
  assert.equal(new Set([...rewards.map(reward => reward.id), ...cardIds]).size, 39);
  assert.equal(saveProgress(storage, checked), true);
  assert.deepEqual(loadProgress(storage), { checked, mode: "ready" });
  assert.deepEqual(parseBackup(serializeBackup(checked)), checked);
  assert.deepEqual(parseBackup(archiveBackup(["clockwork"])), ["clockwork"]);
});

test("malformed, foreign, and oversized backups are rejected", () => {
  for (const invalid of [
    "{", "null", "[]", "{}", archiveBackup("ratel"), archiveBackup(["ratel", 0]),
    archiveBackup([], { schemaVersion: 2 }), archiveBackup([], { collection: "red-moon-unleashed-2026" }),
    archiveBackup([], { extra: "가".repeat(maxBackupBytes / 2) }),
  ]) {
    assert.throws(() => parseBackup(invalid));
  }
});

test("storage shares both language versions and preserves explicit clearing after reload", () => {
  const redMoonKey = "developer-john:division2:red-moon-unleashed-2026:v1";
  const values = new Map([[redMoonKey, "existing records"]]);
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  const checks = ["clockwork", "drop-bird"];
  assert.equal(saveProgress(storage, checks), true);
  assert.deepEqual(loadProgress(storage), { checked: checks, mode: "ready" });
  assert.deepEqual(parseBackup(serializeBackup(checks)), checks);
  assert.equal(saveProgress(storage, []), true);
  assert.deepEqual(loadProgress(storage), { checked: [], mode: "ready" });
  assert.equal(values.get(redMoonKey), "existing records");
});

test("failed or corrupt storage reads are distinguished without rewriting data", () => {
  const corrupt = "{broken";
  const storage = {
    getItem() { return corrupt; },
    setItem() { assert.fail("Loading may not write to storage"); },
  };
  assert.deepEqual(loadProgress(storage), { checked: [], mode: "corrupt" });
  assert.equal(storage.getItem(), corrupt);
  assert.deepEqual(loadProgress({ getItem() { throw new Error("Blocked"); } }), { checked: [], mode: "unavailable" });
  assert.equal(saveProgress({ setItem() { throw new Error("Quota exceeded"); } }, ["ratel"]), false);
});
