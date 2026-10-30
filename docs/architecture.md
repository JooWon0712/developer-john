# 프로젝트 구조와 확장

developer-john은 Next.js App Router와 TypeScript를 사용합니다. 첫 버전은 소개·프로젝트·서비스 목록을 정적으로 생성하고, 공통 탐색·브라우저 개인 기록과 활동 탐색 질문 등 필요한 부분만 클라이언트 컴포넌트로 실행합니다. 현재 DB나 별도 API 서버는 필요하지 않습니다.

사이트 표시 이름은 `developer-john`, 기본 공개 origin은 `https://developer-john.com`입니다. 도메인 구매는 확인했으며 DNS 연결·HTTPS 설정·사이트 배포는 별도 단계입니다. npm 패키지 이름, Compose 프로젝트·Docker 이미지의 내부 식별자 `johnwest-lab`은 그대로 사용합니다. 모든 개발 명령은 프로젝트 루트에서 실행합니다.

## 파일 역할

```text
src/
  app/
    layout.tsx               공통 메타데이터, 헤더·푸터, 본문 바로가기
    page.tsx                 홈과 개발자 소개
    home.module.css         CLI 형태의 소개 화면
    about/page.tsx           홈으로 리디렉션
    projects/page.tsx        프로젝트 목록
    services/page.tsx        서비스 목록
    en/layout.tsx            서버 렌더링 영어 언어 영역
    en/.../page.tsx          홈·서비스·프로젝트·이키가이·디비전2 영어 경로
    en/not-found.tsx         영어 404 안내
    globals.css              공통 스타일과 반응형 레이아웃
    not-found.tsx            없는 경로 안내
  components/
    site-header.tsx          현재 언어의 탐색과 문서 언어 동기화
    language-switch.tsx      전역 한국어·영어 선택, 현재 쿼리·해시 유지
    not-found-page.tsx        한국어·영어 404 공용 화면
    site-footer.tsx          공통 푸터
    google-analytics.tsx     허용된 운영 origin에서만 afterInteractive로 GA4 로드
    site-content.tsx         본문과 선택적 좌우 영역을 배치하는 서버 컴포넌트
    site-content.module.css  넓은 화면의 광고 여백과 기존 본문 폭 유지
    back-to-top.tsx          스크롤 시 상단 이동, 언어·모션 감소 설정 반영
    service-directory.tsx    게임 서비스 목록과 준비 중 안내
    terminal-window.tsx      홈·서비스·디비전2 목록·레드 문 상세 공용 터미널 창
    terminal-window.module.css  터미널 프레임·제목 표시줄
    home/home-terminal.tsx   겹쳐진 소개·서비스 창과 링크형 사이트 맵
    icons.tsx                공통 아이콘
  features/
    site/                    홈·서비스·프로젝트 공용 화면과 언어별 문구
  data/
    brand.ts                 표시 이름·로고 약자·기본 공개 주소
    contact.ts               공개 메일과 선택적 GitHub 프로필 주소
    shell.ts                 화면의 Linux 사용자와 표시 경로
    catalog.ts               프로젝트·서비스·분야 메타데이터
  lib/
    site.ts                  사이트 정보와 언어별 페이지 메타데이터
    i18n.ts                  언어 판별·기본 경로·언어별 주소 생성
    analytics.ts             GA4 측정 ID·허용 origin·초기화 코드
scripts/
  start.mjs                  로컬 standalone 프로덕션 실행
  test-i18n.mjs              공통 언어 경로와 쿼리·해시 보존 검증
  test-analytics.mjs         운영 origin 제한과 GA4 초기화 검증
```

홈은 `about` 소개 창, 타이포 링크 형태의 서비스 창과 `site map` 창이 겹치는 정적 화면입니다. HomeTerminal은 서버 컴포넌트이며 타이머·클라이언트 상태·재생 기록·명령 프롬프트를 사용하지 않습니다. 사이트 맵은 접근 가능한 nav와 목록으로 구성하고 `about` → `privacy` → `services/` 순서의 링크를 제공합니다. 소개는 현재 홈의 `#about` 영역으로 이동하며 키보드 초점을 받을 수 있고, 방침과 서비스는 현재 언어의 페이지로 이동합니다. 장식 아이콘과 가지 문자만 접근성 트리에서 숨깁니다. 모바일에서는 소개·서비스·사이트 맵 순서로 표시하며, 창 전체 영역은 공통 container 안에서 헤더와 같은 폭을 사용합니다. 소개글은 `일상에서 떠오른 아이디어를 작은 웹서비스로 만들어 공유하려고 합니다.`이며 영어도 같은 의미로 제공합니다.

홈·서비스·디비전2 이벤트 목록·레드 문 상세는 서버 컴포넌트 `TerminalWindow`의 프레임·제목 표시줄을 공유합니다. 공통 프레임은 `overflow: clip`을 사용해 스크롤 컨테이너를 추가하지 않고, 기존 카테고리 사이드바의 sticky 배치를 유지합니다. 서비스 화면의 상단 두 줄 설명은 표시하지 않고, 터미널 안에 `john:~/services$ ls`와 디렉토리 가지 모양의 서비스 링크를 표시합니다. 서비스 이름 옆에는 `[게임]` 또는 `[Games]`처럼 카테고리를 표시하고 분야 버튼·개수 표시는 제공하지 않습니다. ServiceDirectory는 모든 등록 서비스를 표시하는 서버 컴포넌트이며 실제 입력·명령 실행이나 애니메이션 없이 카드 전체 링크를 유지합니다.

셸 테마의 사용자와 기본 경로는 `src/data/shell.ts`에서 관리합니다. 사용자는 `john`, 홈은 `/`, 서비스는 `/services`, 개인정보처리방침은 `/privacy`, 디비전2는 `/services/game/the-division-2`입니다. 헤더 메뉴·경로형 터미널 제목·홈의 서비스 진입 경로는 실제 링크 주소와 같으며, 영어에서는 `/en` 접두사를 포함합니다. 서비스·방침 등의 화면은 `john:~/services$`, `john:~/privacy$`처럼 언어와 관계없이 기존 셸 형식을 유지합니다. 서비스 목록의 항목은 현재 목록 아래의 경로를 나타내도록 실제 기본 주소의 `/services`만 생략한 `/game/the-division-2`를 표시하며 실제 링크 주소는 유지합니다. 사이트 이름 `developer-john`과 공개 도메인은 유지합니다.

공통 푸터는 한국어 `아이디어를 일상으로`, 영어 `Ideas into everyday life.`와 `© 2026 developer-john`을 유지하고, 모든 페이지에 `contact` 메일 [devjw0712@gmail.com](mailto:devjw0712@gmail.com)을 표시합니다. 메일 링크의 최소 높이는 44px입니다. 공개 연락처는 `src/data/contact.ts`에서 관리하며, `githubUrl`은 현재 `null`이므로 GitHub 프로필 링크는 표시하지 않습니다. 별도의 브랜드 링크는 두지 않습니다.

홈은 개발자 소개와 서비스 진입 링크로 구성하며, 이전 소개 주소 `/about`은 홈으로 이동합니다. 목록은 `src/data/catalog.ts`를 사용합니다. 현재 프로젝트는 developer-john 한 개이며, 서비스 목록에는 게임 분야의 디비전2만 등록합니다. 목록 패널의 큰 제목과 별도의 분야 소개 섹션은 표시하지 않습니다. 서비스 카드의 제목은 실제 기본 주소에서 `/services`만 생략한 표시 경로(`/game/the-division-2`)와 카테고리를 표시합니다. 영어 화면에서도 표시 경로는 동일하며 실제 링크에만 `/en`을 붙입니다. 준비 중 서비스는 카테고리의 pathPrefix와 directory를 조합합니다. 언어별 주제 이름(topic)은 접근성 이름으로 유지하고 기능 이름(title)을 함께 제공합니다. 완성된 서비스 카드 전체를 하나의 링크로 제공하며 이벤트 가이드 목록 `/services/game/the-division-2`로 연결합니다. 별도 진입 버튼은 표시하지 않고, 링크의 접근성 이름은 카드 제목과 기능 이름을 참조합니다. 키보드 Tab·Enter 이동과 카드 전체의 포커스 표시를 지원합니다. 목록의 이벤트를 선택하면 해당 보상 가이드로 이동합니다. 이키가이는 서비스 목록에서 표시하지 않지만 `/discovery/ikigai`, `/en/discovery/ikigai`의 직접 주소와 소스·기존 저장 기록·자동 테스트를 유지합니다. 디비전2 레드 문 보상 가이드는 보상 진행을, 이키가이 도구는 질문 답변과 실험 후기를 각각의 브라우저 저장 키로 관리합니다. 구체적인 기능과 후속 기획은 [서비스 구현과 후속 기획](service-plan.md)을 참고합니다.

`TerminalWindow`의 선택적 `parentLink`는 `href`·`label`을 받아 제목 표시줄 오른쪽에 왼쪽 SVG 화살표와 언어별 목적지 이름을 표시합니다. 서비스 목록과 개인정보처리방침은 `홈`/`Home`, 디비전2 목록은 `서비스 목록`/`Services`, 레드 문 상세는 `디비전2`/`The Division 2`로 연결합니다. 링크의 title 속성은 실제 목적지 주소이며, cd 명령이나 대괄호 경로는 표시하지 않습니다. 가운데 현재 경로는 실제 URL을 유지하고, 모바일에서는 현재 경로를 첫 줄, 한 줄짜리 이동 링크를 다음 줄에 배치합니다. 본문은 기존 john 명령·출력으로 바로 시작합니다. 홈 프레임의 오른쪽은 비워둡니다.

## 한국어·영어 지원

공통 헤더의 `src/components/language-switch.tsx` 한 곳에서 한국어·English를 선택합니다. 한국어를 기본으로 제공하고 `/en`, `/en/services`, `/en/projects`, `/en/discovery/ikigai`와 디비전2의 `/en/services/game/...` 경로를 제공합니다. `/about`은 `/`로, `/en/about`은 `/en`으로 이동합니다. 영어 경로에는 별도의 404 화면도 제공합니다.

`src/lib/i18n.ts`의 `getLanguage`, `getBasePath`, `localizePath`가 현재 언어와 경로를 관리합니다. 로고·메뉴·서비스 및 이벤트 카드·경로 탐색·홈 진입 링크는 현재 언어를 유지합니다. 언어 선택은 현재 쿼리와 해시를 보존하며 URL로만 언어를 유지합니다. 언어 쿠키나 자동 선호 언어 리디렉션은 사용하지 않습니다. 공통 푸터·맨 위로 이동·본문 바로가기와 접근성 문구도 영어 홈을 포함한 현재 언어에 맞춥니다.

홈·서비스·프로젝트는 `src/features/site/`의 공용 화면과 `copy.ts`를 사용하고, 카탈로그는 한국어 원본과 `getLocalizedCategories`, `getLocalizedServices`, `getLocalizedProjects`로 표시 문구를 제공합니다. 언어 전환은 서비스 ID·디렉토리명을 바꾸지 않으며, 실제 링크는 현재 언어에 맞게 기본 주소에 `/en`을 적용합니다. 각 언어의 페이지는 실제 경로를 `pageMetadata`에 전달해 canonical·한국어/영어/x-default hreflang·Open Graph 로케일을 생성합니다.

루트 레이아웃의 서버 HTML은 기본 `lang="ko"`를 유지합니다. 영어 레이아웃이 서버에서 `<div lang="en">` 영역을 제공하고, `SiteHeader`는 클라이언트의 경로 변경에 맞춰 `document.documentElement.lang`을 동기화합니다.

## 이키가이 서비스

이키가이 기능은 `src/features/discovery/ikigai/`에 모으고 `/discovery/ikigai`, `/en/discovery/ikigai`에서 공용 질문 화면을 연결합니다. 현재 서비스 목록에는 노출하지 않습니다. 정적 질문·활동 데이터와 순수 추천 계산을 사용하며 서버 API·DB·LLM은 사용하지 않습니다.

| 파일 | 역할 |
| --- | --- |
| `model.ts` | 상태 타입, 6단계에서 사용하는 선택지, 활동 후보 20개, 빈 초기값과 엄격한 저장 형식 검증 |
| `match.ts` | 같은 추천 규칙으로 후보 3개를 정렬하고 언어별 근거·확인할 질문 생성 |
| `translations.ts` | 문항·선택지·20개 활동·결과·후기 UI의 언어별 표시 문구 |
| `page-content.tsx` | 개념 설명과 질문 화면의 한국어·영어 공용 페이지 |
| `storage.ts` | 서비스 키의 읽기·쓰기·삭제·저장 이벤트 해석, 손상 원본 보호와 실패 반환 |
| `use-ikigai-state.ts` | 최초 복원 전 쓰기 차단, 자동 저장, 같은 저장소의 다른 탭 변경 반영, 삭제와 실패 상태 관리 |
| `wizard.tsx` | 시작·좋아하는 것·해본 일·돕고 싶은 문제·보상·답변 확인, 결과와 실험 후기 |
| `ikigai.module.css` | 공통 테마를 따르는 질문·결과 화면의 반응형 스타일 |

추천은 좋아하는 활동·직접 경험·관심 있는 문제의 선택 태그만 근거로 사용합니다. 목표와 가능한 시간은 정렬에 반영하고 보상 답변은 순위에 반영하지 않습니다. 언어는 문항·활동·근거·실험·후기 안내의 표시 문구에만 반영합니다. 선택 ID·태그·추천 순서·저장 스키마는 동일하며, 사용자가 쓴 메모와 실험 후기는 번역하지 않고 원문으로 보존합니다. 메모와 실험 후기는 자동 해석하거나 추천 계산에 사용하지 않습니다. 연결 근거가 없으면 일반 탐색임을 표시합니다. 내부 정렬 값은 사용자 적성 점수로 노출하지 않습니다.

저장 키 `developer-john:discovery:ikigai:v1`에 스키마 1의 독립된 상태를 저장합니다. 정규화는 알려진 ID·단계·선택지·최대 500자 메모·저장 시각을 검사하고 새 객체와 배열로 복원합니다. 손상되거나 읽을 수 없는 기존 기록에는 자동 쓰기를 허용하지 않습니다. 명시적 삭제는 해당 서비스 키만 제거하며 다른 탭에서도 초기화를 반영합니다. 저장 실패 시 화면의 입력을 유지하고 안내합니다.

`node --test scripts/test-ikigai.mjs`는 Node.js 24의 TypeScript 제거 기능과 메모리 저장소를 사용합니다. 추천·정규화·저장·영어 문구 완성도·언어별 추천 불변·사용자 원문 보존을 검증하는 18개 테스트가 통과했습니다. 현재 전체 검증 결과는 아래 검증 항목에 정리합니다.

## 디비전2 이벤트 목록

이전 `/game/the-division-2`, `/en/game/the-division-2`와 하위 이벤트 주소는 대응하는 새 `/services/game/...`, `/en/services/game/...` 주소로 영구 리디렉션합니다. 체크 ID·이벤트 ID·저장 키·스키마와 기존 개인 기록은 유지합니다.

서비스 목록의 디비전2는 특정 이벤트가 아닌 이벤트·보상 정보 전체를 안내합니다. 한국어 `/services/game/the-division-2`와 영어 `/en/services/game/the-division-2`에서 `game-page.tsx`를 공유하며 언어별 메타데이터와 이벤트 링크를 제공합니다. `event-guides.ts`에 이벤트별 `directory`·이름·설명·주소·메인 이벤트 공지 기간을 등록합니다. 현재 레드 문의 `directory`는 `redMoon.slug`이며, 카드에 `./red-moon-unleashed-2026/`와 한국어·영어 이벤트 이름을 함께 표시합니다. 두 언어 모두 이벤트 카드 전체를 하나의 링크로 제공하고 별도 가이드 보기 버튼은 표시하지 않습니다. 링크 이름은 이벤트 제목을 참조하며 Tab·Enter 이동과 카드 포커스 표시를 지원합니다. 새 이벤트는 기존 가이드와 별도로 추가합니다. 디비전2 목록과 이벤트 상세는 전체 경로를 나열하는 breadcrumb를 두지 않고 제목 표시줄과 ls/cat 명령줄로 현재 경로를 표현합니다. 단일 상위 목록 링크는 지정된 현재 언어의 주소로 이동합니다. 이벤트 링크는 현재 언어의 실제 웹 경로로 이동합니다. 목록의 터미널 제목은 `shell.division2`의 `/services/game/the-division-2`에 현재 언어를 반영한 실제 주소이며, 명령줄은 `john:~/services/game/the-division-2$ ls`입니다. 이벤트는 디렉토리 가지 모양의 전체 링크로 표시합니다. 레드 문 상세는 전체 보상 내용을 같은 `TerminalWindow`로 감쌉니다. 제목은 `shell.division2`와 `event.slug`를 연결하고 현재 언어를 반영한 실제 주소이며, 안쪽 명령줄은 `john:~/services/game/the-division-2/red-moon-unleashed-2026$ cat rewards`입니다. 보상 안내·체크·검색·아코디언·이미지 대화상자 등 기존 기능 UI는 유지합니다. 서비스의 ready 상태는 링크 제공 여부를 구분하는 데이터로 유지하고, 이용 가능 배지는 표시하지 않습니다. 내부 이동 화살표는 글리프 대신 SVG를 사용합니다.

## 레드 문 언어 지원

한국어 `/services/game/the-division-2/red-moon-unleashed-2026`와 영어 `/en/services/game/the-division-2/red-moon-unleashed-2026` 경로가 `event-page.tsx`를 함께 사용합니다. `event-en.ts`는 원본의 ID·순서·체크 유형·이미지를 유지하고 표시 문구를 번역합니다. `copy.ts`는 언어별 UI와 오류·공유·접근성 문구를 관리하고, `localization.ts`는 언어별 데이터·주소·양언어 검색 인덱스를 제공합니다. 언어 선택은 공통 헤더 한 곳에서 제공하며 레드 문 영역에 별도의 언어 선택 컴포넌트나 전용 스타일을 두지 않습니다. 전역 언어 링크는 현재 쿼리와 보상 해시를 보존합니다. 두 경로는 같은 보상 저장 키와 스키마를 사용합니다. 각 보상 페이지에 언어 속성을 지정하고 canonical·hreflang·Open Graph를 언어에 맞춰 생성합니다. 영어 경로에서는 공통 탐색과 푸터·본문 바로가기 문구도 영어로 표시합니다.

상태 선택 상자는 네이티브 select 동작을 유지하며 CSS 화살표와 충분한 오른쪽 여백을 사용합니다. 작은 화면에서 필터를 한 열로 배치하고 긴 영어 분류 제목의 진행 수를 다음 줄에 표시합니다.

## 서비스 추가

1. 서비스의 기능·계산 규칙·데이터 출처 또는 문항을 먼저 확정합니다.
2. 서비스 구현은 `src/features/<service-slug>/`에 모으고 한국어 경로와 대응하는 `/en` 경로에서 공용 화면을 연결합니다. 새 폴더는 실제 구현할 때 추가합니다.
3. 서비스 목록에 표시할 분야와 서비스를 `src/data/catalog.ts`의 `serviceCategories`와 `services`에 등록하고 영어 표시 문구를 추가합니다. 기본 실제 경로는 한국어 경로로 두고 링크 생성 시 `localizePath`를 적용합니다. 공개 준비가 끝난 서비스에만 실제 경로를 넣습니다.
4. TypeScript 검사, 프로덕션 빌드와 양쪽 언어의 경로·모바일·키보드 동작을 확인합니다.

서비스 타입은 준비 상태를 구분합니다.

```ts
import type { Service } from "@/data/catalog";

// 준비 중: 실행 주소를 넣지 않습니다.
const plannedService: Service = {
  id: "your-service",
  directory: "your-service",
  topic: "서비스 주제",
  title: "확정한 서비스 이름",
  description: "실제로 제공할 기능 설명",
  category: "discovery",
  status: "planned",
};

// 공개 가능: 구현하고 검증한 실제 경로를 반드시 넣습니다.
const readyService: Service = {
  id: "your-service",
  directory: "your-service",
  topic: "서비스 주제",
  title: "확정한 서비스 이름",
  description: "실제로 제공하는 기능 설명",
  category: "discovery",
  status: "ready",
  href: "/discovery/your-service",
};
```

위 항목은 타입 사용 예시이며 실제 서비스 목록에 등록된 내용이 아닙니다. `category` 타입은 확장을 위해 `game`, `discovery`를 허용하지만, 현재 `serviceCategories`에는 `game`만 등록합니다. `discovery` 분야와 이키가이 서비스는 목록에 등록하지 않습니다. `directory`는 슬래시를 붙이지 않은 디렉토리명을 필수로 지정하며, 카드에서 `./<directory>/`로 표시합니다. `planned`에는 `href`를 넣을 수 없고, `ready`에는 `href`가 필요합니다. 목록은 공개 가능한 항목의 카드 전체를 링크로 제공하며 현재 분야에 등록된 서비스 수를 안내합니다. 준비 중인 항목은 링크가 없는 카드로 표시합니다. 기본 선택과 표시되는 분야는 게임입니다.

브라우저에서 충분한 계산은 클라이언트에서 처리하는 방향을 우선합니다. 저장·비밀키·서버 처리가 필요한 기능이 생기면 Next.js Route Handler 등 필요한 서버 기능을 추가합니다. DB는 실제 저장 요구가 정해진 뒤 선택합니다.

## 사이트 정보와 외부 연동

공통 이름·소개·JW 로고 경로·로고 약자·기본 공개 주소는 `src/data/brand.ts`에서 관리하고, 헤더·푸터·프로젝트 이름과 메타데이터에서 함께 사용합니다. `src/lib/site.ts`의 `pageMetadata(title, description, path)`는 각 페이지의 제목·설명과 언어별 canonical·hreflang·Open Graph URL 및 로케일을 만듭니다. 기본 공개 origin은 `https://developer-john.com`이며, 선택한 공개 주소를 메타데이터에 반영합니다.

`NEXT_PUBLIC_SITE_URL`은 `.env.local` 또는 Docker 빌드 인자로 전달하는 **빌드 시 설정**입니다. 설정하지 않거나 공백으로 두면 기본 origin을 사용합니다. `http://localhost:3000` 또는 다른 환경의 origin으로 덮어쓸 수 있으며, 경로·쿼리·해시·인증 정보가 있는 주소는 허용하지 않습니다. 주소가 바뀌면 앱과 이미지를 다시 빌드합니다. `NEXT_PUBLIC_*`에 넣은 값은 공개될 수 있으므로 인증 정보를 넣지 않습니다.

### Google Analytics 4

사용자 제공 화면에서 웹 스트림 `developer-john Web`, 설정 URL `https://developer-john.com/`, 측정 ID `G-17PE2KX72Q`를 확인했습니다. `src/lib/analytics.ts`가 측정 ID·허용 origin·초기화 코드를 관리하고, 루트 레이아웃의 클라이언트 래퍼 `GoogleAnalytics`가 조건에 맞을 때만 `next/script`의 `afterInteractive`로 로더와 초기화 스크립트를 추가합니다.

조건은 프로덕션 실행과 실제 `window.location.origin`의 정확한 일치입니다. 허용값은 `https://developer-john.com`, `https://www.developer-john.com` 두 개이며 개발·로컬·미리보기·HTTP·다른 포트·유사 도메인은 허용하지 않습니다. 메타데이터의 사이트 주소를 바꿔도 이 허용 목록은 바뀌지 않습니다.

초기화 코드는 기존 `dataLayer`를 유지하고 `gtag`의 `config`를 한 번 등록합니다. 별도 수동 `page_view`는 보내지 않으며 SPA 경로 전환은 GA4 향상된 측정의 브라우저 기록 변경 설정에 의존합니다. 사용자 답변·메모·보상 체크 내용을 보내는 커스텀 이벤트는 추가하지 않았습니다. GA4 관리 화면의 설정 변경이나 실제 수집 요청을 발생시키는 QA는 수행하지 않았으며, 운영 수신·SPA 조회 누락 및 중복은 공개 후 확인할 사항입니다.

### 광고 레이아웃 준비

공개 GitHub 주소와 광고 계정·슬롯은 아직 정하지 않았습니다. `SiteContent`는 본문 최대 1120px를 헤더와 맞추고 1600px 이상에서 좌우 160px 영역과 각각 24px 간격을 지원합니다. `leftRail`·`rightRail` 내용이 있을 때만 해당 aside를 생성하며 작은 화면에서는 측면 영역을 숨깁니다. 현재 광고 스크립트·빈 광고 틀은 없습니다. 본문에는 AdSense 측면 광고의 겹침 제외 속성을 미리 적용했고, 넓은 화면의 맨 위로 이동 버튼도 본문 안쪽에 배치합니다. 이는 직접 배치할 광고를 위한 사이트 레이아웃 기준이며 AdSense 자동 측면 광고의 노출 기준과는 별개입니다.

## 현재 검증

새 경로를 반영한 프로덕션 빌드가 성공했으며 정적 경로 17개와 영어 404용 동적 경로를 생성했습니다. 자동 테스트는 레드 문 19개·이키가이 18개·공통 언어·등록 경로 5개·Analytics 3개, 총 45개가 통과했습니다. 공통 언어 테스트는 대응 경로의 왕복 전환·접두사 중복 방지·쿼리와 해시 보존·로컬 주소 제약에 더해 디비전2 서비스와 이벤트의 새 경로 등록을 검증합니다. 저장 관련 테스트는 메모리 대체 객체를 사용하며 Analytics 테스트도 실제 GA 서버에 요청하지 않습니다.

한국어·영어 디비전2 목록·상세 4개 새 주소의 HTTP 200과 새 canonical을 확인했습니다. 이전 주소는 쿼리를 보존한 308 응답으로 대응하는 새 주소로 이동했습니다. 인앱 브라우저에서 서비스 카드 → 디비전2 목록 → 이벤트 링크의 새 계층 이동, 이전 영어 이벤트 주소의 쿼리·보상 해시 보존, 전역 언어 링크의 쿼리·해시 동시 보존을 확인했습니다. 한국어·영어 디비전2 목록을 320px 폭에서 확인했으며 두 화면 모두 clientWidth와 scrollWidth가 305px로 같아 가로 넘침이 없었습니다.

레드 문 상세의 터미널 통합 후 TypeScript 검사와 프로덕션 빌드가 성공했으며 정적 경로 17개를 유지했습니다. 인앱 브라우저에서 한국어·영어 상세의 320px 화면은 clientWidth와 scrollWidth가 모두 305px로 가로 넘침이 없었습니다. 한국어 검색은 `관리자` 2개·`핏빛 사냥개` 5개 항목을 표시했고, 폭 560px 유니폼 확대 대화상자가 최상위 레이어에서 프레임에 잘리지 않고 열리고 닫혔습니다. 스크롤 후 카테고리 사이드바의 상단 24px sticky 배치도 확인했습니다. 검색을 해제하고 모두 접기로 복귀했으며 개인 보상 체크는 변경하지 않았습니다. 단위 테스트는 이번 스타일 변경 후 다시 실행하지 않았고 기존 45개 통과 결과를 유지합니다.

경로 변경 전 인앱 브라우저에서 영어 홈 → 서비스 → 디비전2 → 레드 문 이동 시 영어 주소 유지, 공통 언어 선택 1개, 한국어 → 영어 전환 시 쿼리·해시 보존을 확인했습니다. 영어 이미지 대체 설명·진입 문구·푸터와 390px 모바일 폭의 왼쪽 정렬도 확인했습니다. 개인 체크·메모와 브라우저 저장소는 직접 변경하지 않았으며, 저장 동작의 자동 테스트와 이 화면 검증은 구분합니다.

## 빌드와 배포

`next.config.ts`의 `output: "standalone"`으로 최소 실행 출력을 만듭니다. `npm start`는 `scripts/start.mjs`를 통해 빠진 정적 파일과 `public` 자산을 standalone 출력에 복사한 다음 서버를 실행합니다. 기본 호스트는 `127.0.0.1`, 포트는 `3000`이며 `HOSTNAME`과 `PORT` 환경 변수로 변경할 수 있습니다.

NAS 운영 이미지는 Docker의 Linux 빌드 단계에서 별도로 만듭니다. Windows에서 만든 `.next`를 NAS에 복사하는 방식은 사용하지 않습니다. `linux/amd64` 이미지, 독립된 배포 경로·포트와 컨테이너 자원 설정에 관한 절차는 [NAS 배포 안내](deploy-synology.md)를 참고하세요.

현재까지의 실제 확인 결과와 Docker 검증의 한계는 [검증 기록](verification.md)에 정리합니다.

## 공식 문서

- [Next.js 설치와 지원 환경](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js standalone 출력](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Next.js 환경 변수](https://nextjs.org/docs/app/guides/environment-variables)
