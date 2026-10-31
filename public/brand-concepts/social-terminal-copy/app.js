(() => {
  "use strict";

  const gallery = document.getElementById("comparison");
  const dialog = document.getElementById("image-dialog");
  const image = document.getElementById("dialog-image");
  const title = document.getElementById("dialog-title");
  const description = document.getElementById("dialog-description");
  const file = document.getElementById("dialog-file");
  const closeButton = document.getElementById("dialog-close");
  const previousButton = document.getElementById("dialog-previous");
  const nextButton = document.getElementById("dialog-next");
  const navigation = document.getElementById("dialog-navigation");
  const counter = document.getElementById("dialog-counter");
  const viewButtons = [...document.querySelectorAll(".view-button[data-view]")];

  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      document.body.dataset.view = button.dataset.view === "compact" ? "compact" : "default";
      for (const candidate of viewButtons) {
        candidate.setAttribute("aria-pressed", String(candidate.dataset.view === document.body.dataset.view));
      }
    });
  }

  if (!gallery || !dialog || !image || !title || !description || !file || !closeButton ||
      !previousButton || !nextButton || !navigation || !counter ||
      typeof dialog.showModal !== "function" || typeof dialog.close !== "function") return;

  const items = new Map();
  for (const card of gallery.querySelectorAll(".preview-card[data-number]")) {
    const link = card.querySelector(".image-link");
    const preview = link?.querySelector("img");
    const heading = card.querySelector("h3");
    const caption = card.querySelector(".card-description");
    if (!link || !preview || !heading) continue;
    items.set(card.dataset.number, {
      number: card.dataset.number,
      title: heading.textContent.trim(),
      description: caption?.textContent.trim() ?? "",
      src: link.getAttribute("href"),
      alt: preview.alt,
    });
  }
  const variants = [...items.values()];
  let active = null;
  let trigger = null;

  function showItem(item) {
    active = item;
    title.textContent = `${item.number} · ${item.title}`;
    description.textContent = item.description;
    image.alt = item.alt;
    image.src = item.src;
    file.href = item.src;
    file.setAttribute("aria-label", `${title.textContent} 원본 파일 새 탭에서 보기`);
    const index = variants.indexOf(item);
    navigation.hidden = index < 0;
    previousButton.disabled = index <= 0;
    nextButton.disabled = index < 0 || index === variants.length - 1;
    counter.textContent = index < 0 ? "" : `${item.number} / ${variants.length}`;
  }

  function move(offset) {
    const index = variants.indexOf(active);
    const item = index < 0 ? null : variants[index + offset];
    if (item) showItem(item);
  }

  gallery.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
        event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest?.(".image-link");
    if (!link || !gallery.contains(link)) return;
    const card = link.closest(".preview-card[data-number]");
    const item = items.get(card?.dataset.number);
    if (!item) return;
    try {
      dialog.showModal();
    } catch {
      return;
    }
    event.preventDefault();
    trigger = link;
    showItem(item);
    document.body.classList.add("dialog-open");
  });

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
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
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
    file.removeAttribute("href");
    document.body.classList.remove("dialog-open");
    active = null;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  });
})();
