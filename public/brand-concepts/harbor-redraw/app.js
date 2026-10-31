(() => {
  "use strict";

  const grid = document.getElementById("comparison");
  const dialog = document.getElementById("image-dialog");
  const image = document.getElementById("dialog-image");
  const title = document.getElementById("dialog-title");
  const fileLink = document.getElementById("dialog-file");
  const closeButton = document.getElementById("dialog-close");
  const comparisonSwitch = document.getElementById("comparison-switch");
  const originalButton = document.getElementById("show-original");
  const variantButton = document.getElementById("show-variant");

  if (!grid || !dialog || !image || !title || !fileLink || !closeButton ||
      !comparisonSwitch || !originalButton || !variantButton ||
      typeof dialog.showModal !== "function" || typeof dialog.close !== "function") return;

  const items = new Map();
  for (const card of grid.querySelectorAll(".drawing-card[data-number]")) {
    const link = card.querySelector(".image-link");
    const preview = link?.querySelector("img");
    if (!link || !preview) continue;
    items.set(card.dataset.number, {
      number: card.dataset.number,
      title: card.dataset.title,
      src: link.getAttribute("href"),
      alt: preview.alt,
    });
  }

  const original = items.get("original");
  if (!original) return;

  let selected = null;
  let trigger = null;

  function showItem(item) {
    title.textContent = `${item.number === "original" ? "원본" : item.number} · ${item.title}`;
    image.alt = item.alt;
    image.src = item.src;
    fileLink.href = item.src;
    fileLink.setAttribute("aria-label", `${title.textContent} 원본 파일 새 탭에서 보기`);
    originalButton.setAttribute("aria-pressed", String(item.number === "original"));
    variantButton.setAttribute("aria-pressed", String(item.number !== "original"));
  }

  grid.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
        event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest?.(".image-link");
    if (!link || !grid.contains(link)) return;
    const card = link.closest(".drawing-card[data-number]");
    const item = items.get(card?.dataset.number);
    if (!item) return;

    try {
      dialog.showModal();
    } catch {
      return;
    }

    event.preventDefault();
    trigger = link;
    selected = item;
    comparisonSwitch.hidden = item.number === "original";
    variantButton.textContent = `${item.number} ${item.title}`;
    showItem(item);
    document.body.classList.add("dialog-open");
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
    fileLink.removeAttribute("href");
    document.body.classList.remove("dialog-open");
    selected = null;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  });

  originalButton.addEventListener("click", () => {
    if (dialog.open) showItem(original);
  });
  variantButton.addEventListener("click", () => {
    if (dialog.open && selected) showItem(selected);
  });
})();
