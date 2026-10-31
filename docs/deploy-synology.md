# Synology NAS 배포

기본 배포는 **PC에서 푸시한 커밋의 소스를 SSH로 전송하고 NAS에서 Docker 이미지를 빌드하는 방식**입니다. PC에 Docker는 필요하지 않습니다. 이 문서는 배포 절차를 설명하며, 실제 NAS 배포나 외부 도메인 공개가 완료됐다는 기록이 아닙니다.

모든 PC 명령은 프로젝트 루트에서 실행합니다. 실제 NAS 주소·로그인 계정·SSH 개인키 경로는 문서나 Git에 넣지 않습니다. 다른 사이트의 폴더·컨테이너·이미지·DNS·인증서·프록시는 변경하지 않습니다. 로컬 개발 서버의 `127.0.0.1:3004`도 배포 작업과 별개로 유지합니다.

## 구성

| 파일/설정 | 역할 |
| --- | --- |
| `scripts/deploy-nas.ps1` | 로컬 검사, 커밋 확인, 소스 압축, SSH 전송과 원격 실행 |
| `scripts/deploy-nas.sh` | NAS 점검, 최초 설치·업데이트, 건강 상태 확인과 실패 복구 |
| `deploy.nas.example.json` | 개인 NAS 접속·배포 설정의 구조 예시 |
| `deploy.nas.local.json` | 실제 개인 설정. Git에서 제외하며 비밀번호는 넣지 않음 |
| `Dockerfile` | NAS의 `linux/amd64` 이미지 빌드, npm 잠금 파일 설치와 Next.js standalone 출력 |
| `compose.nas.yaml` | 이미 빌드된 release 이미지를 서비스 `web`으로 실행 |
| release별 `.env` | NAS에서 생성하는 Compose 실행값. 소스의 로컬 환경 파일을 복사하지 않음 |

배포 경로는 `/volume1/docker/developer-john`, Compose 프로젝트와 이미지는 `developer-john`, 서비스는 `web`을 예시로 사용합니다. 경로와 포트는 실제 NAS에서 확인해야 하며 이미 다른 프로젝트가 사용 중인 위치를 재사용하지 않습니다. 앱의 NAS 바인딩은 **`127.0.0.1:3310` → 컨테이너 `3000`**으로 유지합니다.

## 1. 최초 준비

PC에는 Node.js 24, npm으로 설치한 프로젝트 의존성, Git, OpenSSH 클라이언트와 `tar`가 필요합니다. NAS에는 해당 CPU 아키텍처를 지원하는 Docker·Compose와 Container Manager, 빌드에 필요한 디스크·메모리 여유가 필요합니다. 이미지 빌드 중에는 의존성과 기본 이미지를 받기 위한 NAS의 네트워크 연결도 필요합니다.

개인 설정 파일을 만듭니다.

```powershell
Copy-Item deploy.nas.example.json deploy.nas.local.json
```

예시 JSON의 NAS 호스트·SSH 사용자·SSH 포트·키 파일과 배포 경로를 실제 환경에 맞게 확인합니다. 대상 프로젝트·서비스·이미지 이름과 HTTP 포트도 Compose 실행값과 일치해야 합니다. 이 파일은 개인 PC에만 보관합니다. SSH 키 인증에 사용할 개인키를 NAS에 복사하지 않습니다.

Docker 작업에 관리자 권한이 필요하면 설정의 `UseSudo`를 사용합니다. 배포 도구가 실제 별도 터미널에서 SSH의 대화형 sudo 프롬프트를 열면 **사용자가 그 터미널에 직접 비밀번호를 입력**합니다. 비밀번호를 채팅·설정 파일·환경 변수·명령 인자·파이프로 전달하거나 저장하지 않습니다.

## 2. 전송할 커밋 확정

배포 대상 변경을 먼저 검토하고 커밋·push합니다. 배포 도구는 로컬 테스트와 타입 검사를 수행하고, 작업 트리가 깨끗하며 **`HEAD`가 `origin/main`과 일치하는지** 확인합니다. 변경 파일이나 아직 푸시하지 않은 커밋이 있으면 먼저 정리합니다.

배포 압축은 현재 폴더의 미커밋 파일을 모으는 대신 **`git archive`로 확인된 HEAD 커밋에서 생성**합니다. 따라서 실제 NAS 소스는 확인한 푸시 커밋에 고정됩니다. 개인 설정·환경 파일·키·의존성·로컬 빌드 결과는 전송 대상 소스에 넣지 않습니다.

## 3. 점검과 배포

배포 스크립트의 최초 설치·업데이트·빌드 실패 후 재시도·상태 확인 실패 및 종료 신호 후 복구는 `node --test scripts/test-nas-deploy.mjs`로 모의 실행할 수 있습니다. 실제 NAS에 연결하지 않으며 Windows에서는 Git Bash가 필요합니다. 실제 배포의 로컬 검사와 원격 상태 확인은 아래 명령이 수행합니다.

```powershell
# NAS 접속 없이 로컬 검사·커밋 확인·배포 압축 생성
./scripts/deploy-nas.ps1 -PackageOnly

# SSH로 NAS의 배포 환경 확인
./scripts/deploy-nas.ps1 -Check

# 소스 전송 → NAS 빌드 → 최초 설치 또는 업데이트 → 상태 확인
./scripts/deploy-nas.ps1
```

`-PackageOnly`는 NAS에 연결하지 않습니다. `-Check`는 원격 실행 스크립트 전송과 접속·경로·Docker·Compose·포트 등 필요한 점검을 하지만 앱을 배포하지 않습니다. 기본 실행은 최초 설치와 기존 developer-john 업데이트를 지원합니다.

일반 실행은 다음 순서로 진행합니다.

1. 로컬 검사와 깨끗한 Git·푸시 커밋 확인 후 소스 압축을 생성합니다.
2. 전용 SSH 연결로 소스와 배포 실행 스크립트를 보냅니다.
3. NAS에서 대상 경로·프로젝트·서비스·포트와 이전 release 상태를 확인합니다.
4. 버전별 release 영역에서 `linux/amd64` 이미지를 빌드합니다. **새 이미지 빌드가 성공하기 전에는 기존 developer-john 컨테이너를 교체하지 않습니다.**
5. release별 `.env`에 해당 이미지 태그·프로젝트·loopback 포트 등 실행값을 생성하고 `compose.nas.yaml`로 서비스 `web`을 시작하거나 교체합니다.
6. 컨테이너 건강 상태와 HTTP 경로를 확인하고 release·이미지·로그 기록을 남깁니다.

Dockerfile은 NAS의 Linux 빌드 단계에서 `public`, `.next/standalone`, `.next/static`을 준비합니다. PC의 Windows `.next`를 NAS로 복사하지 않습니다. Compose의 메모리 제한은 앱 실행 설정이며 Docker 빌드 전체의 자원 상한을 뜻하지 않습니다. CPU CFS quota를 지원하지 않는 Synology 커널에서도 실행할 수 있도록 `cpus` 제한은 설정하지 않습니다.

`NEXT_PUBLIC_SITE_URL`은 정적 페이지와 메타데이터의 **빌드 시 설정**이며 기본값은 `https://developer-john.com`입니다. 주소를 바꾸려면 해당 빌드 설정으로 새 이미지를 만들어야 합니다. runtime `.env`만 바꿔도 이미 생성된 canonical·Open Graph 주소가 바뀌지는 않습니다.

## 4. 배포 후 확인과 복구

NAS 내부 점검은 `http://127.0.0.1:3310`을 사용합니다. 컨테이너가 `healthy`인지 확인한 뒤 아래 한국어·영어 10개 경로를 점검합니다.

| 화면 | 한국어 | 영어 |
| --- | --- | --- |
| 홈 | `/` | `/en` |
| 서비스 | `/services` | `/en/services` |
| 디비전2 목록 | `/services/game/the-division-2` | `/en/services/game/the-division-2` |
| 레드 문 보상 | `/services/game/the-division-2/red-moon-unleashed-2026` | `/en/services/game/the-division-2/red-moon-unleashed-2026` |
| 개인정보처리방침 | `/privacy` | `/en/privacy` |

각 경로의 HTTP 성공과 실제 콘텐츠를 확인합니다. 컨테이너 상태·HTTP 확인은 외부 도메인 접속이나 브라우저 화면 검증을 대신하지 않습니다.

기존 설치에서는 교체 후 점검이 실패하면 보관한 이전 release와 이미지로 복구를 시도합니다. 첫 설치가 실패하면 이전 버전이 없으므로 이번 developer-john 프로젝트만 내립니다. 다른 프로젝트를 중지하거나 NAS 전체 컨테이너·이미지를 정리하지 않습니다. 자동 복구도 실패할 수 있으므로 배포 로그와 이전 release·이미지를 보존하고 결과를 확인합니다.

단순 컨테이너 재시작은 소스 변경을 반영하거나 이미지를 다시 빌드하지 않습니다. 다음 업데이트도 동일한 배포 스크립트로 새 커밋을 전달합니다. release·로그·이전 이미지 정리는 정상 동작을 확인한 뒤 별도로 진행합니다.

## 5. Container Manager 프로젝트 등록

SSH로 Compose를 실행한 컨테이너가 Container Manager의 전체 컨테이너 목록에는 보이지만 프로젝트 칸은 `-`로 표시될 수 있습니다. Docker의 실행 프로젝트명과 DSM에 등록된 프로젝트 목록은 각각 확인합니다.

배포가 성공하면 앱 루트의 `docker-compose.yaml`을 현재 release의 해석된 Compose 설정으로 동기화합니다. 이미지 태그·포트·환경값이 포함되어 있어 DSM 등록 시 별도 `.env`를 입력할 필요가 없습니다. 실패한 배포에서는 이전 관리 파일을 복구합니다.

Synology의 `synowebapi` 관리 도구가 있으면 배포 스크립트가 Container Manager에 프로젝트를 자동 등록합니다. 설치된 DSM의 `SYNO.Docker.Project` 조회·생성 기능을 사용하며, 같은 이름과 경로로 이미 등록된 프로젝트는 재사용합니다. 등록 단계에서는 컨테이너 빌드·시작·중지·정리·삭제 API를 호출하지 않습니다. 등록 전후 컨테이너 ID·프로젝트 라벨·이미지·실행 상태와 DSM의 컨테이너 연결을 확인합니다.

앱 건강 상태 확인과 관리 파일 갱신 이후 등록을 수행합니다. DSM 등록에 실패하면 오류로 보고하되, 이미 정상 실행 중인 새 앱을 등록 오류 때문에 되돌리지는 않습니다. 등록 결과 요약은 해당 release의 `.registration.log`에 저장하며 원시 API 응답은 임시 파일에서 처리 후 삭제합니다.

관리 API를 사용할 수 없는 환경의 수동 등록은 Container Manager의 **프로젝트 → 생성**에서 진행합니다.

1. 프로젝트 이름은 개인 설정의 `ProjectName`과 같은 `developer-john`으로 지정합니다.
2. 경로는 배포 앱 루트(예: `/volume1/docker/developer-john`)를 선택합니다.
3. 배포가 생성한 `docker-compose.yaml`을 사용합니다. 기존 파일 사용 옵션이 없으면 같은 파일을 내려받아 **업로드**로 선택합니다.
4. Web Station 포털은 사용하지 않고 생성합니다. 웹 접속은 기존 DSM 역방향 프록시 설정을 사용합니다.

동일한 프로젝트 이름과 `web` 서비스를 사용하므로 실행 중인 프로젝트와 일치해야 합니다. 별도 이름으로 중복 프로젝트를 만들지 않습니다. 등록 후 `developer-john-web-1`의 프로젝트 칸과 두 사이트의 동작을 확인합니다. 이후 배포는 계속 PC 스크립트로 수행하며, 성공할 때마다 관리용 Compose 파일도 최신 이미지 태그로 갱신됩니다.

## 6. PC에서 확인하는 SSH 터널

NAS의 앱 포트는 loopback 바인딩을 유지합니다. PC에서 NAS 내부 IP의 `3310`으로 직접 접속하도록 바인딩을 넓히지 않습니다.

NAS의 SSH 서버가 TCP 포워딩을 허용하는 경우, 같은 PC에서 개인 설정의 SSH 호스트·포트·키를 사용하는 별도 연결에 **`-L 127.0.0.1:3310:127.0.0.1:3310`** 포워딩을 추가하면 PC의 `127.0.0.1:3310`만 NAS의 loopback 앱 포트로 연결할 수 있습니다. `administratively prohibited`가 나오면 포워딩이 차단된 상태이므로 이 방식으로 접속할 수 없습니다. 로컬 포트가 비어 있는지 확인하고 터널을 유지하는 동안 다음 주소로 확인합니다.

```text
http://127.0.0.1:3310/
```

이 연결은 로컬 개발 서버 `127.0.0.1:3004`와 별개입니다. 포워딩을 다른 네트워크 인터페이스에 공개하거나 앱 포트를 인터넷으로 포트포워딩하지 않습니다. 터널은 확인이 끝나면 해당 연결만 종료합니다.

## 7. 외부 도메인 연결과 HTTP → HTTPS 전환

NAS 배포와 SSH 터널 확인은 웹사이트의 외부 공개를 뜻하지 않습니다. `developer-john.com`의 DNS·HTTPS 인증서와 이 사이트 전용 역방향 프록시는 별도 작업으로 설정하고 외부 네트워크에서 확인합니다. 기존 사이트의 DNS·인증서·프록시 규칙은 유지합니다.

이후 프록시 대상은 NAS의 `127.0.0.1:3310`을 사용합니다. 도메인·인증서·프록시를 준비하기 위해 앱 바인딩을 바꿀 필요는 없습니다. GA4는 기존 코드의 운영 HTTPS origin 조건을 유지하므로 NAS 내부 HTTP 주소나 PC 터널 확인만으로 운영 수집을 검증한 것으로 간주하지 않습니다.

### 적용할 구성과 순서

아래 절차는 `https://developer-john.com`과 `https://www.developer-john.com`의 인증서·443 역방향 프록시가 이미 정상인 상태에서, HTTP 80 접속을 사이트의 HTTPS 주소로 전환할 때 사용합니다. 사이트별 HTTP 규칙이 없으면 NAS 기본 응답이 나와 JavaScript로 DSM의 `5001` 포트에 이동할 수 있습니다. 이 상태는 아래에서 확인할 사이트의 HTTP `308` 응답과 구분합니다.

설정 순서는 **기존 HTTPS 두 규칙의 요청 헤더 확인 → 리다이렉트 코드 배포 → HTTP 80 두 규칙 추가 → 외부 응답 검증**입니다. 이 사이트에 해당하는 규칙만 다루며 `mon-r` 등 다른 사이트의 규칙은 편집하거나 삭제하지 않습니다.

완성할 네 규칙의 값은 다음과 같습니다. **HTTPS 규칙도 대상 프로토콜은 HTTP로 유지**합니다. 외부 TLS는 NAS에서 종료하고 앱에는 loopback HTTP로 연결합니다.

| 규칙 | 소스 프로토콜·호스트·포트 | 대상 프로토콜·호스트·포트 | 요청 `Host` | 요청 `X-Forwarded-Proto` |
| --- | --- | --- | --- | --- |
| 기존 HTTPS 기본 도메인 | HTTPS · `developer-john.com` · `443` | HTTP · `127.0.0.1` · `3310` | `developer-john.com` | `https` |
| 기존 HTTPS www | HTTPS · `www.developer-john.com` · `443` | HTTP · `127.0.0.1` · `3310` | `www.developer-john.com` | `https` |
| 추가 HTTP 기본 도메인 | HTTP · `developer-john.com` · `80` | HTTP · `127.0.0.1` · `3310` | `developer-john.com` | `http` |
| 추가 HTTP www | HTTP · `www.developer-john.com` · `80` | HTTP · `127.0.0.1` · `3310` | `www.developer-john.com` | `http` |

### 7-1. 기존 HTTPS 규칙의 요청 헤더 먼저 확인

1. DSM의 **제어판 → 로그인 포털 → 고급 → 역방향 프록시**를 엽니다. 기존 `developer-john.com:443` 규칙을 선택해 **편집**합니다.
2. 일반 설정에서 소스는 HTTPS·해당 도메인·`443`, 대상은 **HTTP·`127.0.0.1`·`3310`**인지 확인합니다. 대상 프로토콜을 HTTPS로 바꾸거나 대상 포트를 `443`·`5001`로 바꾸지 않습니다.
3. **사용자 지정 머리글(Custom Header)**의 **요청 헤더**에 `X-Forwarded-Proto`를 이름으로, `https`를 값으로 지정합니다. 같은 이름의 항목이 있으면 수정해 **하나의 값으로 덮어쓰고**, `http`·`https`를 중복 추가하거나 쉼표로 합치지 않습니다. 응답 헤더에 추가하는 설정과 구분합니다.
4. 앱이 받는 `Host`가 원래 공개 도메인으로 유지되어야 합니다. 명시적으로 지정할 경우 요청 헤더 `Host`에 이 규칙의 도메인인 `developer-john.com`을 넣습니다. 대상 주소인 `127.0.0.1:3310`을 `Host`로 전달하지 않습니다.
5. 저장한 뒤 `www.developer-john.com:443` 규칙도 같은 방법으로 확인합니다. 이 규칙의 `Host` 값은 `www.developer-john.com`, `X-Forwarded-Proto` 값은 `https`입니다. 기존 인증서 연결과 다른 규칙은 유지합니다.

역방향 프록시의 소스·대상과 사용자 지정 헤더 화면은 [Synology DSM 7 고급 설정 공식 안내](https://kb.synology.com/en-us/DSM/help/DSM/AdminCenter/system_login_portal_advanced?version=7)를 참고합니다.

HTTPS 헤더를 먼저 확인해야 하는 이유는 **NAS→앱 연결 자체는 HTTP**이기 때문입니다. 현재 Next.js 런타임은 `X-Forwarded-Proto`가 없으면 내부 연결을 기준으로 `http`를 보충할 수 있습니다. 따라서 헤더가 없으면 리다이렉트하지 않는다고 가정하지 않습니다. HTTPS 프록시에 명시적인 `https`가 전달되지 않은 채 새 코드를 배포하면, 이미 HTTPS로 접속했어도 같은 HTTPS 주소로 반복 이동할 수 있습니다.

### 7-2. HTTP 판별 리다이렉트 코드 배포

위의 HTTPS 두 규칙을 확인한 다음 2~4절의 기존 커밋·push·NAS 배포 및 건강 상태 확인 절차를 진행합니다. `next.config.ts`의 변경이 NAS의 새 이미지에 포함되어야 하므로 컨테이너 재시작만으로 처리하지 않습니다.

앱은 요청 호스트가 `developer-john.com` 또는 `www.developer-john.com`이고, 앱에서 확인한 `X-Forwarded-Proto` 값이 정확히 `http`이면 `https://developer-john.com/:path*`로 영구 리다이렉트합니다. 경로와 쿼리는 유지하며 HTTP의 www 주소도 기본 도메인 HTTPS 주소로 모읍니다. HTTPS 요청에는 이 HTTP 전환 규칙을 적용하지 않습니다. `permanent: true`의 `308` 상태와 쿼리 전달 동작은 [Next.js redirects 공식 안내](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)를 따릅니다.

배포 직후 기존 두 HTTPS 주소가 정상 페이지를 표시하며 반복 이동하지 않는지 먼저 확인합니다. 이 단계에서는 새 HTTP 80 규칙을 아직 만들지 않습니다. NAS 내부 건강 상태 확인 주소는 기존 `http://127.0.0.1:3310`을 유지합니다.

### 7-3. 사이트 전용 HTTP 80 규칙 두 개 추가

1. 같은 역방향 프록시 화면에서 **생성**을 누릅니다. 이름은 `developer-john HTTP 기본 도메인`처럼 구분할 수 있게 지정합니다.
2. 소스는 **HTTP / `developer-john.com` / `80`**, 대상은 **HTTP / `127.0.0.1` / `3310`**으로 설정합니다. 소스 호스트를 비워 NAS 전체 도메인을 받는 규칙으로 만들지 않습니다.
3. 사용자 지정 **요청 헤더**에 `X-Forwarded-Proto: http`와 `Host: developer-john.com`을 각각 지정하고 저장합니다.
4. www용 규칙도 별도로 생성합니다. 소스는 **HTTP / `www.developer-john.com` / `80`**, 대상은 동일한 **HTTP / `127.0.0.1` / `3310`**입니다. 요청 헤더는 `X-Forwarded-Proto: http`, `Host: www.developer-john.com`입니다.
5. 외부 80 요청이 NAS까지 도달하는지 확인합니다. 앱 포트 `3310`의 바인딩이나 외부 포트포워딩을 넓히지 않습니다. 기존 HTTPS 두 규칙과 다른 사이트의 80·443 규칙도 그대로 유지합니다.

DSM의 **로그인 포털 → DSM → HTTP 연결을 HTTPS로 자동 리다이렉트**는 DSM 관리 화면과 기본 `5000`·`5001` 포트에 관한 설정입니다. 이 사이트의 80→443 전환을 해결하기 위해 전역 DSM 설정을 바꾸지 않습니다. [Synology DSM HTTPS 전환 공식 안내](https://kb.synology.com/en-us/DSM/tutorial/force_HTTPS_for_DSM)에서도 해당 설정의 대상이 DSM 데스크톱임을 확인할 수 있습니다. HSTS 체크만으로 첫 HTTP 요청의 사이트 전환을 해결했다고 판단하지 않습니다.

### 7-4. 외부 네트워크에서 308·경로·쿼리 확인

PC의 NAS 내부 주소나 SSH 터널이 아닌 실제 공개 도메인으로 확인합니다. 다음은 Windows PowerShell에서 사용하는 예시이며 `curl.exe`를 명시합니다. 처음 두 명령에는 `-L`을 넣지 않아 **첫 HTTP 응답**을 확인합니다.

```powershell
curl.exe -sS -D - -o NUL "http://developer-john.com/"
curl.exe -sS -D - -o NUL "http://www.developer-john.com/en/services?from=http-check&view=all"

curl.exe -sS -D - -o NUL "https://developer-john.com/"
curl.exe -sS -D - -o NUL "https://www.developer-john.com/en/services"

curl.exe -sS -L --max-redirs 5 -o NUL -w "status=%{http_code} final=%{url_effective}" "http://www.developer-john.com/en/services?from=http-check&view=all"
```

| 확인 항목 | 기대 결과 |
| --- | --- |
| HTTP 기본 도메인 `/` | `308`과 `Location: https://developer-john.com/` |
| HTTP www `/en/services?from=http-check&view=all` | `308`과 `Location: https://developer-john.com/en/services?from=http-check&view=all` |
| 기존 HTTPS 기본 도메인·www | 정상 콘텐츠와 `200`, 같은 주소로의 반복 이동 없음 |
| `-L --max-redirs 5`로 최종 응답 확인 | 최종 `200`, 기본 도메인의 HTTPS URL에 원래 경로·쿼리 유지 |

브라우저에서도 홈·소개·서비스와 KO/EN 이동을 확인합니다. 결과를 기록할 때는 첫 응답 상태·`Location`·최종 URL을 남깁니다. DSM 로그인 HTML이나 `5001`로 보내는 JavaScript가 나오면 사이트의 HTTP 규칙과 `Host` 헤더를 다시 확인합니다. `308`이 계속 반복되면 HTTPS 규칙이 앱에 보내는 `X-Forwarded-Proto` 값부터 확인합니다.

### 7-5. 영구 리다이렉트 캐시와 복구

`308`은 브라우저·검색엔진에 영구 리다이렉트로 캐시될 수 있으므로 잘못된 이동을 설정한 뒤에는 기존 브라우저 화면만으로 복구 여부를 판단하기 어렵습니다. `curl.exe`의 새 요청과 별도 브라우저 프로필로 다시 확인합니다.

루프나 잘못된 이동이 생기면 **이번에 추가한 HTTP 80 두 규칙을 먼저 비활성화**하고 기존 HTTPS 두 규칙의 `Host`·`X-Forwarded-Proto: https` 및 HTTP 대상 `127.0.0.1:3310`을 확인합니다. HTTPS 접속 자체도 반복 이동한다면 HTTPS 요청 헤더를 바로잡고, 필요하면 4절의 이전 앱 release 복구 절차를 사용합니다. 기존 HTTPS가 정상인 상태를 회복한 뒤 HTTP 규칙을 다시 적용합니다. 다른 사이트의 규칙이나 NAS 전역 설정을 초기화하지 않습니다.

## 선택 사항: PC에서 이미지 만들기

Linux 컨테이너용 Docker를 사용할 수 있는 PC·CI에서는 이미지를 미리 빌드해 TAR로 저장한 다음 NAS에 가져오는 방식도 가능합니다. 이 대안에만 PC Docker가 필요하며 위의 기본 SSH 배포는 NAS에서 빌드합니다. 수동 이미지 가져오기를 선택하면 이미지 태그와 해당 release의 실행 설정·복구 기록도 함께 관리해야 합니다.

## 공식 참고 문서

- [Next.js standalone 출력과 정적 파일 복사](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Compose 서비스 설정](https://docs.docker.com/reference/compose-file/services/)
- [Docker Compose 환경 변수 설정](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [Synology Container Manager 프로젝트](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_project?version=7)
- [Synology 이미지 가져오기](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_image?version=7)
- [Synology DSM 7 역방향 프록시와 사용자 지정 헤더](https://kb.synology.com/en-us/DSM/help/DSM/AdminCenter/system_login_portal_advanced?version=7)
- [Synology DSM 데스크톱의 HTTP → HTTPS 전환](https://kb.synology.com/en-us/DSM/tutorial/force_HTTPS_for_DSM)
- [Next.js redirects: 호스트·헤더 조건, 경로·쿼리, 308](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)
