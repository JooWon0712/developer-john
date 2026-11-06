import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = stripTypeScriptTypes(readFileSync(new URL("../src/lib/theme.ts", import.meta.url), "utf8"))
  .replace(/^export /gm, "");

function eventTarget() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name, event = {}) { for (const callback of listeners.get(name) ?? []) callback(event); },
  };
}

function browser({ hour = 12, preference, dark = false, blocked = false, media = true, hidden = false } = {}) {
  let clock = new Date(2026, 10, 6, hour).getTime();
  let timerId = 0;
  const timers = new Map();
  const records = new Map();
  if (preference !== undefined) records.set("developer-john:theme-preference:v1", preference);
  const storage = {
    getItem(key) { if (blocked) throw new Error("Storage blocked"); return records.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error("Storage blocked"); records.set(key, value); },
  };
  class LocalDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const document = { ...eventTarget(), documentElement: { dataset: {} }, visibilityState: hidden ? "hidden" : "visible" };
  const device = { ...eventTarget(), matches: dark };
  const window = {
    ...eventTarget(), localStorage: storage,
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    ...(media ? { matchMedia: () => device } : {}),
  };
  const context = { document, window, localStorage: storage, matchMedia: window.matchMedia, Date: LocalDate };
  runInNewContext(`${source}\nglobalThis.api={themeInitialization,watchSiteTheme};`, context);
  const preferences = [];
  const themes = [];
  return {
    ...context, records, timers, device, preferences, themes,
    initialize() { runInNewContext(context.api.themeInitialization, context); },
    watch(observeTheme = true) { return context.api.watchSiteTheme(document, window, value => preferences.push(value), observeTheme ? value => themes.push(value) : undefined); },
    time(hour, minute = 0, second = 0) { clock = new Date(2026, 10, 6, hour, minute, second).getTime(); },
    tick() {
      const [id, timer] = timers.entries().next().value;
      timers.delete(id); timer.callback();
    },
    theme() { return document.documentElement.dataset.theme; },
  };
}

test("first paint uses visitor time at both boundaries and through midnight", () => {
  for (const [hour, minute, second, expected] of [
    [0, 0, 0, "dark"], [6, 59, 59, "dark"], [7, 0, 0, "light"],
    [18, 59, 59, "light"], [19, 0, 0, "dark"], [23, 59, 59, "dark"],
  ]) {
    const page = browser(); page.time(hour, minute, second); page.initialize();
    assert.equal(page.theme(), expected);
    const control = page.watch();
    assert.equal(page.theme(), expected, "hydration must agree with first paint");
    control.destroy();
  }
});

test("saved device mode takes precedence over the time rule from first paint", () => {
  for (const [hour, dark, expected] of [[12, true, "dark"], [23, false, "light"]]) {
    const page = browser({ hour, dark, preference: "system" });
    page.initialize(); assert.equal(page.theme(), expected);
    const control = page.watch();
    assert.equal(page.preferences.at(-1), "system");
    assert.equal(page.theme(), expected);
    assert.equal(page.timers.size, 0, "device mode needs no clock polling");
    page.device.matches = !dark; page.device.emit("change");
    assert.equal(page.theme(), dark ? "light" : "dark");
    control.destroy();
  }
});

test("saved fixed themes override time and device from first paint without clock timers", () => {
  for (const preference of ["light", "dark"]) {
    for (const media of [true, false]) {
      const page = browser({ preference, media, hour: preference === "light" ? 23 : 12, dark: preference === "light" });
      page.initialize(); assert.equal(page.theme(), preference);
      const control = page.watch();
      assert.equal(page.preferences.at(-1), preference);
      assert.equal(page.theme(), preference, "hydration must retain the saved fixed theme");
      for (const dark of [false, true]) {
        page.device.matches = dark; page.device.emit("change");
        assert.equal(page.theme(), preference, "device changes must not override a fixed theme");
      }
      for (const hour of [6, 7, 18, 19]) {
        page.time(hour); page.window.emit("focus"); page.window.emit("pageshow");
        page.document.visibilityState = "hidden"; page.document.emit("visibilitychange");
        page.document.visibilityState = "visible"; page.document.emit("visibilitychange");
        assert.equal(page.theme(), preference, "fixed themes ignore clock and device changes");
        assert.equal(page.timers.size, 0, "fixed themes need no clock polling");
      }
      control.destroy();
    }
  }
});

test("every explicit preference persists and restores on the next visit", () => {
  const key = "developer-john:theme-preference:v1";
  for (const [preference, expected] of [["time", "dark"], ["system", "light"], ["light", "light"], ["dark", "dark"]]) {
    const page = browser({ hour: 23, dark: false });
    const control = page.watch();
    assert.equal(page.records.has(key), false, "default initialization must not save a selection");
    control.setPreference(preference);
    assert.equal(page.records.get(key), preference);
    assert.equal(page.preferences.at(-1), preference);
    assert.equal(page.theme(), expected);
    const revisit = browser({ hour: 23, dark: false, preference: page.records.get(key) });
    revisit.initialize(); assert.equal(revisit.theme(), expected);
    const restored = revisit.watch();
    assert.equal(revisit.preferences.at(-1), preference);
    assert.equal(revisit.theme(), expected);
    restored.destroy(); control.destroy();
  }
});

test("switching from fixed themes back to automatic modes resumes the correct updates", () => {
  const page = browser({ hour: 23, dark: false });
  const control = page.watch();
  assert.equal(page.timers.size, 1);
  control.setPreference("light"); assert.equal(page.timers.size, 0);
  control.setPreference("dark"); assert.equal(page.timers.size, 0);
  control.setPreference("system");
  assert.equal(page.theme(), "light"); assert.equal(page.timers.size, 0);
  page.device.matches = true; page.device.emit("change");
  assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 0);
  control.setPreference("time");
  assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 1);
  page.time(7); page.tick();
  assert.equal(page.theme(), "light"); assert.equal(page.timers.size, 1);
  control.destroy();
});

test("cross-tab fixed selections and deletion or clear update the current page", () => {
  const key = "developer-john:theme-preference:v1";
  const page = browser({ hour: 23 });
  const control = page.watch();
  for (const preference of ["light", "dark"]) {
    page.records.set(key, preference);
    page.window.emit("storage", { key, storageArea: page.localStorage });
    assert.equal(page.theme(), preference);
    assert.equal(page.preferences.at(-1), preference);
    assert.equal(page.timers.size, 0);
  }
  page.records.delete(key);
  page.window.emit("storage", { key, storageArea: page.localStorage });
  assert.equal(page.preferences.at(-1), "time");
  assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 1);
  page.records.set(key, "light");
  page.window.emit("storage", { key, storageArea: page.localStorage });
  page.records.clear();
  page.window.emit("storage", { key: null, storageArea: page.localStorage });
  assert.equal(page.preferences.at(-1), "time");
  assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 1);
  control.destroy();
});

test("missing or invalid preferences use time without overwriting storage and reject invalid selections", () => {
  const key = "developer-john:theme-preference:v1";
  for (const preference of [undefined, "", "sepia", "LIGHT"]) {
    const page = browser({ hour: 23, preference });
    page.initialize(); assert.equal(page.theme(), "dark");
    const control = page.watch();
    assert.equal(page.preferences.at(-1), "time");
    assert.equal(page.records.get(key), preference);
    const notifications = page.preferences.length;
    control.setPreference("sepia");
    assert.equal(page.preferences.length, notifications);
    assert.equal(page.records.get(key), preference);
    assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 1);
    control.destroy();
  }
});

test("blocked storage keeps explicit fixed themes active in the current tab", () => {
  for (const preference of ["light", "dark"]) {
    const page = browser({ blocked: true, hour: preference === "light" ? 23 : 12, dark: preference === "light" });
    const control = page.watch();
    control.setPreference(preference);
    for (const dark of [false, true]) {
      page.device.matches = dark; page.device.emit("change");
      assert.equal(page.theme(), preference);
    }
    page.time(19); page.window.emit("focus"); page.window.emit("pageshow");
    assert.equal(page.theme(), preference);
    assert.equal(page.preferences.at(-1), preference);
    assert.equal(page.records.size, 0);
    assert.equal(page.timers.size, 0);
    control.destroy();
  }
});

test("default time mode ignores the OS theme and schedules an exact boundary", () => {
  const page = browser({ dark: true }); page.time(18, 59, 59);
  const control = page.watch();
  assert.equal(page.theme(), "light");
  assert.equal([...page.timers.values()][0].delay, 1000);
  page.time(19); page.tick();
  assert.equal(page.theme(), "dark");
  page.time(7); page.tick();
  assert.equal(page.theme(), "light", "re-read clock rather than toggling blindly");
  control.destroy();
});

test("selection persists, cross-tab changes sync, and unrelated storage is ignored", () => {
  const page = browser({ dark: true });
  const control = page.watch();
  control.setPreference("system");
  assert.equal(page.theme(), "dark");
  assert.equal(page.records.get("developer-john:theme-preference:v1"), "system");
  page.records.set("developer-john:theme-preference:v1", "time");
  page.window.emit("storage", { key: "reward-records", storageArea: page.localStorage });
  assert.equal(page.theme(), "dark");
  page.window.emit("storage", { key: "developer-john:theme-preference:v1", storageArea: {} });
  assert.equal(page.theme(), "dark", "session storage must not reset this selection");
  page.window.emit("storage", { key: "developer-john:theme-preference:v1", storageArea: page.localStorage });
  assert.equal(page.theme(), "light");
  assert.equal(page.preferences.at(-1), "time");
  control.destroy();
});

test("hidden tabs pause timers and visibility, focus and history restore re-evaluate time", () => {
  const page = browser(); const control = page.watch();
  page.document.visibilityState = "hidden"; page.document.emit("visibilitychange");
  assert.equal(page.timers.size, 0);
  page.time(22); page.document.visibilityState = "visible"; page.document.emit("visibilitychange");
  assert.equal(page.theme(), "dark"); assert.equal(page.timers.size, 1);
  page.time(10); page.window.emit("focus"); assert.equal(page.theme(), "light");
  page.time(23); page.window.emit("pageshow"); assert.equal(page.theme(), "dark");
  assert.equal(page.timers.size, 1);
  control.destroy();
});

test("unavailable storage and media queries do not break the page or current selection", () => {
  const page = browser({ blocked: true, dark: true });
  page.initialize(); assert.equal(page.theme(), "light");
  const control = page.watch(); control.setPreference("system");
  assert.equal(page.theme(), "dark");
  page.window.emit("focus"); assert.equal(page.theme(), "dark");
  control.destroy();
  const fallback = browser({ hour: 23, preference: "system", media: false });
  fallback.initialize(); assert.equal(fallback.theme(), "dark");
  const fallbackControl = fallback.watch(); assert.equal(fallback.theme(), "dark");
  assert.equal(fallback.preferences.at(-1), "system");
  assert.equal(fallback.timers.size, 1);
  fallback.time(7); fallback.tick();
  assert.equal(fallback.theme(), "light"); assert.equal(fallback.timers.size, 1);
  fallbackControl.destroy();
});

test("cleanup and remount do not leave duplicate timers or event handlers", () => {
  const page = browser(); const first = page.watch(); first.destroy();
  assert.equal(page.timers.size, 0);
  for (const target of [page.document, page.window, page.device]) {
    for (const listeners of target.listeners.values()) assert.equal(listeners.size, 0);
  }
  const second = page.watch();
  assert.equal(page.timers.size, 1);
  for (const target of [page.document, page.window, page.device]) {
    for (const listeners of target.listeners.values()) assert.equal(listeners.size, 1);
  }
  second.destroy();
});

test("resolved theme callbacks agree with the applied theme through time, device, fixed and cross-tab updates", () => {
  const page = browser({ hour: 12 });
  const control = page.watch();
  assert.deepEqual(page.themes, ["light"]);
  function resolved(expected) {
    assert.equal(page.themes.at(-1), expected);
    assert.equal(page.theme(), expected);
  }
  page.time(19); page.tick(); resolved("dark");
  control.setPreference("system"); resolved("light");
  page.device.matches = true; page.device.emit("change"); resolved("dark");
  control.setPreference("light"); resolved("light");
  page.device.emit("change"); resolved("light");
  control.setPreference("dark"); resolved("dark");
  const key = "developer-john:theme-preference:v1";
  page.records.set(key, "light");
  page.window.emit("storage", { key, storageArea: page.localStorage }); resolved("light");
  page.records.delete(key);
  page.window.emit("storage", { key, storageArea: page.localStorage }); resolved("dark");
  page.time(7); page.window.emit("pageshow"); resolved("light");
  control.destroy();
  const notifications = page.themes.length;
  page.window.emit("focus"); page.window.emit("pageshow");
  page.document.emit("visibilitychange"); page.device.emit("change");
  page.window.emit("storage", { key, storageArea: page.localStorage });
  assert.equal(page.themes.length, notifications, "destroyed watchers must stop resolved-theme notifications");
});

test("resolved callbacks support unavailable device queries and remain optional for existing callers", () => {
  const fallback = browser({ hour: 23, preference: "system", media: false });
  const active = fallback.watch();
  assert.equal(fallback.themes.at(-1), "dark");
  fallback.time(7); fallback.tick();
  assert.equal(fallback.themes.at(-1), "light");
  active.destroy();
  const compatible = browser({ hour: 23 });
  const original = compatible.watch(false);
  assert.equal(compatible.theme(), "dark");
  original.setPreference("light");
  assert.equal(compatible.theme(), "light");
  assert.deepEqual(compatible.themes, []);
  original.destroy();
});

test("both palettes retain readable normal text, links and primary buttons", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  function luminance(hex) {
    const channels = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }
  for (const block of [css.match(/:root \{([\s\S]*?)\n\}/)[1], css.match(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1]]) {
    const colors = Object.fromEntries([...block.matchAll(/--([\w-]+): #([\da-f]{6});/g)].map(match => [match[1], match[2]]));
    for (const [foreground, background] of [
      ["ink", "paper"], ["ink", "surface"], ["muted", "paper"], ["muted", "surface"],
      ["accent", "paper"], ["accent", "surface"], ["accent", "accent-soft"],
      ["button-ink", "accent"], ["button-ink", "accent-hover"], ["danger", "danger-soft"], ["warning", "warning-soft"],
    ]) {
      const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => b - a);
      const ratio = (values[0] + .05) / (values[1] + .05);
      assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
    }
  }
});
