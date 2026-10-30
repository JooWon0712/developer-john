import { concepts } from './concepts.js';

const requestedId = new URLSearchParams(location.search).get('concept');
const selected = concepts.find(concept => concept.id === requestedId) ?? concepts[0];
document.title = `${selected.id}. ${selected.name} | 홈 화면 시안`;
document.body.dataset.concept = selected.id;
try {
  const response = await fetch(`concept-${selected.id}.html`);
  if (!response.ok) throw new Error('Preview unavailable');
  const content = await response.text();
  document.getElementById('preview-content').innerHTML = content;
} catch {
  document.getElementById('preview-content').innerHTML = '<p class="loading">시안을 불러오지 못했습니다. 페이지를 새로고침해주세요.</p>';
}
