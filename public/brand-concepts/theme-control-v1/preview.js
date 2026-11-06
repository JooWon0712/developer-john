"use strict";

(() => {
  const modes = ["time", "system", "light", "dark"];
  const scenes = {
    light: {
      src: "/images/home/harbor-cafe-cozy-pixel-light-clean-v1.webp",
      ko: "작은 항구가 보이는 카페에서 안경을 쓴 회색 아기 웜뱃이 노트북으로 작업하는 픽셀 그림",
      en: "Pixel art of a grey baby wombat wearing glasses and working on a laptop at a harbor café",
    },
    dark: {
      src: "/images/home/harbor-cafe-cozy-pixel-night-desk-sleep-v1.webp",
      ko: "밤의 항구 카페에서 회색 아기 웜뱃이 안경을 테이블에 벗어 두고 덮은 노트북 위에 팔과 머리를 올려 잠든 픽셀 그림",
      en: "Pixel art of a grey baby wombat asleep with its head and arms on a closed laptop at the harbor café at night, with its glasses on the table",
    },
  };
  const copy = {
    ko: { time: "시간 자동", system: "기기 설정", light: "라이트 모드", dark: "다크 모드", theme: "테마 설정", current: "현재" },
    en: { time: "By time", system: "Device", light: "Light", dark: "Dark", theme: "Theme settings", current: "Now" },
  };
  let device = null;
  try {
    if (typeof window.matchMedia === "function") device = window.matchMedia("(prefers-color-scheme: dark)");
  } catch { /* Use local time when the device preference is unavailable. */ }

  const demos = [...document.querySelectorAll("[data-theme-demo]")].map(root => {
    const trigger = root.querySelector("[data-theme-trigger]");
    const menu = root.querySelector("[data-theme-menu]");
    if (!trigger || !menu) return null;
    const items = [...menu.querySelectorAll("[data-mode]")].filter(item => modes.includes(item.dataset.mode));
    const language = root.closest("[lang]")?.lang?.startsWith("en") ? "en" : "ko";
    const preference = modes.includes(root.dataset.preference) ? root.dataset.preference : "time";
    root.dataset.preference = preference;
    return { root, trigger, menu, items, language };
  }).filter(Boolean);

  function refresh(demo) {
    const preference = demo.root.dataset.preference;
    const hour = new Date().getHours();
    const theme = preference === "light" || preference === "dark" ? preference
      : preference === "system" && device ? device.matches ? "dark" : "light"
        : hour >= 7 && hour < 19 ? "light" : "dark";
    const text = copy[demo.language];
    const status = `${text[preference]} · ${text.current} ${text[theme]}`;
    demo.root.dataset.demoTheme = theme;
    demo.trigger.setAttribute("aria-label", `${text.theme}: ${status}`);
    demo.trigger.title = `${text.theme}: ${status}`;
    demo.root.querySelectorAll("[data-theme-label]").forEach(label => { label.textContent = status; });
    demo.items.forEach(item => { item.setAttribute("aria-checked", String(item.dataset.mode === preference)); });
    demo.root.querySelectorAll("[data-scene-image]").forEach(image => {
      if (image.getAttribute("src") !== scenes[theme].src) image.setAttribute("src", scenes[theme].src);
      image.alt = scenes[theme][demo.language];
    });
  }

  function close(demo, restoreFocus = false) {
    demo.menu.hidden = true;
    demo.trigger.setAttribute("aria-expanded", "false");
    demo.items.forEach(item => { item.tabIndex = -1; });
    if (restoreFocus) demo.trigger.focus();
  }

  function focusItem(demo, index) {
    demo.items.forEach((item, itemIndex) => { item.tabIndex = itemIndex === index ? 0 : -1; });
    demo.items[index]?.focus();
  }

  function open(demo, index = 0, moveFocus = true) {
    demos.forEach(other => { if (other !== demo) close(other); });
    demo.menu.hidden = false;
    demo.trigger.setAttribute("aria-expanded", "true");
    if (moveFocus) focusItem(demo, index);
    else demo.items.forEach((item, itemIndex) => { item.tabIndex = itemIndex === index ? 0 : -1; });
  }

  demos.forEach(demo => {
    refresh(demo);
    close(demo);
    demo.trigger.addEventListener("click", () => {
      if (demo.menu.hidden) open(demo);
      else close(demo, true);
    });
    demo.trigger.addEventListener("keydown", event => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      open(demo, event.key === "ArrowUp" ? demo.items.length - 1 : 0);
    });
    demo.menu.addEventListener("click", event => {
      const item = event.target.closest("[data-mode]");
      if (!demo.items.includes(item)) return;
      demo.root.dataset.preference = item.dataset.mode;
      refresh(demo);
      close(demo, true);
    });
    demo.menu.addEventListener("keydown", event => {
      const index = demo.items.indexOf(event.target.closest("[data-mode]"));
      let next;
      if (event.key === "ArrowDown") next = (index + 1) % demo.items.length;
      else if (event.key === "ArrowUp") next = (index - 1 + demo.items.length) % demo.items.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = demo.items.length - 1;
      else if (event.key === "Escape") { event.preventDefault(); close(demo, true); return; }
      else if (event.key === "Tab") { close(demo); return; }
      else return;
      event.preventDefault();
      focusItem(demo, next);
    });
  });

  demos.forEach(demo => { if (demo.root.hasAttribute("data-start-open")) open(demo, 0, false); });
  document.addEventListener("pointerdown", event => {
    demos.forEach(demo => {
      if (!demo.menu.hidden && !demo.trigger.contains(event.target) && !demo.menu.contains(event.target)) close(demo);
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const active = demos.find(demo => !demo.menu.hidden);
    if (!active) return;
    event.preventDefault();
    close(active, true);
  });
  function refreshAutomatic() {
    demos.forEach(demo => {
      if (demo.root.dataset.preference === "time" || demo.root.dataset.preference === "system") refresh(demo);
    });
  }
  window.addEventListener("focus", refreshAutomatic);
  device?.addEventListener?.("change", refreshAutomatic);
})();
