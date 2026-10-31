(() => {
  "use strict";

  function initializePreview() {
    const data = document.getElementById("preview-data");
    if (!data) return;

    let parsed;
    try {
      parsed = JSON.parse(data.textContent);
    } catch {
      return;
    }
    if (!Array.isArray(parsed)) return;

    const itemByNumber = new Map();
    for (const item of parsed) {
      const num = Number(item?.num);
      if (!Number.isInteger(num) || num < 1 || typeof item?.filename !== "string") continue;
      itemByNumber.set(num, {
        num,
        title: String(item.title ?? ""),
        desc: String(item.desc ?? ""),
        filename: item.filename,
      });
    }
    const items = [...itemByNumber.values()].sort((a, b) => a.num - b.num);
    if (!items.length) return;

    const grid = document.getElementById("preview-grid");
    const articles = grid ? [...grid.querySelectorAll("article.preview-item[data-num]")] : [];
    const filters = [...document.querySelectorAll("button.filter-button[data-range]")];
    const count = document.getElementById("result-count");
    const dialog = document.getElementById("preview-dialog");
    const image = document.getElementById("dialog-image");
    const title = document.getElementById("dialog-title");
    const description = document.getElementById("dialog-desc");
    const counter = document.getElementById("dialog-counter");
    const status = document.getElementById("dialog-status");
    const closeButton = document.getElementById("dialog-close");
    const previousButton = document.getElementById("dialog-prev");
    const nextButton = document.getElementById("dialog-next");
    const original = document.getElementById("dialog-original");
    const canOpenDialog = Boolean(image && dialog &&
      typeof dialog.showModal === "function" && typeof dialog.close === "function");

    let visibleItems = items;
    let activeNumber = null;
    let trigger = null;

    function setStatus(message) {
      if (status) status.textContent = message;
    }

    function updateNavigation() {
      const index = visibleItems.findIndex((item) => item.num === activeNumber);
      if (previousButton) previousButton.disabled = index <= 0;
      if (nextButton) nextButton.disabled = index < 0 || index >= visibleItems.length - 1;
      if (counter && activeNumber !== null) {
        counter.textContent = `${String(activeNumber).padStart(2, "0")} / ${items.length}`;
      }
    }

    function displayItem(item) {
      activeNumber = item.num;
      const number = String(item.num).padStart(2, "0");
      if (title) title.textContent = `${number} ${item.title}`;
      if (description) description.textContent = item.desc;
      if (original) {
        original.href = item.filename;
        original.dataset.num = String(item.num);
      }
      image.alt = `${number} ${item.title}. ${item.desc}`;
      image.dataset.num = String(item.num);
      dialog.dataset.num = String(item.num);
      setStatus("로딩 중...");
      updateNavigation();
      // Only the selected original is requested; neighboring images are not preloaded.
      image.src = item.filename;
    }

    function openItem(item, link) {
      if (!canOpenDialog) return false;
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          return false;
        }
      }
      trigger = link;
      displayItem(item);
      return true;
    }

    function closeDialog() {
      if (dialog?.open && typeof dialog.close === "function") dialog.close();
    }

    function moveSelection(offset) {
      const index = visibleItems.findIndex((item) => item.num === activeNumber);
      const nextItem = index >= 0 ? visibleItems[index + offset] : null;
      if (nextItem) displayItem(nextItem);
    }

    function applyFilter(range) {
      const bounds = /^(\d+)-(\d+)$/.exec(range);
      if (range !== "all" && (!bounds || Number(bounds[1]) > Number(bounds[2]))) return;
      visibleItems = range === "all" ? items : items.filter((item) =>
        item.num >= Number(bounds[1]) && item.num <= Number(bounds[2]));
      const allowedNumbers = new Set(visibleItems.map((item) => item.num));
      for (const article of articles) article.hidden = !allowedNumbers.has(Number(article.dataset.num));
      for (const button of filters) button.setAttribute("aria-pressed", String(button.dataset.range === range));
      if (count) count.textContent = `${visibleItems.length}개 / ${items.length}개`;
      if (dialog?.open && !allowedNumbers.has(activeNumber)) closeDialog();
      updateNavigation();
    }

    for (const button of filters) {
      button.addEventListener("click", () => applyFilter(button.dataset.range));
    }

    grid?.addEventListener("click", (event) => {
      if (event.defaultPrevented || (event.button != null && event.button !== 0) ||
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const link = event.target?.closest?.("a.preview-card[data-num]");
      if (!link || !grid.contains(link)) return;
      const item = itemByNumber.get(Number(link.dataset.num));
      if (!item || !visibleItems.some((candidate) => candidate.num === item.num)) return;
      if (openItem(item, link)) event.preventDefault();
    });

    closeButton?.addEventListener("click", closeDialog);
    previousButton?.addEventListener("click", () => moveSelection(-1));
    nextButton?.addEventListener("click", () => moveSelection(1));

    dialog?.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });

    dialog?.addEventListener("close", () => {
      if (image) {
        image.removeAttribute("src");
        image.removeAttribute("srcset");
        image.alt = "";
        delete image.dataset.num;
      }
      delete dialog.dataset.num;
      activeNumber = null;
      setStatus("");
      updateNavigation();
      const focusTarget = trigger?.isConnected && !trigger.closest("[hidden]")
        ? trigger
        : filters.find((button) => button.getAttribute("aria-pressed") === "true");
      trigger = null;
      focusTarget?.focus({ preventScroll: true });
    });

    dialog?.addEventListener("click", (event) => {
      if (!dialog.open || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    });

    dialog?.addEventListener("keydown", (event) => {
      if (!dialog.open || event.ctrlKey || event.metaKey || event.altKey ||
        event.target?.closest?.("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(event.key === "ArrowLeft" ? -1 : 1);
      }
    });

    image?.addEventListener("load", () => {
      if (dialog?.open && image.hasAttribute("src") && image.naturalWidth > 0) setStatus("");
    });
    image?.addEventListener("error", () => {
      if (dialog?.open && image.hasAttribute("src")) {
        setStatus("이미지를 불러오지 못했습니다. 원본 보기로 확인해 주세요.");
      }
    });

    const initialRange = filters.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.range;
    applyFilter(initialRange || "all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePreview, { once: true });
  } else {
    initializePreview();
  }
})();
