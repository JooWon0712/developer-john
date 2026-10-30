import { concepts } from './concepts.js';

const grid = document.getElementById('concept-grid');
const dialog = document.getElementById('preview-dialog');
const largePreview = document.getElementById('large-preview');
let mode = 'desktop';
let currentIndex = 0;

for (const [index, concept] of concepts.entries()) {
  const card = document.createElement('article');
  card.className = 'concept-card';
  card.innerHTML = `<button class="card-open" type="button" aria-label="${concept.id}. ${concept.name} 시안 크게 보기"><div class="card-art"><div class="thumbnail-stage" aria-hidden="true"><iframe src="preview.html?concept=${concept.id}" title="${concept.name} 축소 미리보기" tabindex="-1" loading="eager" inert></iframe></div></div><div class="card-copy"><div class="card-key"><span>${concept.id} / ${concept.label}</span>${concept.recommended ? '<span class="recommendation">추천</span>' : ''}</div><h2>${concept.name}</h2><p>${concept.description}</p></div></button>`;
  card.querySelector('button').addEventListener('click', () => openConcept(index));
  grid.append(card);
}

function scaleThumbnails() {
  for (const stage of document.querySelectorAll('.thumbnail-stage')) {
    const frame = stage.querySelector('iframe');
    const sourceWidth = mode === 'mobile' ? 390 : 1120;
    // Keep mobile mockups at phone proportions while showing their complete first screen.
    const scale = mode === 'mobile' ? Math.min(stage.clientHeight / 930, stage.clientWidth / sourceWidth) : stage.clientWidth / sourceWidth;
    frame.style.width = `${sourceWidth}px`;
    frame.style.height = mode === 'mobile' ? '1100px' : '920px';
    frame.style.transform = `scale(${scale})`;
    frame.style.left = `${Math.max(0, (stage.clientWidth - sourceWidth * scale) / 2)}px`;
  }
}

function applyMode(nextMode) {
  mode = nextMode;
  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  document.getElementById('dialog-stage').dataset.mode = mode;
  const selected = concepts[currentIndex];
  largePreview.title = `${selected.id}. ${selected.name} ${mode === 'mobile' ? '모바일' : '데스크톱'} 시안`;
  scaleThumbnails();
}

function loadConcept(index) {
  currentIndex = (index + concepts.length) % concepts.length;
  const concept = concepts[currentIndex];
  document.getElementById('dialog-title').textContent = concept.name;
  document.getElementById('dialog-eyebrow').textContent = `${concept.id} / ${concept.label}`;
  document.getElementById('dialog-index').textContent = `${concept.id} / 10`;
  document.getElementById('dialog-description').textContent = concept.description;
  largePreview.title = `${concept.id}. ${concept.name} ${mode === 'mobile' ? '모바일' : '데스크톱'} 시안`;
  largePreview.src = `preview.html?concept=${concept.id}`;
  document.getElementById('open-preview').href = largePreview.src;
}

function openConcept(index) {
  loadConcept(index);
  applyMode(mode);
  dialog.showModal();
}

for (const button of document.querySelectorAll('[data-mode]')) {
  button.addEventListener('click', () => applyMode(button.dataset.mode));
}
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
document.getElementById('previous-concept').addEventListener('click', () => loadConcept(currentIndex - 1));
document.getElementById('next-concept').addEventListener('click', () => loadConcept(currentIndex + 1));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
new ResizeObserver(scaleThumbnails).observe(grid);
applyMode(mode);
