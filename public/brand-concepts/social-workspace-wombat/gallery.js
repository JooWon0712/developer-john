(() => {
  "use strict";

  const gallery = document.getElementById("concept-grid");
  if (!gallery) return;

  const supplied = new Map();
  if (Array.isArray(window.workspaceConcepts)) {
    for (const concept of window.workspaceConcepts) {
      const id = String(concept?.id ?? "").padStart(2, "0");
      if (!/^(0[1-9]|10)$/.test(id)) continue;
      supplied.set(id, concept);
    }
  }

  const concepts = Array.from({ length: 10 }, (_, index) => {
    const id = String(index + 1).padStart(2, "0");
    const data = supplied.get(id);
    const name = typeof data?.name === "string" ? data.name : `시안 ${id}`;
    const copy = typeof data?.copy === "string" ? data.copy : "개발자 John의 작은 작업실";
    return {
      id, name, copy,
      src: `concept-${id}.jpg`,
      alt: `${id} ${name}. 항구 카페의 웜뱃 그림과 developer-john 제목바, 개발자 John의 작은 작업실 제목을 조합한 공유 이미지. ${copy}`,
    };
  });
  const items = concepts;
  const byId = new Map(items.map(item => [item.id, item]));

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  for (const item of concepts) {
    const card = node("article", "concept-card");
    card.dataset.id = item.id;
    const heading = node("header", "card-heading");
    heading.append(node("p", "card-label", `시안 ${item.id}`), node("h2", "", item.name));
    const preview = node("a", "preview-link");
    preview.dataset.id = item.id;
    preview.href = item.src;
    preview.target = "_blank";
    preview.rel = "noopener";
    preview.setAttribute("aria-label", `${item.id} ${item.name} 크게 보기`);
    const thumbnail = node("img");
    thumbnail.src = item.src;
    thumbnail.alt = item.alt;
    thumbnail.width = 1200;
    thumbnail.height = 630;
    thumbnail.loading = item.id === "01" ? "eager" : "lazy";
    thumbnail.decoding = "async";
    preview.append(thumbnail);
    const footer = node("footer", "card-footer");
    const original = node("a", "", "원본 ↗");
    original.href = item.src;
    original.target = "_blank";
    original.rel = "noopener";
    original.setAttribute("aria-label", `${item.id} ${item.name} 원본 새 탭에서 보기`);
    const download = node("a", "", "다운로드 ↓");
    download.href = item.src;
    download.download = item.src;
    download.setAttribute("aria-label", `${item.id} ${item.name} JPEG 다운로드`);
    footer.append(original, download);
    card.append(heading, node("p", "card-copy", item.copy), preview, footer);
    gallery.append(card);
  }

  const dialog = document.getElementById("image-dialog");
  const image = document.getElementById("dialog-image");
  const title = document.getElementById("dialog-title");
  const copy = document.getElementById("dialog-copy");
  const counter = document.getElementById("dialog-counter");
  const closeButton = document.getElementById("dialog-close");
  const previousButton = document.getElementById("dialog-previous");
  const nextButton = document.getElementById("dialog-next");
  const original = document.getElementById("dialog-original");
  const download = document.getElementById("dialog-download");
  if (!dialog || !image || !title || !copy || !counter || !closeButton || !previousButton ||
      !nextButton || !original || !download || typeof dialog.showModal !== "function" ||
      typeof dialog.close !== "function") return;

  let activeIndex = -1;
  let trigger = null;

  function showItem(index) {
    const item = items[index];
    if (!item) return;
    activeIndex = index;
    title.textContent = `${item.id} · ${item.name}`;
    copy.textContent = item.copy;
    counter.textContent = `${index + 1} / ${items.length}`;
    image.alt = item.alt;
    image.src = item.src;
    original.href = item.src;
    download.href = item.src;
    download.download = item.src;
    original.setAttribute("aria-label", `${title.textContent} 원본 새 탭에서 보기`);
    download.setAttribute("aria-label", `${title.textContent} JPEG 다운로드`);
    previousButton.disabled = index === 0;
    nextButton.disabled = index === items.length - 1;
  }

  gallery.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest?.("a.preview-link[data-id]");
    if (!link || !gallery.contains(link)) return;
    const item = byId.get(link.dataset.id);
    if (!item) return;
    try {
      dialog.showModal();
    } catch {
      return;
    }
    event.preventDefault();
    trigger = link;
    showItem(items.indexOf(item));
    document.body.classList.add("dialog-open");
  });
  previousButton.addEventListener("click", () => showItem(activeIndex - 1));
  nextButton.addEventListener("click", () => showItem(activeIndex + 1));
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener("keydown", event => {
    if (!dialog.open || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showItem(activeIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
    original.removeAttribute("href");
    download.removeAttribute("href");
    download.removeAttribute("download");
    document.body.classList.remove("dialog-open");
    activeIndex = -1;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  });
})();
