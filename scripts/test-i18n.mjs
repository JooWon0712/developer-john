import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import babel from "next/dist/compiled/babel/core.js";
import presetTypeScript from "next/dist/compiled/babel/preset-typescript.js";
import presetReact from "next/dist/compiled/babel/preset-react.js";
import transformModules from "next/dist/compiled/babel/plugin-transform-modules-commonjs.js";

function moduleUrl(relative, replacements = {}) {
  let source = readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, JSON.stringify(to));
  return "data:text/javascript;base64," + Buffer.from(stripTypeScriptTypes(source)).toString("base64");
}
const { getLanguage, getBasePath, localizePath } = await import(moduleUrl("src/lib/i18n.ts"));

const centralParkPath = "/workspace/game/the-division-2/echoes-of-central-park-2026";
const paths = ["/", "/workspace", "/privacy", "/projects", "/workspace/game/the-division-2", "/workspace/game/the-division-2/red-moon-unleashed-2026", centralParkPath, "/workspace/tools/nas-desktop-app", "/workspace/tools/pc-internet-monitor", "/workspace/tools/codex-usage-overlay", "/discovery/ikigai", "/missing-page"];
const centralParkRewardsUrl = moduleUrl("src/features/division2/central-park/rewards.ts");

function guideModuleUrl(eventUrl) {
  return moduleUrl("src/features/division2/event-guides.ts", {
    '"./central-park/rewards"': centralParkRewardsUrl,
    '"./red-moon/event"': eventUrl,
  });
}

test("every page switches language reversibly without duplicating the English prefix", () => {
  for (const path of paths) {
    const english = path === "/" ? "/en" : `/en${path}`;
    assert.equal(localizePath(path, "en"), english);
    assert.equal(localizePath(english, "ko"), path);
    assert.equal(localizePath(english, "en"), english);
    assert.equal(localizePath(path, "ko"), path);
    assert.equal(getBasePath(english), path);
  }
});

test("English home and exact locale segments are recognized without matching ordinary route names", () => {
  for (const path of ["/en", "/en/", "/en/workspace", "/en?ref=home#intro"]) assert.equal(getLanguage(path), "en");
  for (const path of ["/", "/workspace", "/english", "/enough/workspace"]) assert.equal(getLanguage(path), "ko");
  assert.equal(localizePath("/en/", "ko"), "/");
  assert.equal(localizePath("/en/", "en"), "/en");
});

test("language changes preserve queries, encoded values and exact reward fragments", () => {
  const suffix = "?view=unchecked&name=%EB%A0%88%EB%93%9C+%EB%AC%B8#reward-mask-houndsman";
  const route = "/workspace/game/the-division-2/red-moon-unleashed-2026";
  assert.equal(localizePath(route + suffix, "en"), `/en${route}${suffix}`);
  assert.equal(localizePath(`/en${route}${suffix}`, "ko"), route + suffix);
  assert.equal(localizePath("/?source=nav#intro", "en"), "/en?source=nav#intro");
  assert.equal(getBasePath(`/en${route}${suffix}`), route);
});

test("Division 2 lists the DLC release and Red Moon event with localized workspace routes", async () => {
  const brandUrl = moduleUrl("src/data/brand.ts");
  const desktopToolsUrl = moduleUrl("src/features/desktop-tools/tools.ts");
  const eventUrl = moduleUrl("src/features/division2/red-moon/event.ts");
  const { services, serviceCategories } = await import(moduleUrl("src/data/catalog.ts", { '"@/data/brand"': brandUrl, '"@/features/desktop-tools/tools"': desktopToolsUrl }));
  const { division2Paths, division2EventGuides } = await import(guideModuleUrl(eventUrl));
  const service = services.find(item => item.id === "the-division-2");
  assert.equal(service.status, "ready");
  assert.equal(service.href, "/workspace/game/the-division-2");
  assert.equal(serviceCategories.find(item => item.id === service.category).pathPrefix, "/workspace/game");
  assert.deepEqual(division2EventGuides.map(guide => guide.id), ["echoes-of-central-park-2026", "red-moon-unleashed-2026"]);
  const [dlc, redMoon] = division2EventGuides;
  assert.equal(dlc.kind, "dlc");
  assert.equal(dlc.paths.ko, centralParkPath);
  assert.equal(dlc.releasedOn, "2026-11-03");
  assert.ok(!Object.hasOwn(dlc, "endsOn"));
  assert.equal(redMoon.kind, "event");
  assert.equal(redMoon.startsOn, "2026-10-15");
  assert.equal(redMoon.endsOn, "2026-11-03");
  for (const language of ["ko", "en"]) {
    const indexPath = localizePath(service.href, language);
    assert.equal(division2Paths[language], indexPath);
    assert.ok(readFileSync(new URL(`../src/app${indexPath}/page.tsx`, import.meta.url), "utf8").length > 0);
    for (const guide of division2EventGuides) {
      const eventPath = guide.paths[language];
      assert.ok(eventPath.startsWith(`${indexPath}/`));
      assert.equal(localizePath(guide.paths.ko, language), eventPath);
      assert.ok(readFileSync(new URL(`../src/app${eventPath}/page.tsx`, import.meta.url), "utf8").length > 0);
    }
  }
});

test("every ready service has a category, translated content and both page routes", async () => {
  const toolsUrl = moduleUrl("src/features/desktop-tools/tools.ts");
  const { services, serviceCategories, getLocalizedServices } = await import(moduleUrl("src/data/catalog.ts", {
    '"@/data/brand"': moduleUrl("src/data/brand.ts"),
    '"@/features/desktop-tools/tools"': toolsUrl,
  }));
  const { desktopTools } = await import(toolsUrl);
  const { shell } = await import(moduleUrl("src/data/shell.ts"));
  assert.equal(shell.workspace, "/workspace");
  assert.equal(shell.division2, "/workspace/game/the-division-2");
  assert.ok(serviceCategories.every(category => category.pathPrefix.startsWith("/workspace/")));
  assert.ok(desktopTools.every(tool => tool.path === `/workspace/tools/${tool.id}`));
  for (const service of services.filter(item => item.status === "ready")) {
    assert.ok(serviceCategories.some(category => category.id === service.category));
    assert.ok(service.href.startsWith("/workspace/"), service.href);
    for (const language of ["ko", "en"]) {
      const localized = getLocalizedServices(language, [service])[0];
      assert.ok(localized.topic && localized.title && localized.description);
      const path = localizePath(service.href, language);
      assert.ok(readFileSync(new URL(`../src/app${path}/page.tsx`, import.meta.url), "utf8").length > 0, path);
    }
  }
});

// Evaluate the actual route metadata exports while replacing only render-only
// dependencies. This catches stale hard-coded canonicals in moved page wrappers.
function pageModule(relative, imports) {
  const { code } = babel.transformSync(readFileSync(new URL(`../${relative}`, import.meta.url), "utf8"), {
    babelrc: false, configFile: false, filename: relative,
    presets: [presetTypeScript, [presetReact, { runtime: "automatic" }]], plugins: [transformModules],
  });
  const module = { exports: {} };
  runInNewContext(code, { module, exports: module.exports, URL,
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unexpected metadata dependency: ${name}`);
      return imports[name];
    },
  }, { filename: relative });
  return module.exports;
}

test("all workspace page wrappers emit their new canonical, hreflang and Open Graph addresses", async () => {
  const brandUrl = moduleUrl("src/data/brand.ts");
  const eventUrl = moduleUrl("src/features/division2/red-moon/event.ts");
  const eventEnUrl = moduleUrl("src/features/division2/red-moon/event-en.ts", { '"./event"': eventUrl });
  const shell = await import(moduleUrl("src/data/shell.ts"));
  const i18nUrl = moduleUrl("src/lib/i18n.ts");
  const i18n = await import(i18nUrl);
  const site = await import(moduleUrl("src/lib/site.ts", { '"@/data/brand"': brandUrl, '"./i18n"': i18nUrl }));
  const tools = await import(moduleUrl("src/features/desktop-tools/tools.ts"));
  const guides = await import(guideModuleUrl(eventUrl));
  const localization = await import(moduleUrl("src/features/division2/red-moon/localization.ts", { '"./event"': eventUrl, '"./event-en"': eventEnUrl }));
  const common = {
    "react/jsx-runtime": {}, "@/data/shell": shell, "@/lib/i18n": i18n, "@/lib/site": site,
    "@/components/share-page-button": {}, "@/components/terminal-window": {},
  };
  const game = pageModule("src/features/division2/game-page.tsx", {
    ...common, "next/link": {}, "./event-guides": guides, "./division2.module.css": {},
  });
  const redMoon = pageModule("src/features/division2/red-moon/event-page.tsx", {
    ...common, "./event": await import(eventUrl), "../event-guides": guides,
    "./localization": localization, "./reward-checklist": {}, "./red-moon.module.css": {},
  });
  const centralPark = pageModule("src/features/division2/central-park/event-page.tsx", {
    ...common, "../event-guides": guides, "./rewards": await import(centralParkRewardsUrl),
    "./collectibles": await import(moduleUrl("src/features/division2/central-park/collectibles.ts")),
    "./reward-checklist": {}, "./central-park.module.css": {},
  });
  const imports = {
    ...common, "@/features/site/services-page": {},
    "@/features/site/copy": await import(moduleUrl("src/features/site/copy.ts", { '"@/data/brand"': brandUrl })),
    "@/features/desktop-tools/tool-page": {}, "@/features/desktop-tools/tools": tools,
    "@/features/division2/game-page": game, "@/features/division2/red-moon/event-page": redMoon,
    "@/features/division2/central-park/event-page": centralPark,
  };
  const routes = ["/workspace", ...tools.desktopTools.map(tool => tool.path), guides.division2Paths.ko, ...guides.division2EventGuides.map(guide => guide.paths.ko)];
  for (const route of routes) {
    for (const language of ["ko", "en"]) {
      const path = localizePath(route, language);
      const { metadata } = pageModule(`src/app${path}/page.tsx`, imports);
      const address = new URL(path, site.siteUrl).href;
      assert.equal(metadata.alternates.canonical, address, path);
      assert.equal(metadata.openGraph.url, address, path);
      assert.equal(metadata.openGraph.locale, language === "en" ? "en_US" : "ko_KR", path);
      for (const targetLanguage of ["ko", "en", "x-default"]) {
        const targetPath = localizePath(route, targetLanguage === "en" ? "en" : "ko");
        assert.equal(metadata.alternates.languages[targetLanguage], new URL(targetPath, site.siteUrl).href, `${path}: ${targetLanguage}`);
      }
      if (route === "/workspace") assert.equal(metadata.title, language === "en" ? "Workspace" : "작업실");
    }
  }
});
test("the workspace move restores existing Red Moon progress without changing its key, schema or check IDs", async () => {
  const eventUrl = moduleUrl("src/features/division2/red-moon/event.ts");
  const progressUrl = moduleUrl("src/features/division2/red-moon/progress.ts", { '"./event"': eventUrl });
  const progress = await import(progressUrl);
  const { readStoredProgress } = await import(moduleUrl("src/features/division2/red-moon/storage.ts", { '"./progress"': progressUrl }));
  const key = "developer-john:division2:red-moon-unleashed-2026:v1";
  const saved = {
    eventId: "red-moon-unleashed-2026", schema: 1,
    checkedIds: ["bounty-final", "patch-final", "own-regulus", "login-mask"],
    apparelCount: 23, savedAt: "2026-10-31T00:00:00.000Z",
  };
  const bytes = JSON.stringify(saved);
  const reads = [];
  const storage = {
    getItem(requestedKey) { reads.push(requestedKey); return requestedKey === key ? bytes : null; },
    setItem() { assert.fail("Restoring progress during a route move must not rewrite saved data"); },
  };
  assert.equal(progress.STORAGE_KEY, key);
  assert.equal(progress.PROGRESS_SCHEMA, 1);
  assert.deepEqual(readStoredProgress(storage), { progress: saved, state: "ready" });
  assert.deepEqual(reads, [key]);
});

test("language helpers only generate local links even with redundant separators", () => {
  for (const unsafe of ["https://example.org/", "//example.org/services", "services", ""]) {
    assert.throws(() => localizePath(unsafe, "en"), /local absolute pathname/);
  }
  assert.equal(localizePath("/en//example.org/services", "ko"), "/example.org/services");
  assert.ok(!localizePath("/en//example.org/services", "ko").startsWith("//"));
});
