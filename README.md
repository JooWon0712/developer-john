# developer-john

개인 포트폴리오와 직접 만든 작은 웹서비스를 한곳에 모으는 사이트입니다.

## 기술 스택

| 항목 | 구성 |
| --- | --- |
| 프레임워크 | Next.js 16.4.3 · App Router |
| UI | React 19.3.1 |
| 언어 | TypeScript 7.0.2 |
| 스타일 | 네이비·샌드 CLI 테마 · CSS · 반응형 레이아웃 |
| 런타임 | Node.js 24 |
| 패키지 관리 | npm 12.2.1 · 잠금 파일 기반 설치 |
| 빌드 | 정적 사전 생성 · standalone 출력 |

## 페이지

| 한국어 경로 | 영어 경로 | 기능 |
| --- | --- | --- |
| `/` | `/en` | 터미널 형태의 소개, 픽셀 웜뱃과 서비스 진입 링크 |
| `/about` | `/en/about` | 각 언어의 홈으로 이동하는 이전 소개 주소 |
| `/projects` | `/en/projects` | 프로젝트 소개와 구현 방향 |
| `/services` | `/en/services` | 게임 분야의 디비전2 서비스 안내 |
| `/services/game/the-division-2` | `/en/services/game/the-division-2` | 디비전2 이벤트별 가이드 목록 |
| `/services/game/the-division-2/red-moon-unleashed-2026` | `/en/services/game/the-division-2/red-moon-unleashed-2026` | 디비전2 이벤트 보상 안내와 개인 체크리스트 |
| `/discovery/ikigai` | `/en/discovery/ikigai` | 활동 탐색 도구 · 서비스 목록 미노출, 직접 주소 유지 |

이전 `/game/the-division-2`와 `/en/game/the-division-2` 및 하위 이벤트 주소는 대응하는 `/services/game/the-division-2`, `/en/services/game/the-division-2` 계층으로 영구 이동합니다. 기존 체크 ID·저장 키·스키마와 보상 기록은 유지합니다.

공통 헤더에서 한국어·English를 선택합니다. 언어를 바꿔도 현재 페이지의 쿼리와 해시를 유지하고, 로고·메뉴·카드·경로 탐색 링크는 현재 언어의 주소로 이동합니다. 언어는 URL로 유지하며 쿠키 저장이나 자동 선호 언어 이동은 사용하지 않습니다.

## 주요 기능

- JW 커서 로고, 픽셀 웜뱃, 고정폭 글꼴과 터미널 창.
- 홈에서 whoami 명령 결과처럼 픽셀 웜뱃과 소개글을 바로 표시하는 정적 터미널 화면. 소개글은 `일상에서 떠오른 아이디어를 작은 웹서비스로 만들어 공유하려고 합니다.`로 표시.
- 서비스 목록도 같은 터미널 창을 사용하며 `john:~/services$ ls` 아래 디렉토리 형태의 서비스 링크와 `[게임]` 같은 카테고리를 표시. 별도 분야 버튼과 서비스 개수는 표시하지 않음.
- 디비전2 이벤트 목록도 같은 터미널 창을 사용. 제목은 `/home/john/services/game/the-division-2`, 명령줄은 `john:~/services/game/the-division-2$ ls`이며 디렉토리 가지 모양의 이벤트 링크 전체를 선택해 이동.
- 레드 문 상세도 전체 보상 내용을 공통 터미널 창으로 감쌈. 제목은 `/home/john/services/game/the-division-2/red-moon-unleashed-2026`, 명령줄은 `john:~/services/game/the-division-2/red-moon-unleashed-2026$ cat rewards`이며 검색·보상 체크·아코디언·이미지 대화상자는 유지. 디비전2 목록·상세는 전체 경로를 나열하는 줄 없이 제목과 명령줄로 현재 위치를 표현.
- 서비스 목록의 `[홈]`/`[Home]` 상위 링크는 `/` 또는 `/en`으로 이동하며 `cd ..`를 표시. 디비전2 목록의 `[서비스 목록]`/`[Services]` 상위 링크는 현재 언어의 서비스 화면으로 이동하며 `cd ~/services`를 표시. 상세의 `[디비전2]`/`[The Division 2]` 링크는 현재 언어의 디비전2 목록으로 이동하며 `cd ..`를 표시. 왼쪽 SVG 화살표 → 강조한 cd 명령 → 대괄호로 감싼 보조 이름 순서의 단일 링크를 사용하며 홈 화면에는 상위 링크를 두지 않음.
- 넓은 화면의 좌우 광고 배치를 위한 공통 레이아웃. 본문 최대 1120px를 유지하고 1600px 이상에서 선택적인 좌우 160px 영역을 지원하며, 작은 화면에는 측면 영역을 표시하지 않음. 광고 내용이 없으면 빈 광고 요소도 생성하지 않음.
- Linux 사용자 `john`과 `/home/john` → `/home/john/services` → `/home/john/services/game/the-division-2` 표시 경로를 사용하는 셸 테마. 실제 웹 주소는 `/`, `/services`, `/services/game/the-division-2`이며 사이트 이름은 `developer-john`.
- 공통 헤더와 현재 페이지 탐색 표시. 모든 페이지의 푸터에 슬로건, `© 2026 developer-john`, `contact` 메일 [devjw0712@gmail.com](mailto:devjw0712@gmail.com)을 표시. 메일 링크는 최소 높이 44px이며 슬로건은 한국어 `아이디어를 일상으로`, 영어 `Ideas into everyday life.`를 사용.
- 모바일 화면 대응, 키보드 포커스와 본문 바로가기.
- 스크롤 시 표시되는 한국어·영어 맨 위로 이동 버튼과 모션 감소 설정 지원.
- 디비전2 → 이벤트별 가이드로 이어지는 서비스 탐색. 서비스 카드는 실제 주소의 `/services`만 생략한 `/game/the-division-2`와 카테고리를 표시하며, 실제 이동 주소는 `/services/game/the-division-2` 또는 `/en/services/game/the-division-2`를 유지. 이벤트 카드는 `./red-moon-unleashed-2026/` 형식의 상대 디렉토리와 이름을 표시. 서비스 카드와 이벤트 카드는 전체를 선택해 다음 목록이나 보상 가이드로 이동.
- 준비 중·공개 가능 상태를 구분하는 서비스 메타데이터.
- 언어별 제목·설명, canonical·hreflang과 Open Graph 로케일.
- 한국어·영어의 없는 경로에 대한 404 안내.

첫 서비스는 한국어·영어를 지원하는 디비전2 레드 문 보상 가이드입니다. 66개 체크 항목과 보상 이미지, 분류별 아코디언, 검색·분류·상태 필터, 이미지 확대와 브라우저 자동 저장을 제공합니다. 분류를 모두 펼치거나 접을 수 있고, 검색·필터 및 보상 바로가기에서는 해당 분류를 자동으로 펼칩니다. 두 언어에서 같은 체크 기록을 사용하고 한국어·영어 이름으로 검색할 수 있습니다. 언어별 공유 주소와 메타데이터를 제공합니다. 새 방문자는 빈 기록으로 시작하며 이벤트 기록만 초기화할 수 있습니다. 개인 도구의 기록 가져오기는 포함하지 않습니다.

이키가이 도구는 서비스 목록에 표시하지 않으며 `/discovery/ikigai`, `/en/discovery/ikigai`에서 직접 열 수 있습니다. 질문·선택지·결과·실험·후기 화면을 모두 한국어와 영어로 제공합니다. 소스·브라우저 저장 기록·자동 테스트를 유지하고, 언어를 바꿔도 기록 키·형식·ID·추천 순서는 같습니다. 사용자가 쓴 메모와 후기는 원문으로 보존합니다. 5~10분 동안 6단계 질문에 답하고, 활동 후보 20개 중 3개를 살펴볼 수 있습니다. 선택한 관심·직접 경험·돕고 싶은 문제에 따른 근거와 보상에 대한 본인 답변, 20~60분 실험과 후기를 제공합니다. 목표와 가능한 시간을 순서에 반영하며, 모르는 답이나 수익화에 관심이 없어도 탐색할 수 있습니다. 메모와 후기는 추천 계산에 사용하지 않습니다. 답변은 브라우저에 자동 저장하고 다른 탭의 변경을 반영하며, 손상 기록을 자동 덮어쓰지 않습니다. 해당 서비스 기록만 삭제할 수 있습니다.

디비전2 가이드와 이키가이 도구는 계정·DB·LLM 없이 동작합니다. 검증된 심리검사나 직업·수익을 확정하는 기능은 제공하지 않습니다. GA4 설치 코드를 구성했으며 광고 연동은 아직 구현하지 않았습니다.

## Google Analytics 4

웹 스트림은 `developer-john Web`, 설정된 웹사이트 주소는 `https://developer-john.com/`, 측정 ID는 `G-17PE2KX72Q`입니다. 프로덕션 실행 중 실제 origin이 `https://developer-john.com` 또는 `https://www.developer-john.com`일 때만 `next/script`의 `afterInteractive` 방식으로 태그를 로드합니다. 개발·로컬·미리보기·HTTP·다른 포트에서는 로드하지 않습니다.

초기 설정은 한 번 실행하며 수동 `page_view` 이벤트는 추가하지 않습니다. SPA 경로 전환 측정은 GA4 향상된 측정의 브라우저 기록 변경 설정에 의존합니다. 사용자 답변·메모·보상 체크 내용을 전송하는 커스텀 이벤트는 추가하지 않았습니다. 운영 데이터 수신과 SPA 조회 중복 여부는 사이트 공개 후 확인할 항목입니다.

## 실행

Node.js 24와 npm 12.2.1을 사용합니다.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
node --test scripts/test-red-moon.mjs
node --test scripts/test-ikigai.mjs
node --test scripts/test-i18n.mjs
node --test scripts/test-analytics.mjs
npm run build
npm start
```

프로덕션 빌드가 성공했으며 정적 경로 17개와 영어 404용 동적 경로를 생성했습니다. 자동 테스트는 레드 문 19개·이키가이 18개·공통 언어·등록 경로 5개·Analytics 3개, 총 45개가 통과했습니다. 새 한국어·영어 디비전2 목록·상세 4개 주소의 HTTP 200과 canonical, 이전 주소의 308 이동을 확인했습니다. 인앱 브라우저의 새 이동 동선과 쿼리·해시 보존, 두 언어 목록의 320px 가로 넘침 없음도 확인했습니다.

`npm start`는 프로덕션 빌드 후 standalone 서버를 실행합니다.

## 사이트 주소 설정

기본 공개 주소는 `https://developer-john.com`입니다. 도메인 구매는 사용자가 확인했으며 DNS 연결·HTTPS 설정·사이트 공개는 아직 완료하지 않았습니다.

`NEXT_PUBLIC_SITE_URL`로 다른 origin을 지정할 수 있습니다. 미설정이거나 공백이면 기본 주소를 사용합니다. 주소에는 경로·쿼리·인증 정보를 포함하지 않습니다.

이 값은 빌드 시 메타데이터에 반영되므로 변경 후 다시 빌드해야 합니다.
