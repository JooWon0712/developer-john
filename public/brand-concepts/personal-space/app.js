(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  const concept = ['01', '02', '03'].includes(document.body.dataset.concept) ? document.body.dataset.concept : '01';
  const page = ['services', 'about'].includes(query.get('page')) ? query.get('page') : 'home';
  const language = query.get('lang') === 'en' ? 'en' : 'ko';
  const english = language === 'en';
  const text = english ? {
    home: 'Home', services: 'Services', about: 'About', menu: 'Main navigation',
    skip: 'Skip to content', headline: 'Ideas to explore.\nServices to share.',
    introduction: 'John’s personal space for turning everyday interests and small needs into web services you can use.',
    eyebrow: 'DEVELOPER JOHN / PERSONAL SPACE', browse: 'Explore services', meet: 'About John',
    available: 'Something you can use', allServices: 'All services', game: 'Games',
    division: 'The Division 2', serviceTitle: 'Events & rewards',
    serviceDescription: 'Find event rewards and requirements in one place, then keep track of what you have claimed.',
    serviceNote: 'No account needed · Progress saved in your browser', openService: 'Open service',
    aboutHeading: 'Hello, I’m John.', aboutSummary: 'A developer sharing services shaped by personal interests and everyday ideas.',
    aboutBody: 'This is a place for my interests and ideas to take shape as useful web services. Right now, I play The Division 2 and share a tool for checking event rewards and tracking what I have claimed.',
    approachTitle: 'How I work', approach: 'I use AI coding agents to implement ideas and shape the services I want to share.',
    contact: 'Get in touch', contactDescription: 'Questions or feedback about a service? Send me an email.',
    serviceHeading: 'Find something useful.', serviceLead: 'Tools inspired by things I enjoy and needs I notice in everyday life.',
    privacy: 'Privacy Policy', footer: 'Ideas into everyday life.', back: 'Compare concepts',
    concepts: ['Harbor home', 'Services first', 'A small workspace'], preview: 'Concept',
    chapter: 'A little about this space', topics: ['Games', 'Everyday ideas', 'Web services'],
    labelHome: '/', labelServices: '/services', labelAbout: '/about'
  } : {
    home: '홈', services: '서비스', about: '소개', menu: '주 메뉴', skip: '본문으로 바로가기',
    headline: '떠오른 아이디어를,\n함께 써볼 수 있게.',
    introduction: '일상에서 발견한 필요와 관심사를 작은 웹서비스로 구현해 공유하는 John의 공간입니다.',
    eyebrow: 'DEVELOPER JOHN / PERSONAL SPACE', browse: '서비스 둘러보기', meet: 'John 소개',
    available: '지금 써볼 수 있는 서비스', allServices: '서비스 전체 보기', game: '게임',
    division: '디비전2', serviceTitle: '이벤트·보상 정보',
    serviceDescription: '이벤트 보상과 획득 조건을 한곳에서 확인하고, 받은 보상을 기록하세요.',
    serviceNote: '로그인 없이 이용 · 기록은 내 브라우저에 저장', openService: '서비스 열기',
    aboutHeading: '안녕하세요, John입니다.', aboutSummary: '관심 있는 것과 일상 속 아이디어를 서비스로 구현해 공유하는 개발자입니다.',
    aboutBody: '이곳은 개인적인 관심사와 작은 아이디어를 실제로 써볼 수 있는 서비스로 모으는 공간입니다. 요즘은 디비전2를 즐기며, 이벤트 보상을 확인하고 수령 여부를 기록하는 도구를 공유하고 있습니다.',
    approachTitle: '아이디어를 구현하는 방식', approach: 'AI 코딩 에이전트를 활용해 관심 있는 아이디어를 웹서비스로 구현하고 있습니다.',
    contact: '이야기 나누기', contactDescription: '서비스에 대한 질문이나 의견이 있다면 이메일로 보내주세요.',
    serviceHeading: '필요할 때, 편하게 써보세요.', serviceLead: '좋아하는 것과 일상에서 느낀 필요에서 시작한 도구들을 모았습니다.',
    privacy: '개인정보처리방침', footer: '아이디어를 일상으로', back: '시안 비교로',
    concepts: ['하버 홈', '서비스 먼저', '작은 작업실'], preview: '시안', chapter: '이 공간을 소개합니다',
    topics: ['게임', '일상의 아이디어', '웹서비스'], labelHome: '/', labelServices: '/services', labelAbout: '/about'
  };
  document.documentElement.lang = language;
  document.title = `${text.concepts[Number(concept) - 1]} · ${text[page]} | developer-john`;
  document.body.dataset.page = page;
  document.body.dataset.preview = String(query.get('preview') === '1');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function route(nextPage = 'home', nextLanguage = language) {
    const next = new URLSearchParams();
    if (nextPage !== 'home') next.set('page', nextPage);
    if (nextLanguage === 'en') next.set('lang', 'en');
    if (query.get('preview') === '1') next.set('preview', '1');
    return `concept-${concept}.html${next.size ? '?' + next : ''}`;
  }
  const serviceHref = `${english ? '/en' : ''}/services/game/the-division-2`;
  const galleryQuery = new URLSearchParams();
  if (page !== 'home') galleryQuery.set('page', page);
  if (english) galleryQuery.set('lang', 'en');
  const backHref = `index.html${galleryQuery.size ? '?' + galleryQuery : ''}`;
  const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';
  const dots = '<span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  const windowBar = title => `<div class="window-bar">${dots}<span>${escape(title)}</span><span></span></div>`;
  const photo = (className = '', priority = false) => `<img class="harbor-photo ${className}" src="../../images/home/harbor-cafe.webp" width="1536" height="1024" alt="${english ? 'A grey baby wombat in glasses using a laptop at a harbor café, illustrated in pixel art' : '작은 항구의 카페에서 안경을 쓰고 노트북을 사용하는 회색 아기 웜뱃의 픽셀 그림'}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  const headline = () => `<p class="eyebrow">${text.eyebrow}</p><h1>${text.headline.split('\n').map(escape).join('<br>')}</h1><p class="lead">${text.introduction}</p>`;
  const button = (label, href, secondary = false) => `<a class="button${secondary ? ' secondary' : ''}" href="${href}">${escape(label)}${arrow}</a>`;
  const serviceCard = (compact = false) => `<a class="service-card${compact ? ' compact' : ''}" href="${serviceHref}"><span class="service-icon" aria-hidden="true"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="7" y="5" width="23" height="27" rx="2"/><path d="m11 13 2 2 4-4m3 3h6m-15 9 2 2 4-4m3 3h6"/></svg></span><div class="service-copy"><span class="category">[ ${text.game} ]</span><h3>${text.division}</h3><p class="service-feature">${text.serviceTitle}</p><p>${text.serviceDescription}</p><small>${text.serviceNote}</small></div><span class="card-action">${text.openService}${arrow}</span></a>`;
  const serviceSection = () => `<section class="section services-section" aria-labelledby="services-heading"><div class="section-heading"><h2 id="services-heading">${text.available}</h2><a class="text-link" href="${route('services')}">${text.allServices}${arrow}</a></div>${serviceCard()}</section>`;
  const aboutTeaser = () => `<section class="about-teaser"><p class="eyebrow">ABOUT JOHN</p><div><h2>${text.chapter}</h2><p>${text.aboutSummary}</p></div><a class="text-link" href="${route('about')}">${text.meet}${arrow}</a></section>`;
  function home() {
    if (concept === '01') return `<section class="window hero harbor-hero"><div class="window-bar">${dots}<span>harbor café</span><span></span></div><div class="harbor-scene">${photo('', true)}<div class="hero-copy">${headline()}<div class="hero-actions">${button(text.browse, route('services'))}${button(text.meet, route('about'), true)}</div></div></div></section>${serviceSection()}${aboutTeaser()}`;
    if (concept === '02') return `<div class="service-first"><section class="quick-intro">${headline()}<a class="text-link" href="${route('about')}">${text.meet}${arrow}</a></section><section class="quick-service" aria-labelledby="services-heading"><div class="section-heading"><h2 id="services-heading">${text.available}</h2><a class="text-link" href="${route('services')}">${text.allServices}${arrow}</a></div>${serviceCard(true)}</section><figure class="window quick-photo">${windowBar('a little pause')}${photo('', true)}<figcaption>john’s little corner</figcaption></figure></div>`;
    return `<section class="workspace-hero"><div class="workspace-intro">${headline()}</div><figure class="workspace-photo">${photo('', true)}<figcaption><span aria-hidden="true">└─</span> john’s little corner</figcaption></figure></section><div class="workspace-grid"><section class="workspace-service" aria-labelledby="services-heading"><div class="section-heading"><h2 id="services-heading">${text.available}</h2></div>${serviceCard(true)}</section><a class="destination-card" href="${route('about')}"><span class="eyebrow">ABOUT</span><h2>${text.meet}</h2><p>${text.aboutSummary}</p>${arrow}</a><a class="destination-card" href="mailto:devjw0712@gmail.com"><span class="eyebrow">CONTACT</span><h2>${text.contact}</h2><p>${text.contactDescription}</p><small>devjw0712@gmail.com</small>${arrow}</a></div>`;
  }
  function services() {
    return `<section class="page-intro"><p class="eyebrow">SERVICES / ${text.services}</p><h1>${text.serviceHeading}</h1><p class="lead">${text.serviceLead}</p></section><section class="service-directory" aria-label="${text.services}">${serviceCard()}</section><div class="directory-note"><span aria-hidden="true">└─</span><p>${text.serviceNote}</p></div>`;
  }
  function about() {
    return `<div class="about-layout"><section class="about-content"><p class="eyebrow">ABOUT JOHN</p><h1>${text.aboutHeading}</h1><p class="about-summary">${text.aboutSummary}</p><p>${text.aboutBody}</p><div class="about-approach"><h2>${text.approachTitle}</h2><p>${text.approach}</p></div><div class="topics">${text.topics.map(topic => `<span>${topic}</span>`).join('')}</div><a class="text-link" href="mailto:devjw0712@gmail.com">${text.contact} · devjw0712@gmail.com${arrow}</a></section><figure class="window about-photo">${windowBar('john’s space')}${photo('', true)}</figure></div>`;
  }
  const navigation = ['home', 'services', 'about'].map(key => `<a href="${route(key)}"${page === key ? ' aria-current="page"' : ''}><span>${text[key]}</span><code>${text['label' + key[0].toUpperCase() + key.slice(1)]}</code></a>`).join('');
  document.querySelector('#site').innerHTML = `<a class="skip-link" href="#main-content">${text.skip}</a><div class="prototype-bar"><a href="${backHref}">← ${text.back}</a><span>${text.preview} ${concept} · ${text.concepts[Number(concept) - 1]}</span></div><header class="site-header"><div class="container header-inner"><a class="wordmark" href="${route('home')}" aria-label="john ${text.home}"><img src="../../brand/jw-mark.svg" alt="" width="40" height="40"><span>john</span></a><div class="header-controls"><nav class="main-nav" aria-label="${text.menu}">${navigation}</nav><nav class="language-nav" aria-label="${english ? 'Language' : '언어 선택'}"><a href="${route(page, 'ko')}" lang="ko"${!english ? ' aria-current="true"' : ''}>한국어</a><span aria-hidden="true">/</span><a href="${route(page, 'en')}" lang="en"${english ? ' aria-current="true"' : ''}>English</a></nav></div></div></header><main id="main-content" class="container" tabindex="-1">${page === 'home' ? home() : page === 'services' ? services() : about()}</main><footer class="site-footer"><div class="container footer-inner"><div><p>${text.footer}</p><a href="mailto:devjw0712@gmail.com">devjw0712@gmail.com</a><a href="${english ? '/en' : ''}/privacy">${text.privacy}</a></div><p>© 2026 developer-john<br>All rights reserved.</p></div></footer>`;
})();
