import { services, visuals } from './options.js';
const parameters = new URLSearchParams(location.search);
const service = services.find(item => item.id === parameters.get('service')) ?? services[0];
const visual = visuals.find(item => item.id === parameters.get('visual')) ?? visuals[0];
document.title = `${service.id}. ${service.name} · ${visual.name} | 홈 시안`;
document.getElementById('visual-title').textContent = visual.title;
async function loadPartial(id, path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot load ${path}`);
  document.getElementById(id).innerHTML = await response.text();
}
try {
  await Promise.all([
    loadPartial('service-render', `service-${service.id}.html`),
    visual.id === 'mascot'
      ? Promise.resolve(document.getElementById('visual-render').innerHTML = '<div class="mascot-visual"><img src="/characters/wombat-style-pixel-v2.png" width="1536" height="1024" alt="컴퓨터 앞에 앉은 픽셀 웜뱃"></div>')
      : loadPartial('visual-render', `visual-${visual.id}.html`)
  ]);
} catch {
  document.getElementById('service-render').textContent = '시안을 불러오지 못했습니다. 새로고침해주세요.';
}
