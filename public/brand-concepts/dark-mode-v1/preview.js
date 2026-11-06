"use strict";

const palettes = [
  { number: 1, name: "깊은 바다 청록", english: "Deep Harbor", recommended: true, description: "항구의 밤바다와 민트빛 조명. 가장 자연스럽게 이어지는 차분한 청록입니다.", paper: "#0E2024", surface: "#173238", ink: "#F1F3E8", muted: "#B2C8C3", accent: "#91D4BC", line: "#42666A" },
  { number: 2, name: "잉크 네이비 + 샌드", english: "Ink & Sand", recommended: false, description: "짙은 잉크에 따뜻한 모래색. JW 마크의 네이비·골드 분위기와 잘 맞습니다.", paper: "#141D2E", surface: "#202D43", ink: "#F5EEDD", muted: "#B8C3D3", accent: "#E5BD86", line: "#52617A" },
  { number: 3, name: "차콜 + 세이지", english: "Quiet Sage", recommended: false, description: "녹색이 은은하게 섞인 차콜. 오래 읽는 서비스 설명에 편안하고 담백합니다.", paper: "#1B2220", surface: "#29342E", ink: "#EFF1E8", muted: "#B8C5B6", accent: "#B6D59C", line: "#5C7162" },
  { number: 4, name: "에스프레소 + 앰버", english: "Late Café", recommended: false, description: "커피빛 바탕과 앰버 조명. 덮은 노트북 위에서 잠든 웜뱃과 밤 카페의 포근함을 가장 강조합니다.", paper: "#251C19", surface: "#382A25", ink: "#F7EEE0", muted: "#D2BAA9", accent: "#F1BD77", line: "#81634F" },
  { number: 5, name: "슬레이트 + 라벤더", english: "Moonlit Slate", recommended: false, description: "푸른 회색에 옅은 보라. 달빛 같은 인상으로 다섯 안 중 가장 선명한 변화를 줍니다.", paper: "#1C2030", surface: "#2B3146", ink: "#F0EDF7", muted: "#C1BFD3", accent: "#C5B7F1", line: "#686581" },
];
const colorRoles = [["paper", "배경"], ["surface", "표면"], ["ink", "본문"], ["muted", "보조"], ["accent", "강조"], ["line", "테두리"]];
const imageSources = { day: "/images/home/harbor-cafe-cozy-pixel-light-clean-v1.webp", night: "/images/home/harbor-cafe-cozy-pixel-night-desk-sleep-v1.webp" };
const imageDescriptions = { day: "작은 항구 카페에서 노트북을 사용하는 회색 아기 웜뱃의 낮 픽셀 그림", night: "랜턴 불빛이 켜진 밤의 항구 카페에서 회색 아기 웜뱃이 안경을 테이블에 벗어 두고 덮은 노트북 위에 팔과 머리를 올려 잠든 픽셀 그림" };
const dialog = document.querySelector("#concept-dialog");
let imageMode = "night";
let lastExpandedButton;
let missingNightImage = false;

function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
function minimumContrast(palette, role) {
  return Math.min(contrast(palette[role], palette.paper), contrast(palette[role], palette.surface)).toFixed(2);
}
function paletteStyle(palette) {
  return colorRoles.map(([role]) => `--${role}:${palette[role]}`).join(";");
}
function sampleMarkup(palette, expanded = false) {
  return `<div class="sample${expanded ? " dialog-sample" : ""}" style="${paletteStyle(palette)}">
    <div class="sample-header"><div class="sample-brand"><img src="/brand/jw-mark.svg" width="40" height="40" alt="">developer-john</div><div class="sample-nav" aria-label="헤더 표시 예시"><span>서비스<small>~/services</small></span><span class="current">소개<small>~/about</small></span></div></div>
    <div class="sample-container">
      <div class="sample-about"><div class="sample-copy"><p class="eyebrow">ABOUT JOHN</p><h3>편하게 둘러봐 주세요.</h3><p class="summary">제가 만든 서비스와 관심 있는 것들을 소개합니다.</p><span class="sample-link">서비스 둘러보기 <span aria-hidden="true">→</span></span><p class="approach">AI 코딩 에이전트를 활용해 관심 있는 아이디어를 웹서비스로 구현하고 있습니다.</p><ul class="sample-tags"><li>게임</li><li>일상의 아이디어</li><li>웹서비스</li></ul></div>
        <figure class="terminal"><div class="terminal-bar"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="terminal-title">하와이에서 살고 싶다</span></div><img class="harbor-image" src="${imageSources[imageMode]}" width="1536" height="1024" loading="${expanded ? "eager" : "lazy"}" alt="${imageDescriptions[imageMode]}"></figure>
      </div>
      <div class="sample-services"><p class="sample-command"><span>john@workspace:~$</span> ls ./services</p><div class="sample-service-list">
        <div class="service-card"><div><span class="service-category">[ PC 도구 ]</span><h4>Codex Usage Overlay</h4><p class="service-feature">남은 사용 한도를, 작업 화면에서 바로.</p><p class="service-description">Codex의 남은 사용 한도를 작업 중에도 바로 확인하고 싶어 직접 만들었습니다. 주간·5시간 잔여 한도와 초기화 일정을 Codex 창 위에 작게 표시하는 Windows 앱입니다.</p><small class="service-platform">Windows 10 / 11 · x64</small></div><span class="service-arrow" aria-hidden="true">→</span></div>
        <div class="service-card"><div><span class="service-category">[ PC 도구 ]</span><h4>NAS Desktop</h4><p class="service-feature">내 NAS를, 익숙한 앱처럼.</p><p class="service-description">시놀로지 NAS를 전용 창에서 편하게 쓰고 싶어 직접 만들었습니다. 지금도 제 NAS에 접속할 때 사용하는 Windows 앱입니다.</p><small class="service-platform">Windows 10 / 11 · x64</small></div><span class="service-arrow" aria-hidden="true">→</span></div>
      </div></div><div class="sample-footer"><span>작은 아이디어를 하나씩 구현합니다.</span><span>© developer-john</span></div>
    </div>
  </div>`;
}
function cardMarkup(palette) {
  return `<article id="concept-${palette.number}" class="concept-card" aria-labelledby="concept-title-${palette.number}">
    <div class="concept-heading"><div><div class="concept-title-line"><span class="concept-number">${palette.number}</span><h2 id="concept-title-${palette.number}">${palette.name}</h2></div><span class="concept-english">${palette.english}</span></div>${palette.recommended ? '<span class="recommendation">추천</span>' : ""}</div>
    <p class="concept-description">${palette.description}</p>
    <ul class="swatches" aria-label="${palette.number}번 색상표">${colorRoles.map(([role, label]) => `<li><span class="swatch-color" style="background:${palette[role]}"></span><strong>${label}</strong><code>${palette[role]}</code></li>`).join("")}</ul>
    ${sampleMarkup(palette)}
    <div class="contrast"><p>최소 대비 <strong>본문 ${minimumContrast(palette, "ink")}:1</strong> · 보조 ${minimumContrast(palette, "muted")}:1 · 강조 ${minimumContrast(palette, "accent")}:1</p><p class="contrast-note">배경·표면 중 낮은 값 / 일반 텍스트 AA 4.5:1 기준 충족</p></div>
    <button type="button" class="expand-button" data-expand="${palette.number}" aria-haspopup="dialog">${palette.number}번 시안 크게 보기 <span aria-hidden="true">↗</span></button>
  </article>`;
}
function updateImageStatus() {
  document.querySelector("#image-status").textContent = imageMode === "day" ? "낮 그림으로 비교 중입니다." : missingNightImage ? "밤 그림을 불러오지 못해 낮 그림을 대신 표시합니다." : "밤 그림으로 비교 중입니다.";
}
function bindImageFallbacks(container) {
  container.querySelectorAll(".harbor-image").forEach(image => {
    image.addEventListener("error", () => {
      if (!image.getAttribute("src").endsWith(imageSources.night)) return;
      missingNightImage = true;
      image.src = imageSources.day;
      image.alt = `${imageDescriptions.day} (밤 그림을 불러오지 못해 대신 표시)`;
      updateImageStatus();
    });
  });
}
function setImageMode(mode) {
  imageMode = mode;
  missingNightImage = false;
  document.querySelectorAll("[data-image-mode]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.imageMode === mode)));
  document.querySelectorAll(".harbor-image").forEach(image => {
    image.src = imageSources[mode];
    image.alt = imageDescriptions[mode];
  });
  updateImageStatus();
}
document.querySelector("#concepts").innerHTML = palettes.map(cardMarkup).join("");
bindImageFallbacks(document);
document.querySelectorAll("[data-image-mode]").forEach(button => button.addEventListener("click", () => setImageMode(button.dataset.imageMode)));
document.querySelectorAll("[data-expand]").forEach(button => button.addEventListener("click", () => {
  const palette = palettes.find(entry => entry.number === Number(button.dataset.expand));
  lastExpandedButton = button;
  document.querySelector("#dialog-title").textContent = `${palette.number}. ${palette.name}${palette.recommended ? " · 추천" : ""}`;
  document.querySelector("#dialog-content").innerHTML = sampleMarkup(palette, true);
  bindImageFallbacks(dialog);
  dialog.showModal();
  document.body.style.overflow = "hidden";
  dialog.scrollTop = 0;
  document.querySelector("#close-dialog").focus();
}));
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  lastExpandedButton?.focus({ preventScroll: true });
});
