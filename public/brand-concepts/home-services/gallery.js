import { services, visuals } from './options.js';
let selectedService = services[0];
let selectedVisual = visuals[0];
const frames = document.getElementById('context-preview');
function updatePreview() {
  const url = `preview.html?service=${selectedService.id}&visual=${selectedVisual.id}`;
  frames.src = url;
  frames.title = `${selectedService.id} ${selectedService.name} / ${selectedVisual.name} 홈 미리보기`;
  document.getElementById('standalone-link').href = url;
  document.getElementById('selected-service-label').textContent = `${selectedService.id} ${selectedService.name}`;
  document.getElementById('visual-description').textContent = selectedVisual.description;
  for (const button of document.querySelectorAll('[data-service]')) button.setAttribute('aria-pressed', String(button.dataset.service === selectedService.id));
  for (const button of document.querySelectorAll('[data-visual]')) button.setAttribute('aria-pressed', String(button.dataset.visual === selectedVisual.id));
}
for (const option of services) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'service-choice';
  button.dataset.service = option.id;
  button.setAttribute('aria-pressed', String(option.id === selectedService.id));
  button.setAttribute('aria-label', `${option.id} ${option.name} 선택`);
  button.innerHTML = `<div class="service-sample" aria-hidden="true"><div class="chrome"><span class="dots"><span></span><span></span><span></span></span><span class="window-title">/services</span></div><div class="sample-content"></div></div><span class="service-choice-copy"><strong>${option.id} / ${option.name}</strong><small>${option.description}</small></span>`;
  button.addEventListener('click', () => { selectedService = option; updatePreview(); });
  document.getElementById('service-choices').append(button);
}
await Promise.all(services.map(async option => {
  const sample = document.querySelector(`[data-service="${option.id}"] .sample-content`);
  try {
    const response = await fetch(`service-${option.id}.html`);
    if (!response.ok) throw new Error('Sample unavailable');
    sample.innerHTML = await response.text();
  } catch { sample.textContent = '시안을 불러오지 못했습니다.'; }
}));
for (const option of visuals) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'visual-choice';
  button.dataset.visual = option.id;
  button.setAttribute('aria-pressed', String(option.id === selectedVisual.id));
  button.setAttribute('aria-label', `${option.name} 선택`);
  button.innerHTML = `<div class="visual-sample" aria-hidden="true"><div class="visual-thumbnail"></div></div><span class="visual-choice-label">${option.name}${option.id === 'desk' ? '<small>추천</small>' : ''}</span>`;
  button.addEventListener('click', () => { selectedVisual = option; updatePreview(); });
  document.getElementById('visual-choices').append(button);
}
await Promise.all(visuals.map(async option => {
  const thumbnail = document.querySelector(`[data-visual="${option.id}"] .visual-thumbnail`);
  if (option.id === 'mascot') {
    thumbnail.innerHTML = '<div class="mascot-sample"><img src="/characters/wombat-style-pixel-v2.png" width="1536" height="1024" alt=""></div>';
    return;
  }
  try {
    const response = await fetch(`visual-${option.id}.html`);
    if (!response.ok) throw new Error('Visual unavailable');
    thumbnail.innerHTML = await response.text();
  } catch { thumbnail.textContent = '시안을 불러오지 못했습니다.'; }
}));
function scaleVisuals() {
  for (const sample of document.querySelectorAll('.visual-sample')) sample.firstElementChild.style.transform = `scale(${sample.clientWidth / 600})`;
}
new ResizeObserver(scaleVisuals).observe(document.getElementById('visual-choices'));
scaleVisuals();
for (const button of document.querySelectorAll('[data-size]')) button.addEventListener('click', () => {
  document.getElementById('context-stage').dataset.size = button.dataset.size;
  for (const control of document.querySelectorAll('[data-size]')) control.setAttribute('aria-pressed', String(control === button));
});
document.getElementById('visual-description').textContent = selectedVisual.description;
