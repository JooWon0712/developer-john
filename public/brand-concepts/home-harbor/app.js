(() => {
  "use strict";
  const query = new URLSearchParams(location.search);
  const english = query.get("lang") === "en";
  const language = english ? "en" : "ko";
  const copy = {
    ko: { skip:"본문으로 바로가기", headline:"호기심을 펼쳐두는 곳.", introduction:"일상에서 떠오른 아이디어를 작은 웹서비스로 만들어 공유하려고 합니다.", services:"서비스 둘러보기", privacy:"개인정보처리방침", email:"john에게 이메일 보내기", navigation:"주 메뉴", language:"언어 선택", footerTagline:"아이디어를 일상으로", scene:"작은 항구가 보이는 카페에서 안경을 쓴 회색 아기 웜뱃이 노트북으로 작업하는 픽셀 그림" },
    en: { skip:"Skip to content", headline:"A small place for curious ideas.", introduction:"I turn ideas from everyday life into small web services to share.", services:"Explore services", privacy:"Privacy policy", email:"Email john", navigation:"Main navigation", language:"Choose language", footerTagline:"Ideas into everyday life.", scene:"Pixel art of a grey baby wombat wearing glasses and working on a laptop at a café overlooking a small harbor" }
  };
  const text = copy[language];
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = text[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-label]").forEach((element) => {
    const value = text[element.dataset.label];
    if (value) element.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-alt]").forEach((element) => { element.alt = text.scene; });
  document.querySelectorAll("[data-route]").forEach((element) => {
    const route = element.dataset.route;
    element.href = english ? (route === "/" ? "/en" : "/en" + route) : route;
  });
  document.querySelectorAll("[data-language]").forEach((element) => {
    const next = new URL(location.href);
    next.searchParams.set("lang", element.dataset.language);
    element.href = next.pathname + next.search + next.hash;
    if (element.dataset.language === language) element.setAttribute("aria-current", "true");
    else element.removeAttribute("aria-current");
  });
  const wordmark = document.querySelector(".concept-page .wordmark");
  if (wordmark) wordmark.setAttribute("aria-label", english ? "john Home" : "john 홈");

  const gallery = document.querySelector(".concept-gallery");
  if (!gallery) return;
  const stages = [...document.querySelectorAll(".preview-stage")];
  const fitPreview = (stage) => {
    const frame = stage.querySelector("iframe");
    if (!frame || !frame.contentDocument) return;
    try {
      const page = frame.contentDocument;
      const pageHeight = Math.max(900, page.documentElement.scrollHeight, page.body ? page.body.scrollHeight : 0);
      frame.style.height = pageHeight + "px";
      const scale = Math.min(stage.clientWidth / 1280, stage.clientHeight / pageHeight);
      stage.style.setProperty("--preview-scale", String(scale));
    } catch (_) { /* Original links remain available if an embed cannot be measured. */ }
  };
  const fitAll = () => stages.filter((stage) => !stage.closest("[hidden]")).forEach(fitPreview);
  stages.forEach((stage) => {
    const frame = stage.querySelector("iframe");
    frame.addEventListener("load", () => fitPreview(stage));
  });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(fitAll);
    stages.forEach((stage) => observer.observe(stage));
  } else window.addEventListener("resize", fitAll);

  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-concept]")];
  const filter = (choice, updateUrl) => {
    const valid = filters.some((button) => button.dataset.filter === choice) ? choice : "all";
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === valid)));
    cards.forEach((card) => { card.hidden = valid !== "all" && card.dataset.concept !== valid; });
    gallery.classList.toggle("single", valid !== "all");
    const count = cards.filter((card) => !card.hidden).length;
    const status = document.querySelector(".filter-status");
    if (status) status.textContent = "시안 " + count + "개 표시";
    if (updateUrl) {
      const next = new URL(location.href);
      if (valid === "all") next.searchParams.delete("view");
      else next.searchParams.set("view", valid);
      history.replaceState(null, "", next);
    }
    requestAnimationFrame(fitAll);
  };
  filters.forEach((button) => button.addEventListener("click", () => filter(button.dataset.filter, true)));
  filter(query.get("view") || "all", false);
  window.addEventListener("load", fitAll);
})();
