(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const state = {
    page: ['services', 'about'].includes(params.get('page')) ? params.get('page') : 'home',
    device: document.body.dataset.defaultDevice === 'mobile' || params.get('device') === 'mobile' ? 'mobile' : 'desktop',
    language: params.get('lang') === 'en' ? 'en' : 'ko'
  };
  const cards = [...document.querySelectorAll('.concept-card')];
  const contentObservers = new Map();
  let scheduled = false;
  function fit(card) {
    const frame = card.querySelector('iframe');
    const stage = card.querySelector('.preview-stage');
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;
      const base = state.device === 'mobile' ? {width:390,height:844} : {width:1280,height:900};
      const height = Math.ceil(Math.max(base.height, doc.documentElement.scrollHeight, doc.body.scrollHeight, doc.body.getBoundingClientRect().height));
      const scale = Math.min(stage.clientWidth / base.width, 1);
      frame.style.height = `${height}px`;
      stage.style.height = `${Math.ceil(height * scale)}px`;
      stage.style.setProperty('--preview-scale', String(scale));
    } catch (_) { /* The standalone page links remain available. */ }
  }
  function fitAll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; cards.forEach(fit); });
  }
  function update(writeUrl) {
    document.body.dataset.device = state.device;
    for (const key of ['page', 'device', 'language']) {
      document.querySelectorAll(`[data-${key}]`).forEach(button => {
        if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset[key] === state[key]));
      });
    }
    const base = state.device === 'mobile' ? {width:390,height:844} : {width:1280,height:900};
    cards.forEach(card => {
      const frame = card.querySelector('iframe');
      const next = new URLSearchParams({preview:'1'});
      if (state.page !== 'home') next.set('page', state.page);
      if (state.language === 'en') next.set('lang', 'en');
      const target = `concept-${card.dataset.concept}.html?${next}`;
      frame.style.width = `${base.width}px`;
      frame.style.height = `${base.height}px`;
      if (frame.getAttribute('src') === target) {
        requestAnimationFrame(() => fit(card));
      } else frame.src = target;
      next.delete('preview');
      card.querySelector('.open-concept').href = `concept-${card.dataset.concept}.html${next.size ? '?' + next : ''}`;
    });
    const pages = {home:'홈',services:'서비스',about:'소개'};
    document.querySelector('.preview-note').textContent = `${state.device === 'mobile' ? '모바일 390px' : '데스크톱 1280px'} · ${pages[state.page]} · ${state.language === 'en' ? 'English' : '한국어'}`;
    if (writeUrl) {
      const url = new URL(location.href);
      url.search = '';
      if (state.page !== 'home') url.searchParams.set('page', state.page);
      if (state.device !== 'desktop') url.searchParams.set('device', state.device);
      if (state.language !== 'ko') url.searchParams.set('lang', state.language);
      history.replaceState(null, '', url);
    }
    fitAll();
  }
  cards.forEach(card => {
    const frame = card.querySelector('iframe');
    const ready = () => {
      contentObservers.get(frame)?.disconnect();
      fit(card);
      try {
        const doc = frame.contentDocument;
        if (!doc?.body) return;
        [...doc.images].forEach(img => img.addEventListener('load', () => fit(card), {once:true}));
        if ('ResizeObserver' in window) {
          const observer = new ResizeObserver(() => fit(card));
          observer.observe(doc.body);
          contentObservers.set(frame, observer);
        }
      } catch (_) {}
    };
    frame.addEventListener('load', ready);
    if (frame.contentDocument?.readyState === 'complete') ready();
  });
  ['page', 'device', 'language'].forEach(key => {
    document.querySelectorAll(`button[data-${key}]`).forEach(button => button.addEventListener('click', () => {
      state[key] = button.dataset[key]; update(true);
    }));
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(fitAll);
    cards.forEach(card => observer.observe(card.querySelector('.preview-stage')));
  } else addEventListener('resize', fitAll);
  update(false);
  addEventListener('load', fitAll);
})();
