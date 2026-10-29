import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { Script } from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
function moduleUrl(relative, replacements = {}) {
  let source = readFileSync(path.join(root, relative), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, JSON.stringify(to));
  const javascript = stripTypeScriptTypes(source, { mode: "strip" });
  return "data:text/javascript;base64," + Buffer.from(javascript).toString("base64");
}
const eventUrl = moduleUrl("src/features/division2/red-moon/event.ts");
const data = await import(eventUrl);
const englishUrl = moduleUrl("src/features/division2/red-moon/event-en.ts", { '"./event"': eventUrl });
const english = await import(englishUrl);
const localizationUrl = moduleUrl("src/features/division2/red-moon/localization.ts", { '"./event"': eventUrl, '"./event-en"': englishUrl });
const { getLocalizedEventData, getRewardSearchText, getEventPath } = await import(localizationUrl);
const { getRewardCopy } = await import(moduleUrl("src/features/division2/red-moon/copy.ts"));

const progressUrl = moduleUrl("src/features/division2/red-moon/progress.ts", { '"./event"': eventUrl });
const progress = await import(progressUrl);
const { readStoredProgress, writeStoredProgress } = await import(moduleUrl("src/features/division2/red-moon/storage.ts", { '"./progress"': progressUrl }));
const { periodStatus } = await import(moduleUrl("src/features/division2/red-moon/availability.ts"));
const { resolveRewardAnchor } = await import(moduleUrl("src/features/division2/red-moon/navigation.ts", { '"./event"': eventUrl }));
const expectedAssetHashes = {
  "twitch-summon": "18274d3a35bee36a2955e715851ccabbafe2c4536cd96b068438e721cbc5ffc2",
  "twitch-bind": "32cba4e2ca3a53a3dfc1e5d7b64bb0d87e0a0c89bac7cae18a5ef240f773726c",
  "patch-final": "b9706deddddf965490257aa1b5d82ad4bf7b36a976c9d97ca43edf139e260fa2",
  "patch-scarecrow": "b79033a6946495840f2c724061cc9f6116bf22ac4ae1b6bc047fb7bc494f619d",
  "patch-rubber": "9fd97c1c5da919895e95cf7097d09dd0d296700cc8884edb1c48aedd19f528cd",
  "patch-dousing": "ec0ed545564fb9e51ea5f1bd1904a9df4e102d50d6adf989a9d0957fe37dd84c",
  "patch-binding": "35d69e974740b6186707bde30a7cf9f14c7563104ccb1a0d4e8d93418127cf37",
  "mask-houndsman": "663c4c2325923c032ffea07e7c22ab6911d237d95a23f42f8cb2118a58119deb",
  "gloves-houndsman": "eb2962a95409064db3b3a182d9ab20d1b4409b7e0345c061256fe2ed98f6a96b",
  "backpack-houndsman": "25c77ade0ecd7b675c0799a29a7f050486bd29035e9cb5d676256ff6180915f9",
  "patch-all-six": "10ca5a617e2507953e8726edbad2208ec3911885d1e7f5f258fd697153ea6762",
  "mask-necro": "3c047232a094ce253ed4c1d3246051ce373aacb238b35f8e96e116aa1fd6454d",
  "mask-risen": "8932777814b924beb4f36ef29fb28ee0598b88f17e586638a32c078dcd8c85c3",
  "vfx-hive": "36d7ee6b9f9ecf01732663ca4aa1ddb5d22c13d018ae0efbbca1dad21974bb08",
  "vfx-drone": "a86b7a01100b41cef570c6bcee6558ebce9f89931dfd38da77f93ce28a7e68e0",
  "patch-blinding": "4a5fd2efe9d5342f5812cdb9a0881bf53af393d91de644661c5b4b7a157af27e",
  "community-mask": "4f676ef7d860782b9fdf8a3399509c4dce7a7dd54a4433a921742d03cc9fa07f",
  "community-jacket": "d2af8f2825c1a8b389a3f54e47789aed5025b7ed438dd16841624a63b693dcaa",
  "community-pants": "8e4698f6b8ee38d7cc65600e555102adb99a8409807a413127821280e7f5f62e",
  "twitch-eye": "54e6a8cfe7290e4135117c9b1e1e3b6eaac2038d1febde3b12a8cd72ee7f6fe7",
  "login-mask": "92937aee52f6c6b9e9e36fcb7bf0c455044775b22b17f695b522257934747181",
  "apparel-trophy": "3e494d19bce0f25bd96f3c7f08c5723ccc1bb5599bc5aac1e6d3ca0bc951c60f",
  "uniform-houndsman": "f5f30f068bfe7803223f38fe7e17704cb6f9319994aa24cc2c142073dafcfd07"
};
const { event, categories, groups, records, images } = data;
const { createEmptyProgress, normalizeProgress, summarizeProgress, toggleCheck, setApparelCount } = progress;

test("event data retains 66 unique check IDs and independent 47/6/13 totals", () => {
  assert.equal(records.length, 66);
  assert.equal(new Set(records.map(record => record.id)).size, 66);
  assert.equal(groups.length, 12);
  const summary = summarizeProgress(createEmptyProgress());
  assert.deepEqual(summary, { reward: { current: 0, total: 47 }, bounty: { current: 0, total: 6 }, owned: { current: 0, total: 13 }, apparel: { current: 0, total: 43 } });
  assert.equal(event.startsOn, "2026-10-15");
  assert.equal(event.endsOn, "2026-11-03");
  assert.equal(event.dropsEndsOn, "2026-10-22");
  for (const group of groups) {
    assert.ok(categories.some(category => category.id === group.category));
    for (const entry of group.entries) {
      assert.equal(entry.id, entry.checks[0].id);
      for (const check of entry.checks) assert.ok(["reward", "bounty", "owned"].includes(check.type));
    }
  }
});

test("new visitors have no personal seed and independent progress instances", () => {
  const first = createEmptyProgress(), second = createEmptyProgress();
  assert.deepEqual(first.checkedIds, []);
  assert.equal(first.apparelCount, 0);
  first.checkedIds.push("login-mask");
  assert.deepEqual(second.checkedIds, []);
  assert.equal(first.savedAt, null);
});

test("checking, ownership, bounty completion and apparel cannot auto-complete each other", () => {
  const original = createEmptyProgress();
  let state = toggleCheck(original, "bounty-final", true);
  state = toggleCheck(state, "own-regulus", true);
  state = setApparelCount(state, 43);
  assert.deepEqual(original, createEmptyProgress());
  assert.equal(state.checkedIds.includes("patch-final"), false);
  assert.equal(state.checkedIds.includes("apparel-trophy"), false);
  assert.deepEqual(summarizeProgress(state), { reward: { current: 0, total: 47 }, bounty: { current: 1, total: 6 }, owned: { current: 1, total: 13 }, apparel: { current: 43, total: 43 } });
  state = toggleCheck(state, "patch-final", true);
  state = toggleCheck(state, "patch-final", true);
  assert.equal(summarizeProgress(state).reward.current, 1);
  state = toggleCheck(state, "patch-final");
  assert.equal(summarizeProgress(state).reward.current, 0);
  assert.throws(() => toggleCheck(state, "unknown"));
});

test("new state round-trips and duplicate IDs do not inflate counts", () => {
  const state = { ...createEmptyProgress(), checkedIds: ["patch-final", "patch-final"], savedAt: "2026-10-29T00:00:00.000Z", apparelCount: 20 };
  const restored = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.checkedIds, ["patch-final"]);
  assert.equal(restored.apparelCount, 20);
  assert.equal(restored.savedAt, state.savedAt);
  assert.equal(summarizeProgress(restored).reward.current, 1);
  restored.checkedIds.push("login-mask");
  assert.equal(state.checkedIds.length, 2);
});

test("reject corrupt, wrong event/schema, invalid IDs and historical wrappers", () => {
  const base = createEmptyProgress();
  const invalid = [null, [], "state", {}, { ...base, eventId: "other" }, { ...base, schema: 2 }, { ...base, checkedIds: "patch-final" }, { ...base, checkedIds: [1] }, { ...base, checkedIds: ["removed-weapon-id"] }, { ...base, savedAt: "invalid-date" }, { ...base, savedAt: undefined }, { state: base }, { modelContent: base }];
  for (const value of invalid) assert.throws(() => normalizeProgress(value));
});

test("apparel quantity validates both writes and persisted data", () => {
  for (const count of [-1, 44, 1.2, NaN, Infinity, "1", null]) {
    assert.throws(() => setApparelCount(createEmptyProgress(), count));
    assert.throws(() => normalizeProgress({ ...createEmptyProgress(), apparelCount: count }));
  }
  for (const count of [0, 1, 43]) assert.equal(setApparelCount(createEmptyProgress(), count).apparelCount, count);
});

test("all checks yield exact totals and reset is independent", () => {
  const complete = { ...createEmptyProgress(), checkedIds: records.map(record => record.id), apparelCount: 43 };
  assert.deepEqual(summarizeProgress(complete), { reward: { current: 47, total: 47 }, bounty: { current: 6, total: 6 }, owned: { current: 13, total: 13 }, apparel: { current: 43, total: 43 } });
  assert.deepEqual(createEmptyProgress().checkedIds, []);
  assert.equal(complete.checkedIds.length, 66);
});

test("23 public WebP assets are complete, small and contain no original provenance strings", () => {
  const directory = path.join(root, "public/games/the-division-2/red-moon-unleashed-2026");
  assert.equal(Object.keys(images).length, 23);
  assert.equal(readdirSync(directory).filter(name => name.endsWith(".webp")).length, 23);
  let total = 0;
  for (const [id, image] of Object.entries(images)) {
    assert.ok(records.some(record => record.id === id));
    assert.ok(image.src.startsWith("/games/the-division-2/red-moon-unleashed-2026/"));
    const bytes = readFileSync(path.join(root, "public", image.src));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expectedAssetHashes[id]);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(image.width > 0 && image.height > 0 && image.width <= 512 && image.height <= 512);
    total += bytes.length;
  }
  assert.equal(total, 314874);
  const publicData = JSON.stringify({ event, groups, images });
  assert.equal(/codex-clipboard|originalCommit|seedIds|division2\.red-moon-unleashed\.2026\.v1/.test(publicData), false);
});


function memoryStorage(entries = [], failures = {}) {
  const values = new Map(entries);
  const reads = [], writes = [];
  return {
    values, reads, writes,
    getItem(key) {
      reads.push(key);
      if (failures.read) throw new Error("Storage access blocked");
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      writes.push([key, value]);
      if (failures.write) throw new Error("QuotaExceededError");
      values.set(key, value);
    },
  };
}

test("storage reads restore valid progress or return an empty state without writing", () => {
  const state = { ...createEmptyProgress(), checkedIds: ["patch-final"], apparelCount: 12, savedAt: "2026-10-29T06:00:00.000Z" };
  const saved = JSON.stringify(state);
  const storage = memoryStorage([[progress.STORAGE_KEY, saved], ["another-service", "keep"]]);
  assert.deepEqual(readStoredProgress(storage), { progress: state, state: "ready" });
  assert.deepEqual(storage.reads, [progress.STORAGE_KEY]);
  assert.deepEqual(storage.writes, []);
  assert.equal(storage.values.get(progress.STORAGE_KEY), saved);
  assert.equal(storage.values.get("another-service"), "keep");
  const empty = memoryStorage([["another-service", "keep"]]);
  assert.deepEqual(readStoredProgress(empty), { progress: createEmptyProgress(), state: "ready" });
  assert.deepEqual(empty.writes, []);
  assert.equal(empty.values.has(progress.STORAGE_KEY), false);
});

test("blocked, malformed and unsupported-schema reads preserve the original stored bytes", () => {
  const cases = [
    { raw: JSON.stringify(createEmptyProgress()), failures: { read: true }, expected: "unavailable" },
    { raw: "{broken JSON", failures: {}, expected: "corrupt" },
    { raw: JSON.stringify({ ...createEmptyProgress(), schema: 2 }), failures: {}, expected: "corrupt" },
  ];
  for (const { raw, failures, expected } of cases) {
    const storage = memoryStorage([[progress.STORAGE_KEY, raw], ["another-service", "keep"]], failures);
    assert.deepEqual(readStoredProgress(storage), { progress: createEmptyProgress(), state: expected });
    assert.deepEqual(storage.writes, []);
    assert.equal(storage.values.get(progress.STORAGE_KEY), raw);
    assert.equal(storage.values.get("another-service"), "keep");
  }
});

test("storage writes update only the event key and report quota failure without changing saved data", () => {
  const state = toggleCheck(createEmptyProgress(), "login-mask", true);
  const storage = memoryStorage([[progress.STORAGE_KEY, "previous"], ["another-service", "keep"]]);
  assert.equal(writeStoredProgress(storage, state), true);
  assert.deepEqual(storage.writes, [[progress.STORAGE_KEY, JSON.stringify(state)]]);
  assert.deepEqual(JSON.parse(storage.values.get(progress.STORAGE_KEY)), state);
  assert.equal(storage.values.get("another-service"), "keep");
  const blocked = memoryStorage([[progress.STORAGE_KEY, "previous"], ["another-service", "keep"]], { write: true });
  assert.equal(writeStoredProgress(blocked, state), false);
  assert.equal(blocked.values.get(progress.STORAGE_KEY), "previous");
  assert.equal(blocked.values.get("another-service"), "keep");
});

test("period labels distinguish SSR, upcoming, active, ended and imprecise boundary dates", () => {
  const startsOn = "2026-10-15", endsOn = "2026-11-03";
  const cases = [
    ["", { label: "일정 안내", tone: "neutral" }],
    ["2026-10-14", { label: "시작 예정", tone: "neutral" }],
    ["2026-10-15", { label: "시작일 · 시각 미공지", tone: "neutral" }],
    ["2026-10-29", { label: "공지 일정 진행 중", tone: "live" }],
    ["2026-11-03", { label: "종료일 · 시각 미공지", tone: "neutral" }],
    ["2026-11-04", { label: "공지 기간 종료", tone: "ended" }],
  ];
  for (const [today, expected] of cases) assert.deepEqual(periodStatus(today, startsOn, endsOn), expected);
  assert.deepEqual(periodStatus("2026-10-29", event.dropsStartsOn, event.dropsEndsOn), { label: "공지 기간 종료", tone: "ended" });
});

test("collapsed sections can resolve every existing group, reward and check fragment", () => {
  for (const group of groups) {
    assert.deepEqual(resolveRewardAnchor(`#group-${group.id}`), { groupId: group.id, targetId: `group-${group.id}` });
    for (const entry of group.entries) {
      assert.deepEqual(resolveRewardAnchor(`#reward-${entry.id}`), { groupId: group.id, targetId: `reward-${entry.id}` });
      for (const check of entry.checks) assert.deepEqual(resolveRewardAnchor(`#${check.id}`), { groupId: group.id, targetId: check.id });
    }
  }
});

test("fragment navigation accepts encoded targets and ignores unknown or malformed hashes", () => {
  assert.deepEqual(resolveRewardAnchor("#%72eward-bounty-final"), { groupId: "bounties", targetId: "reward-bounty-final" });
  for (const hash of ["", "#", "#unknown", "#reward-no-such-reward", "#%E0%A4%A", "#%ZZ"]) assert.equal(resolveRewardAnchor(hash), null);
});

test("English content preserves all groups, check IDs, types, assets and translated display fields", () => {
  assert.deepEqual(english.categoriesEn.map(item => item.id), categories.map(item => item.id));
  assert.deepEqual(english.groupsEn.map(group => group.id), groups.map(group => group.id));
  function structure(source) {
    return source.map(group => ({ id: group.id, category: group.category, entries: group.entries.map(entry => ({ id: entry.id, apparel: entry.apparel, checks: entry.checks.map(({ id, type }) => ({ id, type })) })) }));
  }
  assert.deepEqual(structure(english.groupsEn), structure(groups));
  for (const group of english.groupsEn) {
    for (const value of [group.title, group.description, ...group.entries.flatMap(entry => [entry.title, entry.detail, entry.tag, ...entry.checks.map(check => check.label)])].filter(Boolean)) {
      assert.equal(/[가-힣]/u.test(value), false, value);
      assert.ok(value.trim().length > 0);
    }
  }
  assert.deepEqual(Object.keys(english.imagesEn), Object.keys(images));
  for (const [id, image] of Object.entries(english.imagesEn)) {
    assert.deepEqual([image.src, image.width, image.height, image.kind, image.source], [images[id].src, images[id].width, images[id].height, images[id].kind, images[id].source]);
    assert.equal(/[가-힣]/u.test(image.title + (image.evidence ?? "")), false);
  }
});

test("language paths and progress stay compatible across both translated datasets", () => {
  assert.equal(getEventPath("ko"), event.path);
  assert.equal(getEventPath("en"), "/en" + event.path);
  assert.equal(getLocalizedEventData("ko").groups, groups);
  assert.equal(getLocalizedEventData("en").groups, english.groupsEn);
  const state = setApparelCount(toggleCheck(createEmptyProgress(), "own-caretaker", true), 12);
  const storage = memoryStorage();
  assert.equal(writeStoredProgress(storage, state), true);
  const restored = readStoredProgress(storage).progress;
  for (const language of ["ko", "en"]) {
    const available = new Set(getLocalizedEventData(language).groups.flatMap(group => group.entries.flatMap(entry => entry.checks.map(check => check.id))));
    assert.ok(restored.checkedIds.every(id => available.has(id)));
    assert.equal(summarizeProgress(restored).owned.current, 1);
    assert.equal(restored.apparelCount, 12);
  }
  assert.equal(storage.values.size, 1);
  assert.ok(storage.values.has(progress.STORAGE_KEY));
});

test("real checklist filtering searches Korean and English names in either display language", () => {
  const component = readFileSync(path.join(root, "src/features/division2/red-moon/reward-checklist.tsx"), "utf8");
  const start = component.indexOf("  const summary = summarizeProgress(progress);");
  const end = component.indexOf("  const stats = [", start);
  assert.ok(start > 0 && end > start);
  const compute = new Script(component.slice(start, end) + "\n({ visibleCount, ids: visibleGroups.flatMap(group => group.entries.flatMap(entry => entry.visibleChecks.map(check => check.id))) })");
  const state = toggleCheck(createEmptyProgress(), "own-caretaker", true);
  for (const language of ["ko", "en"]) {
    const evaluate = (query, category = "all", filter = "all") => compute.runInNewContext({ ...data, ...getLocalizedEventData(language), progress: state, query, category, filter, summarizeProgress, getRewardSearchText });
    assert.equal(evaluate("").visibleCount, 66);
    for (const term of ["관리자", "Caretaker", "Ｃａｒｅｔａｋｅｒ"]) assert.ok(evaluate(term).ids.includes("own-caretaker"));
    for (const term of ["리히텐베르크", "Lichtenberg"]) assert.equal(evaluate(term).visibleCount, 2);
    assert.equal(evaluate("Bound Slasher Mask").ids[0], "login-mask");
    assert.equal(evaluate("결박된 슬래셔 마스크").ids[0], "login-mask");
    assert.deepEqual(Array.from(evaluate("Caretaker", "owned", "checked").ids), ["own-caretaker"]);
    assert.equal(evaluate("Caretaker", "owned", "unchecked").visibleCount, 0);
    assert.equal(evaluate("no-such-reward-xyz").visibleCount, 0);
  }
});

test("English controls, status, sharing and dialog messages have complete localized copy", () => {
  const ko = getRewardCopy("ko"), en = getRewardCopy("en");
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ko).sort());
  function inspect(value) {
    if (typeof value === "string") assert.equal(/[가-힣]/u.test(value), false, value);
    else if (typeof value === "object" && value) Object.values(value).forEach(inspect);
  }
  inspect(en);
  assert.equal(en.filterAll, "All items");
  assert.equal(en.groupCount(1, 12), "Checked 1 / 12");
  assert.ok(en.visibleCount(66).includes("66"));
  assert.ok(en.imageLabel("Caretaker").includes("Caretaker"));
  assert.ok(ko.apparelError.includes("43"));
});

test("English schedule labels preserve Korean date boundaries and status tones", () => {
  const cases = [
    ["", "Event schedule", "neutral"], ["2026-10-14", "Upcoming", "neutral"],
    ["2026-10-15", "Start date · exact time not announced", "neutral"],
    ["2026-10-29", "Within announced dates", "live"],
    ["2026-11-03", "End date · exact time not announced", "neutral"],
    ["2026-11-04", "Announced period ended", "ended"],
  ];
  for (const [today, label, tone] of cases) {
    assert.deepEqual(periodStatus(today, event.startsOn, event.endsOn, "en"), { label, tone });
    assert.equal(periodStatus(today, event.startsOn, event.endsOn).tone, tone);
  }
});
