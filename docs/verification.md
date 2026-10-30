# 검증 기록

## 2026-10-30 — 홈·개인정보처리방침 커밋 전 Astra 검토

- Astra가 추적 변경과 새 파일을 읽기 전용 검토했습니다. 기능·한영 라우팅·접근성·개인정보 안내와 실제 처리 동작에서 커밋을 막을 문제는 발견하지 못했습니다. 이전 픽셀 웜뱃·whoami 홈을 설명하던 README와 구조 문서를 현재 소개·서비스·사이트 맵 창에 맞게 수정한 뒤 재검토를 받았습니다.
- 별도 공개 자료 검토에서 변경·새 파일의 비밀값·개인 환경 경로·실제 환경 파일·빌드 생성물 포함을 발견하지 못했습니다. 공개 문의 메일과 GA 측정 ID는 의도된 공개 설정입니다.
- 자동 테스트 45개 통과: 레드 문 19개, 이키가이 18개, 공통 언어·등록 경로 5개, Analytics 3개. 서비스 목록에는 이키가이를 추가하지 않았습니다.
- 기존 개발 서버를 유지하고 별도 소스·의존성 복사본에서 Next.js 16.4.3 Turbopack 프로덕션 빌드를 확인했습니다. 첫 시도는 컴파일·타입 검사·정적 페이지 생성 후 Windows standalone 파일 복사 권한 오류가 났으며, 권한 조건을 조정한 재시도는 standalone 출력을 포함해 종료 코드 0으로 통과했습니다. 정적 경로 19개와 영어 404용 동적 경로를 생성했습니다.
- 임시 standalone 서버에서 한국어·영어 주요 페이지 10개의 HTTP 200·canonical, 방침의 공개 전 noindex, 이전 주소 4개의 HTTP 308·목적지, 없는 경로의 HTTP 404, 홈 링크와 CSS 제공을 확인했습니다. 확인 후 임시 서버를 종료했습니다.
- 인앱 브라우저에서 사이트 맵의 about → 소개 영역, privacy → 방침, services → 목록 이동과 한영 경로를 확인했습니다. 소개 앵커 이동 후 초점과 사이트 맵의 키보드 탐색도 확인했습니다. 홈 모바일 배치·가로 넘침은 디자인 변경 중 확인했습니다.
- Docker·NAS 배포와 실제 운영 도메인의 GA 수신은 이번 검증 범위에 포함하지 않습니다.

## 2026-10-29 — 프로젝트 상태 재점검

- 프로젝트 루트·Git 루트·빌드의 `appDir`가 일치하는지 확인했습니다.
- 표시 이름 `developer-john`, 기본 origin `https://developer-john.com`, `.env.example`·Docker 빌드 기본값·문서가 일치합니다. npm 패키지·Compose·이미지의 내부 이름은 문서대로 `johnwest-lab`을 유지합니다.
- 설치된 Next.js `16.4.3`, React/React DOM `19.3.1`, TypeScript `7.0.2`가 잠금 파일과 일치합니다. Node.js `24.22.1`에서 타입 검사와 프로덕션 빌드를 다시 통과했습니다.
- 임시 standalone 서버에서 홈·소개·프로젝트·서비스 네 경로의 HTTP 200, 페이지 제목과 경로별 canonical을 확인했습니다. CSS·JavaScript·파비콘 HTTP 200과 없는 경로 HTTP 404도 확인한 뒤 서버를 종료했습니다. 이번 재점검은 HTTP 검사이며 이전의 시각·키보드 검사 기록과 구분합니다.
- Git의 실제 환경 파일·키·DB·빌드 결과 제외와 예시 환경 파일 보관을 확인했습니다. `git diff --check` 통과. 구현 파일은 아직 미커밋이며 원격 저장소는 등록되지 않았습니다.
- Docker 이미지 빌드·컨테이너 실행과 실제 NAS 동작은 검증하지 않았습니다.
- NAS 실제 배포와 도메인 구매·연결·DNS·인증서·프록시는 이번 점검에 포함하지 않았습니다. 첫 서비스·DB·공개 GitHub·분석/광고 ID도 여전히 미정입니다.

## 2026-10-29 — 로컬 작업 폴더 이동

프로젝트 루트 변경 전후 소스와 문서의 일치 여부를 확인하고 npm 패키지·Compose·Docker 이미지의 내부 식별자를 유지했습니다.

- 이동 전후 Git HEAD·작업 트리 상태와 소스·문서 36개의 SHA-256 일치 확인. 미커밋·미추적 파일을 보존했습니다.
- 이전 절대 경로가 들어 있던 `.next`와 TypeScript 캐시를 새 경로에서 재생성했습니다. 타입 검사·프로덕션 빌드 통과, 빌드 메타데이터의 `appDir`이 새 경로인지 확인했습니다.
- 새 폴더에서 임시 standalone 서버를 실행해 주요 네 경로 HTTP 200을 확인한 뒤 서버를 종료했습니다.

## 2026-10-29 — 사이트 이름과 도메인 반영

표시 이름은 `developer-john`, 기본 공개 주소는 `https://developer-john.com`으로 변경했습니다. 헤더·푸터·프로젝트 이름·페이지 제목·Open Graph·로고 약자와 파비콘을 맞추고, README·시작 프롬프트·구조 문서·NAS 배포 문서와 환경 변수 예시·Docker 빌드 기본값을 갱신했습니다. 이름과 기본 주소는 `src/data/brand.ts`에서 관리합니다.

- Node.js `24.22.1`에서 `next typegen`, `tsc --noEmit`, `next build` 통과.
- standalone 서버의 `/`, `/about`, `/projects`, `/services` HTTP 200 확인.
- 네 페이지의 제목·Open Graph 사이트 이름이 `developer-john`이고, canonical·Open Graph URL이 새 도메인과 각 경로를 사용하는지 실제 HTML로 확인.
- 실제 HTML에 이전 표시 이름과 이전 도메인이 없는지 확인. 내부 폴더·패키지·Compose·이미지 이름과 프로젝트 상세 앵커 `johnwest-lab`은 유지.
- 파비콘 HTTP 200, 데스크톱 화면과 320px 모바일 헤더 확인. 모바일 홈의 가로 넘침 없음, 브라우저 오류·경고 없음.
- `git diff --check` 통과. 화면 기록은 `artifacts/developer-john-desktop.jpg`, `artifacts/developer-john-mobile.jpg`에 저장하며 Git에서 제외.

현재는 환경 변수가 미설정이거나 공백이어도 선택한 기본 공개 주소를 사용합니다. 아래 2026-10-28 기록의 **미설정 시 canonical 생략**은 변경 전 동작입니다. 환경 변수로 origin을 변경할 수 있으며 정적 페이지를 다시 빌드해야 합니다.

도메인 구매·연결은 확인하지 않았고 실제 NAS 배포·DNS·인증서·프록시는 변경하지 않았습니다. Docker 이미지 빌드·실행은 이번 변경에서도 미검증입니다.

## 2026-10-28 — 첫 버전 검증

검증일: **2026-10-28 (Asia/Seoul)**. Windows PC에서 확인했습니다. 실제 NAS 배포나 외부 공개 검증 결과는 아닙니다.

### 실행 환경

- Node.js `24.19.0`, npm `12.2.1`.
- Next.js `16.4.3`, React / React DOM `19.3.1`, TypeScript `7.0.2`.
- 공식 npm 레지스트리의 안정 버전과 [Next.js 설치·지원 환경](https://nextjs.org/docs/app/getting-started/installation)을 확인했습니다. 최소 Node.js 요구는 `20.9`이며 프로젝트는 Node.js 24를 사용합니다.
- 의존성 설치와 `package-lock.json` 생성은 npm으로 진행했습니다. 일반적인 실행 방법은 [README](../README.md)를 참고하세요.

### 확인한 결과

| 항목 | 결과 |
| --- | --- |
| 의존성 설치 | `npm install` 성공, 잠금 파일 생성 |
| 잠금 파일 일치 | `npm ci --dry-run --offline --ignore-scripts --no-audit --no-fund --cache .cache/npm` 통과 |
| TypeScript | `npm run typecheck` 통과 (`next typegen` + `tsc --noEmit`) |
| 프로덕션 빌드 | `npm run build` 통과, 주요 네 페이지 모두 정적 사전 생성 |
| 개발 서버 | `127.0.0.1:3001`에서 개발 서버 실행 및 홈 HTTP 200 확인 |
| 운영 서버 | `npm start`로 standalone 서버 실행, `127.0.0.1:3000` 확인 |
| 주요 경로 | `/`, `/about`, `/projects`, `/services` HTTP 200 |
| 정적 파일 | `/icon.svg`, `/lab-mark.svg`, 실제 빌드된 CSS·JavaScript HTTP 200 |
| 없는 경로 | `/does-not-exist` HTTP 404, 사용자용 안내 구현 |
| 반응형 | 데스크톱과 390px 모바일 홈·서비스 화면 시각 확인. 320px에서 네 경로 모두 가로 넘침 없음, 페이지별 h1 한 개 확인 |
| 탐색·키보드 | 내부 메뉴 이동, 프로젝트 상세 앵커, 본문 바로가기의 main 포커스, Tab / Enter 메뉴 탐색 확인 |
| 서비스 필터 | 분야 선택·빈 화면 문구·공개 서비스 0개 안내 갱신. `aria-pressed`와 Space 키 동작 확인 |
| 브라우저 로그 | 검사 중 오류·경고 없음 |
| 주소 설정 | 주소 미설정 시 canonical 생략. `https://example.com` 입력 시 `/about` canonical 생성, 경로가 포함된 잘못된 origin 거부 확인 |
| Git 제외 | 실제 env·키·런타임 DB·의존성·빌드·스크린샷 제외, 예시 env는 보관 대상 확인 |
| 변경 형식 | `git diff --check` 통과 |
| Docker 파일 | Dockerfile/Compose 정적 검토, YAML 파싱 확인 |

현재 서비스 데이터는 빈 배열입니다. 가상의 서비스나 게임 수치·검사 문항·결과를 검증 대상으로 만들어 넣지 않았습니다. GitHub와 분석·광고 계정도 연결하지 않았습니다.

### Windows 빌드 시 관찰한 제한

초기 Windows 빌드에서 standalone 파일 생성 중 `EPERM`이 발생했습니다. 이후 최종 빌드와 standalone 실행을 통과했습니다. 이 기록은 NAS의 Linux 컨테이너 실행을 검증한 결과가 아닙니다.

[Next.js standalone 공식 문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)는 Windows의 디렉터리 심볼릭 링크 권한과 junction 출력의 이동 제한을 안내합니다. Windows 빌드 결과를 NAS에 복사하지 않고 실제 배포 시 Docker의 Linux 빌드 단계에서 다시 빌드합니다.

`next dev`가 생성한 `AGENTS.md`의 Next.js 문서 참조 블록은 보관했습니다. 이후 작업에서도 설치된 버전의 `node_modules/next/dist/docs/`를 확인합니다.

### 미검증 범위와 다음 배포 단계

**Docker 이미지 빌드·컨테이너 실행·`docker compose config`·NAS 자원 사용량은 미검증**입니다. YAML 파싱과 설정 검토는 실제 Docker 검증을 대체하지 않습니다.

실제 배포 경로와 가용 포트, 공개 주소를 확정한 뒤 Linux 이미지 검사, NAS 실행, DNS·HTTPS·역방향 프록시 설정과 외부 접속 검증이 남아 있습니다. 자세한 절차는 [NAS 배포 문서](deploy-synology.md)를 참고하세요.

### 화면 기록

스크린샷은 로컬 `artifacts/home-desktop.jpg`, `artifacts/home-mobile.jpg`에 저장했습니다. 생성물은 Git에서 제외합니다. 검증용 서버는 작업 종료 시 중지하며, 다시 확인하려면 `npm run dev` 또는 `npm start`를 실행합니다.

## 2026-10-29 디비전2 서비스 커밋 전 확인

- TypeScript 검사를 포함한 Next.js 프로덕션 빌드 성공.
- `node --test scripts/test-red-moon.mjs`: 데이터·초기값·저장 보호·독립 집계·날짜 경계·이미지 무결성 12개 통과.
- 실제 컴포넌트의 필터 계산 코드를 분리 실행해 6개 분류, 한국어·영문 검색, 공백/전각 정규화, 체크 상태와 분류의 조합, 검색 결과 없음 처리를 확인.
- 로컬 서비스 HTML의 체크 66개·이미지 22개·빈 최초 상태·단일 본문/제목·공유 메타데이터 확인.
- 서비스와 기존 주요 페이지 4개, 보상 이미지 22개 HTTP 200. 미등록 이벤트 경로 HTTP 404.
- 코드 검토에서 저장 로드 전 쓰기 방지, 손상 기록 보존, 다른 탭 읽기 실패 시 현재 기록 유지, 초기화 범위를 확인.
- 실제 브라우저의 클릭·새로고침·모바일 화면·대화상자 포커스·주소 복사 동작은 브라우저 제어 도구가 없어 직접 실행하지 못했다. 메모리 저장소 테스트와 코드 검토를 실제 브라우저 검증으로 간주하지 않는다.
- 당시 작업 범위는 로컬 구현·검증이었으며 공개 배포와 원격 push는 수행하지 않았습니다.
