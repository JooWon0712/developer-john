import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

function moduleUrl(relative, replacements = {}) {
  let source = readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, JSON.stringify(to));
  return "data:text/javascript;base64," + Buffer.from(stripTypeScriptTypes(source)).toString("base64");
}
const { getLanguage, getBasePath, localizePath } = await import(moduleUrl("src/lib/i18n.ts"));

const paths = ["/", "/services", "/privacy", "/projects", "/services/game/the-division-2", "/services/game/the-division-2/red-moon-unleashed-2026", "/discovery/ikigai", "/missing-page"];

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
  for (const path of ["/en", "/en/", "/en/services", "/en?ref=home#intro"]) assert.equal(getLanguage(path), "en");
  for (const path of ["/", "/services", "/english", "/enough/services"]) assert.equal(getLanguage(path), "ko");
  assert.equal(localizePath("/en/", "ko"), "/");
  assert.equal(localizePath("/en/", "en"), "/en");
});

test("language changes preserve queries, encoded values and exact reward fragments", () => {
  const suffix = "?view=unchecked&name=%EB%A0%88%EB%93%9C+%EB%AC%B8#reward-mask-houndsman";
  const route = "/services/game/the-division-2/red-moon-unleashed-2026";
  assert.equal(localizePath(route + suffix, "en"), `/en${route}${suffix}`);
  assert.equal(localizePath(`/en${route}${suffix}`, "ko"), route + suffix);
  assert.equal(localizePath("/?source=nav#intro", "en"), "/en?source=nav#intro");
  assert.equal(getBasePath(`/en${route}${suffix}`), route);
});

test("registered Division 2 service and event routes have localized wrappers under services", async () => {
  const brandUrl = moduleUrl("src/data/brand.ts");
  const eventUrl = moduleUrl("src/features/division2/red-moon/event.ts");
  const { services, serviceCategories } = await import(moduleUrl("src/data/catalog.ts", { '"@/data/brand"': brandUrl }));
  const { division2Paths, division2EventGuides } = await import(moduleUrl("src/features/division2/event-guides.ts", { '"./red-moon/event"': eventUrl }));
  const service = services.find(item => item.id === "the-division-2");
  assert.equal(service.status, "ready");
  assert.equal(service.href, "/services/game/the-division-2");
  assert.equal(serviceCategories.find(item => item.id === service.category).pathPrefix, "/services/game");
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
test("language helpers only generate local links even with redundant separators", () => {
  for (const unsafe of ["https://example.org/", "//example.org/services", "services", ""]) {
    assert.throws(() => localizePath(unsafe, "en"), /local absolute pathname/);
  }
  assert.equal(localizePath("/en//example.org/services", "ko"), "/example.org/services");
  assert.ok(!localizePath("/en//example.org/services", "ko").startsWith("//"));
});
