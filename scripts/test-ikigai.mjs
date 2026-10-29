import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
function moduleUrl(relative, replacements = {}) {
  let source = readFileSync(path.join(root, relative), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, JSON.stringify(to));
  return "data:text/javascript;base64," + Buffer.from(stripTypeScriptTypes(source, { mode: "strip" })).toString("base64");
}
const modelUrl = moduleUrl("src/features/discovery/ikigai/model.ts");
const { makeInitialState, normalizeState, activities, activityTags, needTags } = await import(modelUrl);
const translationsUrl = moduleUrl("src/features/discovery/ikigai/translations.ts", { '"./model"': modelUrl });
const { getIkigaiActivities, getIkigaiOptions, getIkigaiWizardCopy } = await import(translationsUrl);
const { matchActivities } = await import(moduleUrl("src/features/discovery/ikigai/match.ts", { '"./model"': modelUrl, '"./translations"': translationsUrl }));
const storage = await import(moduleUrl("src/features/discovery/ikigai/storage.ts", { '"./model"': modelUrl }));
const { STORAGE_KEY, readStoredState, writeStoredState, deleteStoredState, decodeStorageEvent } = storage;
const recommendationIds = state => matchActivities(state).map(item => item.activity.id);
function memoryStorage(initial = [], failure = {}) {
  const values = new Map(initial), writes = [], removals = [];
  return {
    values, writes, removals,
    getItem(key) { if (failure.read) throw new Error("blocked"); return values.get(key) ?? null; },
    setItem(key, value) { if (failure.write) throw new Error("quota"); writes.push([key, value]); values.set(key, value); },
    removeItem(key) { if (failure.remove) throw new Error("blocked"); removals.push(key); values.delete(key); },
  };
}

test("20 realistic candidates use known tags and a 20–60 minute experiment", () => {
  assert.equal(activities.length, 20);
  assert.equal(new Set(activities.map(item => item.id)).size, 20);
  for (const item of activities) {
    assert.ok(item.minutes >= 20 && item.minutes <= 60);
    assert.ok(item.experiment.length > 20 && item.question.length > 10);
    assert.ok(item.tags.length && item.tags.every(id => activityTags.some(tag => tag.id === id)));
    assert.ok(item.needs.length && item.needs.every(id => needTags.some(tag => tag.id === id)));
  }
});

test("unknown answers yield three explicit general exploration candidates without ability claims", () => {
  const state = makeInitialState(), result = matchActivities(state);
  assert.equal(result.length, 3);
  assert.equal(new Set(result.map(item => item.activity.id)).size, 3);
  assert.deepEqual(result, matchActivities(makeInitialState()));
  for (const item of result) {
    assert.equal(item.category, "explore");
    assert.equal(item.isExploration, true);
    assert.match(item.reasons.join(" "), /일반 탐색 후보/);
    for (const signal of Object.values(item.signals)) { assert.equal(signal.status, "unconfirmed"); assert.deepEqual(signal.evidence, []); }
    assert.equal("score" in item, false);
  }
});

test("selected tags and exploration goal materially change recommendations", () => {
  const state = { ...makeInitialState(), likes: ["game"], strengths: ["craft"] };
  assert.equal(recommendationIds({ ...state, goal: "enjoy" })[0], "game-guide");
  const strengthFirst = matchActivities({ ...state, goal: "strength" })[0];
  assert.ok(strengthFirst.activity.tags.includes("craft"));
  assert.equal(strengthFirst.category, "try");
  assert.notDeepEqual(recommendationIds({ ...state, likes: ["nature"], strengths: [] }), recommendationIds({ ...state, likes: ["game"], strengths: [] }));
});

test("a matching interest without direct experience is a learn candidate", () => {
  const result = matchActivities({ ...makeInitialState(), likes: ["game"] });
  assert.equal(result[0].activity.id, "game-guide");
  assert.equal(result[0].category, "learn");
  assert.equal(result[0].signals.strengths.status, "unconfirmed");
});

test("every displayed domain evidence comes from an actually selected matching tag", () => {
  const state = { ...makeInitialState(), likes: ["game", "express"], strengths: ["organize"], needs: ["beginners"] };
  const before = JSON.stringify(state);
  for (const item of matchActivities(state)) {
    for (const [domain, options, candidates] of [["likes", activityTags, item.activity.tags], ["strengths", activityTags, item.activity.tags], ["needs", needTags, item.activity.needs]]) {
      const expected = options.filter(option => state[domain].includes(option.id) && candidates.includes(option.id)).map(option => option.label);
      assert.deepEqual(item.signals[domain].evidence, expected);
    }
  }
  assert.equal(JSON.stringify(state), before);
  const results = matchActivities(state);
  results[0].activity.tags.push("invented");
  assert.equal(activities.some(activity => activity.tags.includes("invented")), false);
});

test("free-text notes are preserved but never silently interpreted as matching evidence", () => {
  const initial = makeInitialState();
  const withNotes = { ...initial, notes: { likes: "게임하기", strengths: "게임 공략을 잘 설명함", needs: "입문자", rewards: "게임으로 돈을 벌었음" } };
  assert.deepEqual(matchActivities(withNotes), matchActivities(initial));
  assert.deepEqual(normalizeState(withNotes).notes, withNotes.notes);
});

test("unknown or unwanted monetization never lowers candidate rank and self-report is qualified", () => {
  const state = { ...makeInitialState(), likes: ["game"], goal: "work" };
  const expected = recommendationIds(state);
  for (const rewards of ["experienced", "seen", "unknown", "not-interested"]) assert.deepEqual(recommendationIds({ ...state, rewards }), expected);
  const experienced = matchActivities({ ...state, rewards: "experienced" })[0].signals.rewards;
  assert.equal(experienced.status, "self-reported");
  assert.match(experienced.label, /전체 답변/);
  assert.match(experienced.evidence.join(" "), /별도 확인/);
  assert.equal(matchActivities({ ...state, rewards: "not-interested" })[0].signals.rewards.status, "not-needed");
  assert.equal(matchActivities({ ...state, rewards: "not-interested" })[0].questions.some(question => question.includes("비용")), false);
});

test("available time changes ordering while blank domains remain unconfirmed", () => {
  const state = makeInitialState();
  const short = matchActivities({ ...state, time: "short" });
  const medium = matchActivities({ ...state, time: "medium" });
  const long = matchActivities({ ...state, time: "long" });
  assert.ok(short.every(item => item.activity.minutes <= 30));
  assert.equal(medium[0].activity.minutes, 40);
  assert.equal(long[0].activity.minutes, 60);
  assert.notDeepEqual(short.map(item => item.activity.id), long.map(item => item.activity.id));
  assert.equal(long[0].signals.likes.status, "unconfirmed");
});

test("state round-trip deduplicates selected IDs and creates fully independent snapshots", () => {
  const initial = makeInitialState();
  const candidate = { ...initial, likes: ["game", "game"], experiments: { "game-guide": { tried: true, enjoyed: "yes", again: "unsure", helped: "unknown", note: "다음에 설명을 줄이기" } }, savedAt: "2026-10-29T00:00:00.000Z" };
  const restored = normalizeState(JSON.parse(JSON.stringify(candidate)));
  assert.deepEqual(restored.likes, ["game"]);
  assert.equal(restored.savedAt, candidate.savedAt);
  restored.notes.likes = "changed";
  restored.experiments["game-guide"].note = "changed";
  restored.likes.push("tech");
  assert.equal(candidate.notes.likes, "");
  assert.equal(candidate.experiments["game-guide"].note, "다음에 설명을 줄이기");
  assert.deepEqual(makeInitialState(), initial);
});

test("malformed state, unknown IDs, oversized notes and invalid timestamps are rejected", () => {
  const base = makeInitialState();
  const invalid = [null, [], {}, { state: base }, { ...base, schema: 2 }, { ...base, step: -1 }, { ...base, step: 6 }, { ...base, step: 1.5 }, { ...base, view: "other" }, { ...base, goal: "other" }, { ...base, time: "other" }, { ...base, rewards: "other" }, { ...base, likes: ["missing"] }, { ...base, strengths: [42] }, { ...base, needs: "beginners" }, { ...base, needs: ["game"] }, { ...base, notes: { ...base.notes, likes: "x".repeat(501) } }, { ...base, savedAt: "invalid" }, { ...base, savedAt: "2026-02-30T00:00:00.000Z" }, { ...base, experiments: { missing: {} } }, { ...base, experiments: { "game-guide": { tried: true, enjoyed: "yes", again: "yes", helped: "yes", note: "x".repeat(501) } } }];
  for (const value of invalid) assert.throws(() => normalizeState(value));
  assert.equal(normalizeState({ ...base, notes: { ...base.notes, likes: "x".repeat(500) } }).notes.likes.length, 500);
});

test("storage restores without writing and explicit deletion touches only this service key", () => {
  const value = { ...makeInitialState(), likes: ["game"] }, raw = JSON.stringify(value);
  const target = memoryStorage([[STORAGE_KEY, raw], ["other-service", "keep"]]);
  assert.deepEqual(readStoredState(target), { data: value, state: "ready" });
  assert.deepEqual(target.writes, []);
  assert.equal(writeStoredState(target, value), true);
  assert.equal(deleteStoredState(target), true);
  assert.deepEqual(target.removals, [STORAGE_KEY]);
  assert.equal(target.values.get("other-service"), "keep");
  assert.deepEqual(readStoredState(target), { data: makeInitialState(), state: "ready" });
});

test("corrupt records are preserved by reads AND attempted automatic writes", () => {
  for (const raw of ["{broken", JSON.stringify({ ...makeInitialState(), schema: 2 }), JSON.stringify({ ...makeInitialState(), likes: ["missing"] })]) {
    const target = memoryStorage([[STORAGE_KEY, raw]]);
    assert.equal(readStoredState(target).state, "corrupt");
    assert.equal(writeStoredState(target, makeInitialState()), false);
    assert.deepEqual(target.writes, []);
    assert.equal(target.values.get(STORAGE_KEY), raw);
    assert.equal(deleteStoredState(target), true);
    assert.equal(writeStoredState(target, makeInitialState()), true);
  }
});

test("blocked storage and quota failures return failure without damaging previous snapshots", () => {
  const raw = JSON.stringify(makeInitialState());
  const readBlocked = memoryStorage([[STORAGE_KEY, raw]], { read: true });
  assert.equal(readStoredState(readBlocked).state, "unavailable");
  assert.equal(writeStoredState(readBlocked, makeInitialState()), false);
  const full = memoryStorage([[STORAGE_KEY, raw]], { write: true });
  assert.equal(writeStoredState(full, { ...makeInitialState(), likes: ["game"] }), false);
  assert.equal(full.values.get(STORAGE_KEY), raw);
  assert.equal(deleteStoredState(memoryStorage([], { remove: true })), false);
  const invalid = memoryStorage();
  assert.equal(writeStoredState(invalid, { ...makeInitialState(), likes: ["missing"] }), false);
  assert.deepEqual(invalid.writes, []);
});

test("storage events restore snapshots, handle deletion/clear, and ignore other services", () => {
  const value = { ...makeInitialState(), goal: "enjoy" };
  assert.deepEqual(decodeStorageEvent({ key: STORAGE_KEY, newValue: JSON.stringify(value) }), { data: value, state: "ready" });
  assert.deepEqual(decodeStorageEvent({ key: STORAGE_KEY, newValue: null }), { data: makeInitialState(), state: "ready" });
  assert.deepEqual(decodeStorageEvent({ key: null, newValue: null }), { data: makeInitialState(), state: "ready" });
  assert.equal(decodeStorageEvent({ key: "other-service", newValue: "broken" }), null);
  assert.equal(decodeStorageEvent({ key: STORAGE_KEY, newValue: "broken" }).state, "corrupt");
});

test("all English options and 20 activities are translated without changing their matching data", () => {
  const koOptions = getIkigaiOptions(), enOptions = getIkigaiOptions("en");
  for (const field of Object.keys(koOptions)) {
    assert.deepEqual(enOptions[field].map(option => option.id), koOptions[field].map(option => option.id));
    for (const option of enOptions[field]) {
      assert.ok(option.label.length > 0);
      assert.doesNotMatch(JSON.stringify(option), /[가-힣]/);
    }
  }
  const ko = getIkigaiActivities(), en = getIkigaiActivities("en");
  assert.deepEqual(ko, activities);
  assert.equal(en.length, 20);
  assert.deepEqual(en.map(({ id, tags, needs, minutes }) => ({ id, tags, needs, minutes })), ko.map(({ id, tags, needs, minutes }) => ({ id, tags, needs, minutes })));
  for (const [index, activity] of en.entries()) {
    for (const field of ["title", "description", "experiment", "question"]) {
      assert.ok(activity[field].length > 10);
      assert.notEqual(activity[field], ko[index][field]);
      assert.doesNotMatch(activity[field], /[가-힣]/);
    }
  }
  const copy = getIkigaiWizardCopy("en");
  assert.equal(copy.steps.length, 6);
  assert.equal(copy.headings.length, 6);
  assert.equal(copy.help.length, 6);
  assert.doesNotMatch(JSON.stringify(copy), /[가-힣]/);
});

test("English preserves recommendation IDs, order, categories, and evidence meaning across goals and time", () => {
  const choices = [
    {}, { likes: ["game"], strengths: ["craft"], needs: ["beginners"] },
    { likes: ["nature", "research"], strengths: ["organize"], needs: ["environment", "local"] },
    { likes: ["care", "together", "tech"], needs: ["accessibility", "learning"] },
  ];
  const koOptions = getIkigaiOptions(), enOptions = getIkigaiOptions("en");
  for (const goal of ["enjoy", "strength", "work", "unknown"]) for (const time of ["short", "medium", "long", "unknown"]) for (const choice of choices) {
    const state = { ...makeInitialState(), ...choice, goal, time };
    const ko = matchActivities(state), en = matchActivities(state, "en");
    const structure = items => items.map(({ activity, category, isExploration, signals }) => ({ id: activity.id, category, isExploration, statuses: Object.values(signals).map(signal => signal.status) }));
    assert.deepEqual(structure(en), structure(ko));
    assert.doesNotMatch(JSON.stringify(en), /[가-힣]/);
    for (let index = 0; index < en.length; index++) for (const domain of ["likes", "strengths", "needs"]) {
      const field = domain === "needs" ? "needTags" : "activityTags";
      const selectedIds = koOptions[field].filter(option => ko[index].signals[domain].evidence.includes(option.label)).map(option => option.id);
      assert.deepEqual(en[index].signals[domain].evidence, enOptions[field].filter(option => selectedIds.includes(option.id)).map(option => option.label));
    }
  }
});

test("English reward text remains qualified self-report with the same neutral ranking", () => {
  const state = { ...makeInitialState(), likes: ["game"], goal: "work" };
  const expected = recommendationIds(state);
  for (const rewards of ["experienced", "seen", "unknown", "not-interested"]) {
    const result = matchActivities({ ...state, rewards }, "en");
    assert.deepEqual(result.map(item => item.activity.id), expected);
    assert.doesNotMatch(JSON.stringify(result), /[가-힣]/);
    if (rewards === "experienced" || rewards === "seen") {
      assert.equal(result[0].signals.rewards.status, "self-reported");
      assert.match(result[0].signals.rewards.evidence.join(" "), /specific activity still need/);
    }
  }
});

test("switching display language shares the exact storage schema and preserves user-written text", () => {
  const state = {
    ...makeInitialState(), step: 5, view: "results", likes: ["game"],
    notes: { likes: "내가 직접 쓴 답변", strengths: "A note I wrote", needs: "번역하지 않기", rewards: "Keep this as written" },
    experiments: { "game-guide": { tried: true, enjoyed: "yes", again: "unsure", helped: "unknown", note: "사용자의 후기 · my reflection" } },
    savedAt: "2026-10-30T00:00:00.000Z",
  };
  const before = JSON.stringify(state), target = memoryStorage();
  assert.equal(STORAGE_KEY, "developer-john:discovery:ikigai:v1");
  assert.equal(writeStoredState(target, state), true);
  const restored = readStoredState(target).data;
  matchActivities(restored, "en");
  assert.deepEqual(restored, state);
  assert.equal(JSON.stringify(state), before);
  assert.equal("language" in restored, false);
  assert.equal(target.values.size, 1);
  assert.deepEqual(matchActivities(restored, "en").map(item => item.activity.id), recommendationIds(state));
  assert.deepEqual(normalizeState(JSON.parse(target.values.get(STORAGE_KEY))), state);
});
