const images = {
  light: "/images/home/harbor-cafe-cozy-pixel-light-clean-v1.webp",
  dark: "/images/home/harbor-cafe-cozy-pixel-night-desk-sleep-v1.webp",
};
const imageDescriptions = {
  light: "낮의 항구 카페에서 안경을 쓰고 노트북으로 작업하는 회색 아기 웜뱃",
  dark: "밤의 항구 카페에서 안경을 내려놓고 덮은 노트북 위에서 잠든 회색 아기 웜뱃",
};
const modes = { light: "라이트 · 낮", dark: "다크 · 밤" };
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const icon = path => `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
const arrow = icon('<path d="M4 12h16m-7-7 7 7-7 7"/>');
const sun = icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>');
const moon = icon('<path d="M20.6 14A8.7 8.7 0 0 1 10 3.4 8.8 8.8 0 1 0 20.6 14Z"/>');
const dots = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';

function colorStyle(palette) {
  return Object.entries(palette).map(([key, value]) => {
    if (!/^[a-zA-Z]+$/.test(key) || !/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(value)) throw new Error("잘못된 색상 값입니다.");
    return `--${key.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)}:${value}`;
  }).join(";");
}

function sitePreview(palette, mode) {
  return `<div class="site-preview" style="${colorStyle(palette[mode])};color-scheme:${mode}">
    <header class="frame-header">
      <a class="frame-brand" href="/"><img src="/brand/jw-mark.svg" width="40" height="40" alt=""><span>john</span></a>
      <nav class="frame-nav" aria-label="미리보기 주 메뉴"><a href="/">홈<code>/</code></a><a href="/workspace">작업실<code>/workspace</code></a><a class="active" href="/about">소개<code>/about</code></a></nav>
      <div class="frame-utilities"><span class="current">KO</span><span aria-hidden="true">/</span><span>EN</span><span aria-label="${modes[mode]}">${mode === "light" ? sun : moon}</span></div>
    </header>
    <div class="frame-main">
      <section class="mock-copy">
        <p class="mock-eyebrow" lang="en">ABOUT JOHN</p>
        <h3>편하게 둘러봐 주세요.</h3>
        <p class="mock-summary">직접 만든 프로그램과 웹서비스, 관심 있는 것들을 소개합니다.</p>
        <a class="mock-link" href="/workspace">작업실 둘러보기 ${arrow}</a>
        <p class="mock-approach">필요한 기능을 구상하고, AI 코딩 에이전트와 함께 프로그램과 웹서비스로 구현합니다.</p>
        <ul class="mock-topics" aria-label="관심사"><li>게임</li><li>일상의 아이디어</li><li>웹서비스</li></ul>
        <a class="mock-link" href="mailto:devjw0712@gmail.com">이야기 나누기 ${arrow}</a>
      </section>
      <figure class="scene"><div class="scene-bar">${dots}<span>하와이에서 살고 싶다</span></div><img src="${images[mode]}" width="1536" height="1024" alt="${imageDescriptions[mode]}" loading="lazy"></figure>
    </div>
    <div class="sample-actions"><a class="sample-button" href="/workspace">작업실 둘러보기 ${arrow}</a><span class="sample-secondary">프로그램 · 웹서비스</span></div>
  </div>`;
}

function swatches(colors) {
  return `<div class="swatches">${[["바탕", "paper"], ["본문", "ink"], ["포인트", "accent"]].map(([label, key]) => `<span class="swatch"><i style="background:${colors[key]}" aria-hidden="true"></i>${label}<code>${colors[key]}</code></span>`).join("")}</div>`;
}

async function start() {
  const response = await fetch("./palettes.json");
  if (!response.ok) throw new Error("색상 파일을 불러오지 못했습니다.");
  const palettes = await response.json();
  if (!Array.isArray(palettes) || palettes.length !== 5) throw new Error("시안 데이터가 올바르지 않습니다.");
  document.querySelector("#palette-jumps").innerHTML = palettes.map((palette, index) => `<a href="#palette-${index + 1}"><span class="jump-chip" aria-hidden="true"><i style="background:${palette.light.accent}"></i><i style="background:${palette.dark.accent}"></i></span>${index + 1} ${escapeHtml(palette.name.split(" · ")[0])}</a>`).join("");
  const container = document.querySelector("#palettes");
  container.innerHTML = palettes.map((palette, index) => `<article class="palette" id="palette-${index + 1}" aria-labelledby="palette-title-${index + 1}">
    <header class="palette-heading"><span class="number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><h2 id="palette-title-${index + 1}">${escapeHtml(palette.name)} ${palette.recommended ? '<span class="recommended">추천</span>' : ""}</h2><p>${escapeHtml(palette.description)}</p></div></header>
    <div class="pair">${["light", "dark"].map(mode => `<section class="variant" aria-label="${index + 1}번 ${modes[mode]}"><div class="variant-heading"><strong>${modes[mode]}</strong><button class="open-preview" type="button" data-palette="${index}" data-open-mode="${mode}" aria-label="${index + 1}번 ${modes[mode]} 크게 보기">크게 보기 ↗</button></div>${sitePreview(palette, mode)}${swatches(palette[mode])}</section>`).join("")}</div>
  </article>`).join("");
  container.setAttribute("aria-busy", "false");

  const dialog = document.querySelector("#expanded");
  let selectedIndex = 0;
  let selectedMode = "light";
  let opener;
  function updateDialog() {
    document.querySelector("#expanded-title").textContent = `${String(selectedIndex + 1).padStart(2, "0")} · ${palettes[selectedIndex].name}`;
    document.querySelector("#expanded-content").innerHTML = sitePreview(palettes[selectedIndex], selectedMode);
    for (const button of dialog.querySelectorAll("[data-mode]")) button.setAttribute("aria-pressed", String(button.dataset.mode === selectedMode));
  }
  container.addEventListener("click", event => {
    const button = event.target.closest("[data-palette]");
    if (!button) return;
    opener = button;
    selectedIndex = Number(button.dataset.palette);
    selectedMode = button.dataset.openMode;
    updateDialog();
    dialog.showModal();
    document.querySelector("#close-dialog").focus();
  });
  dialog.querySelector(".mode-tabs").addEventListener("click", event => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    selectedMode = button.dataset.mode;
    updateDialog();
  });
  document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => opener?.focus());
}

start().catch(error => {
  const container = document.querySelector("#palettes");
  container.textContent = `${error.message} 페이지를 새로고침해 주세요.`;
  container.setAttribute("aria-busy", "false");
});
