import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import babel from "next/dist/compiled/babel/core.js";
import presetTypeScript from "next/dist/compiled/babel/preset-typescript.js";
import presetReact from "next/dist/compiled/babel/preset-react.js";
import transformModules from "next/dist/compiled/babel/plugin-transform-modules-commonjs.js";

const feature = "src/features/division2/battle-for-brooklyn";
const collection = "battle-for-brooklyn-2025";
const javascript = new Map();

function loadModule(relative, imports = {}, globals = {}) {
  if (!javascript.has(relative)) {
    javascript.set(relative, babel.transformSync(readFileSync(new URL(`../${relative}`, import.meta.url), "utf8"), {
      babelrc: false, configFile: false, filename: relative,
      presets: [presetTypeScript, [presetReact, { runtime: "automatic" }]], plugins: [transformModules],
    }).code);
  }
  const module = { exports: {} };
  runInNewContext(javascript.get(relative), {
    ...globals, module, exports: module.exports,
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unexpected import ${name} in ${relative}`);
      return imports[name];
    },
  }, { filename: relative });
  return module.exports;
}

function createBrowser() {
  const records = new Map();
  const downloads = [];
  const confirmations = [];
  const window = {
    localStorage: {
      getItem: key => records.get(key) ?? null,
      setItem: (key, value) => records.set(key, value),
    },
    addEventListener() {},
    removeEventListener() {},
    confirm(message) { confirmations.push(message); return true; },
    setTimeout() {},
  };
  let downloadBlob;
  const globals = {
    TextEncoder, Blob, window,
    URL: {
      createObjectURL(blob) { downloadBlob = blob; return "blob:checklist"; },
      revokeObjectURL() {},
    },
    document: {
      createElement(type) {
        assert.equal(type, "a");
        return { click() { downloads.push({ filename: this.download, blob: downloadBlob }); } };
      },
    },
  };
  return { globals, records, downloads, confirmations };
}

const noop = () => {};
const jsx = (type, props) => ({ type, props: props ?? {} });
const runtime = { Fragment: Symbol("Fragment"), jsx, jsxs: jsx };
const styles = { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };

// Exercise the production component's state and event handlers without opening a browser.
function mount(browser, language, guide) {
  const slots = [];
  let cursor = 0;
  let dirty = true;
  let pendingEffects = [];
  let tree;
  const dialog = {
    open: false,
    showModal() { this.open = true; },
  };

  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { value: typeof initial === "function" ? initial() : initial };
      const slot = slots[index];
      return [slot.value, value => {
        const next = typeof value === "function" ? value(slot.value) : value;
        if (!Object.is(next, slot.value)) { slot.value = next; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
    useMemo(factory, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (previous && deps.length === previous.deps.length && deps.every((dep, i) => Object.is(dep, previous.deps[i]))) return previous.value;
      const value = factory();
      slots[index] = { deps, value };
      return value;
    },
    useEffect(callback, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (previous && deps && deps.length === previous.deps?.length && deps.every((dep, i) => Object.is(dep, previous.deps[i]))) return;
      const slot = { deps };
      slots[index] = slot;
      pendingEffects.push(() => { previous?.cleanup?.(); slot.cleanup = callback(); });
    },
  };

  const rewards = loadModule(`${feature}/rewards.ts`, {}, browser.globals);
  const division2 = "src/features/division2";
  const prefix = guide?.collection ?? "brooklyn";
  const storageKey = `developer-john:division2:${guide?.collection ?? collection}:v1`;
  const copy = loadModule(`${division2}/central-park/copy.ts`, {}, browser.globals);
  const shared = loadModule(`${division2}/reward-checklist.tsx`, {
    react, "react/jsx-runtime": runtime,
    "./checklist-progress": loadModule(`${division2}/checklist-progress.ts`, {}, browser.globals),
    "next/image": { __esModule: true, default: props => jsx("img", props) },
    "./central-park/central-park.module.css": styles,
    "./central-park/copy": copy,
    "./reward-checklist.module.css": styles,
  }, browser.globals);
  const { BrooklynChecklist } = loadModule(`${feature}/reward-checklist.tsx`, {
    "react/jsx-runtime": runtime, "./rewards": rewards, "../reward-checklist": shared,
  }, browser.globals);

  function render(node) {
    if (Array.isArray(node)) return node.map(render);
    if (node === null || typeof node !== "object") return node;
    if (typeof node.type === "function") return render(node.type(node.props));
    if (node.props.ref) node.props.ref.current = node.type === "dialog" ? dialog : { focus: noop, click: noop };
    return { ...node, children: render(node.props.children) };
  }

  function flush() {
    let renders = 0;
    while (dirty) {
      assert.ok(++renders < 20, "Checklist must settle without an effect loop");
      cursor = 0;
      dirty = false;
      pendingEffects = [];
      tree = render(guide ? jsx(shared.RewardChecklist, { ...guide, language }) : BrooklynChecklist({ language }));
      pendingEffects.forEach(run => run());
    }
  }

  function elements(predicate, subtree = tree) {
    const matches = [];
    function walk(node) {
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (node === null || typeof node !== "object") return;
      if (predicate(node)) matches.push(node);
      walk(node.children);
    }
    walk(subtree);
    return matches;
  }

  function element(predicate, subtree = tree) {
    const matches = elements(predicate, subtree);
    assert.equal(matches.length, 1, "Expected a unique checklist element");
    return matches[0];
  }

  function change(node, currentTarget) {
    const result = node.props.onChange({ currentTarget, target: currentTarget });
    flush();
    return result;
  }

  function rewardCard(id) { return element(node => node.props["data-reward"] === id); }
  function openImage(id) {
    const button = element(node => node.props["aria-haspopup"] === "dialog", rewardCard(id));
    button.props.onClick({ currentTarget: { focus: noop } });
    flush();
    assert.equal(dialog.open, true);
    return element(node => node.type === "dialog");
  }
  function checkbox(id) { return element(node => node.props.type === "checkbox", rewardCard(id)); }
  function toggle(id, checked = true) { change(checkbox(id), { checked }); }
  function select(name, value) { change(element(node => node.type === "select" && node.props.name === name), { value }); }
  function search(value) { change(element(node => node.props.type === "search"), { value }); }
  function visibleIds() { return elements(node => node.props["data-reward"]).map(node => node.props["data-reward"]); }
  function groupSection(id) { return element(node => node.props["data-category"] === id); }
  function groupCount(id) {
    const heading = element(node => node.type === "h3", groupSection(id));
    return element(node => node.type === "span", heading).props.children.join("");
  }
  function progressBar(tier) {
    return element(node => node.type === "progress", element(node => node.props["data-progress"] === tier)).props;
  }
  function backupSection() { return element(node => node.props.id === `${prefix}-backup`); }
  function backupButton(action) {
    return element(node => node.type === "button" && node.props.children === copy.checklistCopy[language][action], backupSection());
  }
  async function importFile(text) {
    await change(element(node => node.props.type === "file", backupSection()), {
      value: "backup.json", files: [{ size: Buffer.byteLength(text), text: async () => text }],
    });
    flush();
  }

  flush();
  return { elements, element, rewardCard, openImage, checkbox, toggle, select, search, visibleIds, groupSection, groupCount, progressBar, backupButton, importFile, storageKey, rewards };
}

test("both languages show text-only rewards and credit pictured rewards in previews", () => {
  const textOnlyIds = new Set(["huntsman", "catalyst", "smart-cover-precision", "smart-cover-fortified"]);
  const captureNames = new Map([
    ["connect-brooklyn-bats-cap", "브루클린 배츠 캡모자"],
    ["connect-brooklyn-bats-jersey", "브루클린 배츠 저지"],
    ["connect-brooklyn-bats-weapon-skin", "브루클린 배츠 무기 스킨"],
    ["deluxe-canvas-outfit", "캔버스 의상"],
    ["deluxe-canvas-weapon-skin", "캔버스 무기 스킨"],
  ]);
  const canvasVideos = [
    ["deluxe-canvas-outfit", 90],
    ["deluxe-canvas-weapon-skin", 68],
  ];
  for (const language of ["ko", "en"]) {
    const checklist = mount(createBrowser(), language);
    const { groups, rewards } = checklist.rewards;
    const core = rewards.filter(reward => groups.some(group => group.id === reward.group && group.tier === "core"));
    for (const id of textOnlyIds) {
      const card = checklist.rewardCard(id);
      assert.equal(checklist.elements(node => node.type === "img" || node.props["aria-haspopup"] === "dialog", card).length, 0, id);
      assert.equal(checklist.checkbox(id).props.checked, false);
    }
    const pictured = [
      ...core.filter(reward => !textOnlyIds.has(reward.id)),
      ...Array.from(captureNames.keys(), id => rewards.find(reward => reward.id === id)),
    ];
    for (const reward of pictured) {
      const { id } = reward;
      const image = checklist.element(node => node.type === "img", checklist.rewardCard(id));
      assert.equal(image.props.src, `/games/the-division-2/${collection}/${id}.webp`);
      const file = readFileSync(new URL(`../public${image.props.src}`, import.meta.url));
      assert.equal(file.toString("ascii", 8, 12), "WEBP");
      const preview = checklist.openImage(id);
      const previewImage = checklist.element(node => node.type === "img", preview);
      assert.equal(previewImage.props.src, image.props.src);
      assert.equal(previewImage.props.alt, reward.image.caption?.[language] ?? reward.name[language]);
      if (captureNames.has(id)) {
        assert.equal(reward.name.ko, captureNames.get(id));
        const credit = language === "ko" ? "사용자 제공 인게임 캡처" : "User-provided in-game capture";
        checklist.element(node => node.type === "span" && Array.isArray(node.props.children) && node.props.children.includes(credit), preview);
        assert.equal(checklist.elements(node => node.type === "a", preview).length, 0);
        assert.equal(checklist.checkbox(id).props.checked, false);
      } else {
        checklist.element(node => node.type === "a" && node.props.href === reward.image.source.href, preview);
      }
    }
    for (const [id, seconds] of canvasVideos) {
      const href = `https://www.youtube.com/watch?v=zHwR3fRTV8k&t=${seconds}s`;
      checklist.element(node => node.type === "a" && node.props.href === href, checklist.rewardCard(id));
    }
    assert.equal(checklist.progressBar("core").value, 0);
  }
});

test("both languages show the skills section first in the core rewards", () => {
  for (const language of ["ko", "en"]) {
    const checklist = mount(createBrowser(), language);
    const core = checklist.element(node => node.type === "section" && node.props["aria-labelledby"] === "brooklyn-core-title");
    const categories = checklist.elements(node => node.props["data-category"], core);
    assert.deepEqual(categories.map(node => node.props["data-category"]), ["skills", "ash-chest", "gear", "hunter-masks"]);
  }
});

test("all 14 core rewards are grouped and the Ash chest items can be checked separately", () => {
  const checklist = mount(createBrowser(), "en");
  const { groups, rewards } = checklist.rewards;
  const coreCounts = [["weapons", 1], ["gear", 1], ["weapon-skins", 1], ["skills", 2], ["hunter-masks", 9]];
  assert.deepEqual(new Set(groups.filter(group => group.tier === "core").map(group => group.id)), new Set(coreCounts.map(([id]) => id)));
  for (const [id, count] of coreCounts) {
    const ids = rewards.filter(reward => reward.group === id).map(reward => reward.id);
    assert.equal(ids.length, count);
    checklist.select("category", id);
    assert.deepEqual(checklist.visibleIds(), [...ids]);
    if (id === "weapons" || id === "weapon-skins") {
      const chest = checklist.groupSection("ash-chest");
      checklist.element(node => node.type === "p" && node.props.children === checklist.rewards.ashChest.note.en, chest);
      continue;
    }
    const section = checklist.groupSection(id);
    const cards = checklist.elements(node => node.props["data-reward"], section);
    assert.deepEqual(cards.map(card => card.props["data-reward"]), [...ids]);
    assert.equal(checklist.groupCount(id), `0 / ${count}`);
  }
  checklist.select("category", "all");
  assert.equal(new Set(rewards.map(reward => reward.id)).size, rewards.length);
  assert.equal(checklist.progressBar("core").max, 14);
  assert.equal(checklist.progressBar("core").value, 0);
  assert.equal(checklist.progressBar("bonus").value, 0);
  const hunterTimes = { lumen: 136, merry: 299, cipher: 410, craver: 491, conqueror: 573, redtail: 729, tracker: 968, necronos: 1074 };
  for (const [hunter, seconds] of Object.entries(hunterTimes)) {
    checklist.element(node => node.type === "a" && node.props.href === `https://www.youtube.com/watch?v=dPvGGc4YRn0&t=${seconds}s`, checklist.rewardCard(`hunter-${hunter}`));
  }
  const phoenix = checklist.rewardCard("hunter-phoenix");
  checklist.element(node => node.type === "p" && typeof node.props.children === "string" && node.props.children.startsWith("Permanent reward"), phoenix);
  checklist.element(node => node.type === "a" && node.props.href === "https://youtu.be/nnqDtvg3NjE", phoenix);
  const chest = checklist.groupSection("ash-chest");
  assert.equal(chest.props.id, "brooklyn-ash-chest");
  assert.deepEqual(checklist.elements(node => node.props["data-reward"], chest).map(node => node.props["data-reward"]), ["huntsman", "hunter-of-hunters"]);
  checklist.element(node => node.type === "p" && node.props.children === checklist.rewards.ashChest.note.en, chest);
  checklist.element(node => node.type === "a" && node.props.href === checklist.rewards.ashChest.video.href, chest);
  assert.equal(checklist.groupCount("ash-chest"), "0 / 2");
  checklist.toggle("huntsman");
  assert.equal(checklist.checkbox("hunter-of-hunters").props.checked, false);
  assert.equal(checklist.progressBar("core").value, 1);
  assert.equal(checklist.groupCount("ash-chest"), "1 / 2");
  checklist.select("status", "acquired");
  assert.deepEqual(checklist.visibleIds(), ["huntsman"]);
  assert.equal(checklist.groupCount("ash-chest"), "1 / 2");
  checklist.select("category", "weapon-skins");
  assert.deepEqual(checklist.visibleIds(), []);
  assert.equal(checklist.elements(node => node.props.id === "brooklyn-ash-chest").length, 0);
  checklist.select("category", "all");
  checklist.select("status", "all");
  checklist.toggle("hunter-of-hunters");
  assert.equal(checklist.progressBar("core").value, 2);
  assert.equal(checklist.progressBar("bonus").value, 0);
  for (const group of groups.filter(group => group.tier === "expired")) {
    assert.equal(checklist.elements(node => node.props.type === "checkbox", checklist.groupSection(group.id)).length, 0);
  }
});

test("checklist reloads both languages from one isolated key and filters by category, name and status", () => {
  const browser = createBrowser();
  const centralParkKey = "developer-john:division2:echoes-of-central-park-2026:v1";
  browser.records.set(centralParkKey, "previous campaign data");
  const korean = mount(browser, "ko");
  assert.equal(korean.checkbox("huntsman").props.checked, false);
  korean.toggle("huntsman");
  const english = mount(browser, "en");
  assert.equal(english.checkbox("huntsman").props.checked, true);
  assert.equal(english.checkbox("hunter-of-hunters").props.checked, false);
  assert.ok(browser.records.has(english.storageKey));
  assert.equal(browser.records.get(centralParkKey), "previous campaign data");

  const huntsman = english.rewards.rewards.find(reward => reward.id === "huntsman");
  english.select("category", huntsman.group);
  english.select("status", "acquired");
  assert.deepEqual(english.visibleIds(), ["huntsman"]);
  english.select("status", "pending");
  english.search("Huntsman");
  assert.deepEqual(english.visibleIds(), []);
  english.select("status", "all");
  assert.deepEqual(english.visibleIds(), ["huntsman"]);
  english.toggle("huntsman", false);
  assert.equal(mount(browser, "ko").checkbox("huntsman").props.checked, false);
  english.select("category", "all");
  english.search("Danver's Network");
  assert.deepEqual(english.visibleIds(), ["danvers-network", "brooklyn-archivist-merit"]);
});

test("downloaded backup restores checks in another session and rejects a foreign DLC backup", async () => {
  const source = createBrowser();
  const korean = mount(source, "ko");
  korean.toggle("huntsman");
  korean.toggle("hunter-of-hunters");
  korean.backupButton("export").props.onClick();
  assert.equal(source.downloads.length, 1);
  const backup = source.downloads[0];
  assert.equal(backup.filename, `${collection}-backup.json`);
  const raw = await backup.blob.text();
  const data = JSON.parse(raw);
  assert.deepEqual(data, { schemaVersion: 1, collection, checked: ["huntsman", "hunter-of-hunters"] });

  const destination = createBrowser();
  const english = mount(destination, "en");
  const { groups, rewards } = english.rewards;
  const bonusGroup = groups.find(group => group.tier === "bonus");
  const bonusReward = rewards.find(reward => reward.group === bonusGroup.id);
  english.toggle(bonusReward.id);
  assert.equal(english.progressBar("bonus").value, 1);
  assert.equal(english.progressBar("core").value, 0);
  english.search("no such reward");
  await english.importFile(raw);
  assert.equal(destination.confirmations.length, 1);
  assert.equal(english.progressBar("core").value, 2);
  assert.equal(english.progressBar("bonus").value, 0);
  assert.equal(english.visibleIds().length, rewards.length);
  assert.equal(mount(destination, "ko").checkbox("hunter-of-hunters").props.checked, true);
  await english.importFile(JSON.stringify({ ...data, collection: "echoes-of-central-park-2026", checked: [] }));
  await english.importFile(JSON.stringify({ ...data, checked: [false] }));
  assert.equal(destination.confirmations.length, 1);
  assert.equal(english.progressBar("core").value, 2);
  assert.equal(destination.records.get(english.storageKey), raw);
});

test("D.C. and New York use independent progress, with bilingual checks and portable backups", async () => {
  const division2 = "src/features/division2";
  const base = {
    collection: "base-game-2019", name: "Base game",
    sections: loadModule(`${division2}/base-game/rewards.ts`).baseGameSections,
  };
  const newYork = {
    collection: "warlords-of-new-york-2020", name: "Warlords of New York",
    sections: loadModule(`${division2}/warlords-of-new-york/rewards.ts`).warlordsSections,
  };
  const browser = createBrowser();
  const dc = mount(browser, "ko", base);
  const ny = mount(browser, "en", newYork);
  for (const [page, core, bonus] of [[dc, 15, 4], [ny, 19, 2]]) {
    assert.equal(page.progressBar("core").max, core);
    assert.equal(page.progressBar("bonus").max, bonus);
    assert.equal(page.progressBar("core").value, 0);
    assert.equal(new Set(page.visibleIds()).size, core + bonus);
  }
  dc.select("category", "ivory-chest");
  assert.deepEqual(dc.visibleIds(), ["shield-splinterer", "ivory-weapon-skin", "hunters-axe"]);
  dc.toggle("shield-splinterer");
  assert.equal(mount(browser, "en", base).checkbox("shield-splinterer").props.checked, true);
  assert.equal(ny.progressBar("core").value, 0);
  ny.search("Vivian Conley");
  assert.deepEqual(ny.visibleIds(), ["burn-sticky-bomb"]);
  ny.toggle("burn-sticky-bomb");
  ny.select("status", "acquired");
  assert.deepEqual(ny.visibleIds(), ["burn-sticky-bomb"]);
  assert.equal(mount(browser, "ko", newYork).checkbox("burn-sticky-bomb").props.checked, true);
  assert.notEqual(dc.storageKey, ny.storageKey);

  ny.backupButton("export").props.onClick();
  const backup = browser.downloads[0];
  assert.equal(backup.filename, `${newYork.collection}-backup.json`);
  const raw = await backup.blob.text();
  const restored = createBrowser();
  await mount(restored, "ko", base).importFile(raw);
  assert.equal(restored.confirmations.length, 0);
  const koreanNewYork = mount(restored, "ko", newYork);
  await koreanNewYork.importFile(raw);
  assert.equal(restored.confirmations.length, 1);
  assert.equal(koreanNewYork.progressBar("core").value, 1);
  assert.equal(koreanNewYork.checkbox("burn-sticky-bomb").props.checked, true);
});
