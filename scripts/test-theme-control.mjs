import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import babel from "next/dist/compiled/babel/core.js";
import presetTypeScript from "next/dist/compiled/babel/preset-typescript.js";
import presetReact from "next/dist/compiled/babel/preset-react.js";
import transformModules from "next/dist/compiled/babel/plugin-transform-modules-commonjs.js";

// Exercise the production component's handlers, effects and refs without a browser
// or additional packages. This does not simulate layout or native Tab traversal.
const javascript = new Map();
function loadModule(relative, imports, globals = {}) {
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
      assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
      return imports[name];
    },
  }, { filename: relative });
  return module.exports;
}

function eventTarget() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name, event = {}) { for (const callback of [...(listeners.get(name) ?? [])]) callback(event); },
  };
}

let instanceId = 0;
function control({ language = "en", preference, dark = false, hour = 12 } = {}) {
  let clock = new Date(2026, 10, 6, hour).getTime();
  let timerId = 0;
  const timers = new Map();
  const records = new Map();
  const storageKey = "developer-john:theme-preference:v1";
  if (preference !== undefined) records.set(storageKey, preference);
  const document = { ...eventTarget(), documentElement: { dataset: {} }, visibilityState: "visible", activeElement: null };
  const device = { ...eventTarget(), matches: dark };
  const window = {
    ...eventTarget(),
    localStorage: { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) },
    matchMedia: () => device,
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  class LocalDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const globals = { document, window, Date: LocalDate };
  const { watchSiteTheme } = loadModule("src/lib/theme.ts", {}, globals);
  const slots = [];
  const elements = new Map();
  const id = `theme-test-${++instanceId}`;
  let cursor = 0;
  let dirty = true;
  let pending = [];
  let tree;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { value: typeof initial === "function" ? initial() : initial };
      return [slots[index].value, value => {
        const next = typeof value === "function" ? value(slots[index].value) : value;
        if (!Object.is(next, slots[index].value)) { slots[index].value = next; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useId() { cursor++; return id; },
    useLayoutEffect: effect,
    useEffect: effect,
  };
  function effect(callback, deps) {
    const index = cursor++;
    const previous = slots[index];
    if (previous && deps?.length === previous.deps?.length && deps.every((value, position) => Object.is(value, previous.deps[position]))) return;
    const slot = { deps, cleanup: previous?.cleanup };
    slots[index] = slot;
    pending.push(() => { slot.cleanup?.(); slot.cleanup = callback(); });
  }
  const jsx = (type, props, key) => ({ type, props: props ?? {}, key });
  const runtime = { jsx, jsxs: jsx };
  const icons = loadModule("src/components/icons.tsx", { "react/jsx-runtime": runtime });
  const { ThemeControl } = loadModule("src/components/theme-control.tsx", {
    react, "react/jsx-runtime": runtime, "@/components/icons": icons, "@/lib/theme": { watchSiteTheme },
  }, globals);

  function materialize(value, parent, path) {
    if (value == null || typeof value === "boolean") return null;
    if (Array.isArray(value)) return value.map((child, index) => materialize(child, parent, `${path}.${index}`));
    if (typeof value !== "object") return value;
    if (typeof value.type === "function") return materialize(value.type(value.props), parent, `${path}.component`);
    let element = elements.get(path);
    if (!element) {
      element = {
        contains(target) { for (let current = target; current; current = current.parent) if (current === this) return true; return false; },
        focus() {
          if (document.activeElement === this) return;
          const old = document.activeElement;
          document.activeElement = this;
          if (tree?.contains(old)) tree.props.onBlur?.({ currentTarget: tree, relatedTarget: this });
          this.props.onFocus?.({ currentTarget: this });
        },
      };
      elements.set(path, element);
    }
    Object.assign(element, { type: value.type, props: value.props, parent });
    element.children = materialize(value.props.children, element, `${path}.children`);
    const ref = value.props.ref;
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
    return element;
  }
  function flush() {
    let renders = 0;
    while (dirty) {
      assert.ok(++renders < 20, "Component must settle without an effect loop");
      dirty = false; cursor = 0; pending = [];
      tree = materialize(ThemeControl({ language }), null, "root");
      for (const run of pending) run();
    }
  }
  function nodes(predicate) { return [...elements.values()].filter(predicate); }
  function trigger() { return nodes(element => element.props.className === "theme-toggle")[0]; }
  function menu() { return nodes(element => element.props.role === "menu")[0]; }
  function items() { return nodes(element => element.props.role === "menuitemradio"); }
  function key(target, value, modifiers = {}) {
    const event = { key: value, defaultPrevented: false, stopped: false, ...modifiers,
      preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; } };
    for (let current = target; current && !event.stopped; current = current.parent) current.props.onKeyDown?.(event);
    if (!event.stopped) document.emit("keydown", event);
    flush();
    return event;
  }
  function click(target) { target.focus(); target.props.onClick?.(); flush(); }
  function outsideFocus() {
    const outside = { name: "next page control" };
    document.activeElement = outside;
    tree.props.onBlur({ currentTarget: tree, relatedTarget: outside });
    flush();
    return outside;
  }
  flush();
  return {
    document, window, device, records, timers, storageKey, trigger, menu, items, key, click, flush, outsideFocus,
    open() { click(trigger()); },
    pointer(target) { document.emit("pointerdown", { target }); flush(); },
    time(hour) { clock = new Date(2026, 10, 6, hour).getTime(); window.emit("focus"); flush(); },
    text(element) {
      function read(value) {
        if (Array.isArray(value)) return value.map(read).join("");
        if (value == null) return "";
        return typeof value === "object" ? read(value.children) : String(value);
      }
      return read(element);
    },
    destroy() { for (const slot of slots) slot?.cleanup?.(); },
  };
}

test("theme trigger and radios expose localized names, checked preference and unique controls", () => {
  const english = control({ preference: "dark", hour: 12 });
  const korean = control({ language: "ko", preference: "system", dark: false, hour: 23 });
  assert.equal(english.menu().props.hidden, true);
  assert.equal(english.trigger().type, "button");
  assert.equal(english.trigger().props.type, "button");
  assert.equal(english.trigger().props["aria-haspopup"], "menu");
  assert.equal(english.trigger().props["aria-controls"], english.menu().props.id);
  assert.notEqual(english.menu().props.id, korean.menu().props.id);
  assert.match(english.trigger().props["aria-label"], /Theme settings: Dark · Now Dark/);
  assert.match(korean.trigger().props["aria-label"], /테마 설정: 기기 설정 · 현재 라이트 모드/);
  assert.deepEqual(english.items().map(item => item.props["aria-checked"]), [false, false, false, true]);
  assert.deepEqual(korean.items().map(item => item.props["aria-checked"]), [false, true, false, false]);
  assert.ok(english.items().every(item => item.type === "button" && item.props.type === "button" && item.props.tabIndex === -1));
  assert.equal(english.menu().props["aria-label"], "Theme");
  assert.equal(korean.menu().props["aria-label"], "화면 테마");
  assert.match(english.text(english.items()[0]), /By time.*7 am to 7 pm/);
  assert.match(korean.text(korean.items()[0]), /시간 자동.*07:00–19:00/);
  english.destroy(); korean.destroy();
});

test("opening and keyboard navigation move focus without changing the saved preference", () => {
  const page = control({ preference: "system" });
  page.open();
  assert.equal(page.trigger().props["aria-expanded"], true);
  assert.equal(page.menu().props.hidden, false);
  assert.equal(page.document.activeElement, page.items()[0]);
  for (const [key, expected] of [["ArrowUp", 3], ["ArrowDown", 0], ["End", 3], ["Home", 0], ["d", 1], ["d", 3]]) {
    assert.equal(page.key(page.document.activeElement, key).defaultPrevented, true);
    assert.equal(page.document.activeElement, page.items()[expected], key);
    assert.equal(page.items().filter(item => item.props.tabIndex === 0).length, 1);
  }
  assert.equal(page.records.get(page.storageKey), "system");
  page.key(page.document.activeElement, "Escape");
  page.key(page.trigger(), "ArrowUp");
  assert.equal(page.document.activeElement, page.items()[3]);
  page.key(page.document.activeElement, "Escape");
  page.key(page.trigger(), "ArrowDown");
  assert.equal(page.document.activeElement, page.items()[0]);
  page.destroy();
});

test("activating each native option persists the preference, closes and restores trigger focus", () => {
  const page = control({ hour: 23, dark: false });
  for (const [index, preference, resolved] of [[0, "time", "dark"], [1, "system", "light"], [2, "light", "light"], [3, "dark", "dark"]]) {
    page.open(); page.click(page.items()[index]);
    assert.equal(page.records.get(page.storageKey), preference);
    assert.equal(page.document.documentElement.dataset.theme, resolved);
    assert.deepEqual(page.items().map(item => item.props["aria-checked"]), [0, 1, 2, 3].map(value => value === index));
    assert.equal(page.menu().props.hidden, true);
    assert.equal(page.trigger().props["aria-expanded"], false);
    assert.equal(page.document.activeElement, page.trigger());
  }
  page.destroy();
});

test("Escape and Tab close the menu with the intended focus and default-event contracts", () => {
  const page = control();
  for (const shiftKey of [false, true]) {
    page.open();
    const event = page.key(page.document.activeElement, "Tab", { shiftKey });
    assert.equal(page.menu().props.hidden, true);
    assert.equal(page.document.activeElement, page.trigger());
    assert.equal(event.defaultPrevented, shiftKey, "forward Tab must remain available for native traversal");
  }
  page.open();
  const escape = page.key(page.document.activeElement, "Escape");
  assert.equal(escape.defaultPrevented, true);
  assert.equal(escape.stopped, true);
  assert.equal(page.menu().props.hidden, true);
  assert.equal(page.document.activeElement, page.trigger());
  page.open();
  page.key(page.trigger(), "Escape");
  assert.equal(page.menu().props.hidden, true, "document-level Escape also dismisses");
  assert.equal(page.document.activeElement, page.trigger());
  page.destroy();
});

test("inside pointers keep the menu open; outside pointers and blur close without stealing focus", () => {
  const page = control();
  page.open();
  page.pointer(page.items()[1]);
  assert.equal(page.menu().props.hidden, false);
  const focused = page.document.activeElement;
  page.pointer({ name: "outside button" });
  assert.equal(page.menu().props.hidden, true);
  assert.equal(page.document.activeElement, focused, "outside pointer dismissal must leave focus to the pointer target");
  page.open();
  const outside = page.outsideFocus();
  assert.equal(page.menu().props.hidden, true);
  assert.equal(page.document.activeElement, outside);
  page.destroy();
});

test("resolved trigger status and checked radios follow time, device and cross-tab updates", () => {
  const page = control({ hour: 12 });
  page.time(23);
  assert.match(page.trigger().props["aria-label"], /By time · Now Dark/);
  page.records.set(page.storageKey, "system");
  page.window.emit("storage", { key: page.storageKey, storageArea: page.window.localStorage }); page.flush();
  assert.match(page.trigger().props["aria-label"], /Device · Now Light/);
  page.device.matches = true; page.device.emit("change"); page.flush();
  assert.match(page.trigger().props["aria-label"], /Device · Now Dark/);
  assert.deepEqual(page.items().map(item => item.props["aria-checked"]), [false, true, false, false]);
  page.records.delete(page.storageKey);
  page.window.emit("storage", { key: page.storageKey, storageArea: page.window.localStorage }); page.flush();
  assert.match(page.trigger().props["aria-label"], /By time · Now Dark/);
  page.destroy();
});

test("closing, reopening and unmounting remove menu listeners and theme resources", () => {
  const page = control();
  for (let index = 0; index < 3; index++) {
    page.open();
    assert.equal(page.document.listeners.get("pointerdown").size, 1);
    assert.equal(page.document.listeners.get("keydown").size, 1);
    page.key(page.document.activeElement, "Escape");
    assert.equal(page.document.listeners.get("pointerdown").size, 0);
    assert.equal(page.document.listeners.get("keydown").size, 0);
  }
  page.open(); page.destroy();
  assert.equal(page.timers.size, 0);
  for (const target of [page.document, page.window, page.device]) {
    for (const listeners of target.listeners.values()) assert.equal(listeners.size, 0);
  }
});
