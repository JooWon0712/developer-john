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

Dockerfile은 NAS의 Linux 빌드 단계에서 `public`, `.next/standalone`, `.next/static`을 준비합니다. PC의 Windows `.next`를 NAS로 복사하지 않습니다. Compose의 메모리·CPU 제한은 앱 실행 설정이며 Docker 빌드 전체의 자원 상한을 뜻하지 않습니다.

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

## 5. PC에서 확인하는 SSH 터널

NAS의 앱 포트는 loopback 바인딩을 유지합니다. PC에서 NAS 내부 IP의 `3310`으로 직접 접속하도록 바인딩을 넓히지 않습니다.

같은 PC에서 개인 설정의 SSH 호스트·포트·키를 사용하는 별도 연결에 **`-L 127.0.0.1:3310:127.0.0.1:3310`** 포워딩을 추가하면 PC의 `127.0.0.1:3310`만 NAS의 loopback 앱 포트로 연결할 수 있습니다. 로컬 포트가 비어 있는지 확인하고 터널을 유지하는 동안 다음 주소로 확인합니다.

```text
http://127.0.0.1:3310/
```

이 연결은 로컬 개발 서버 `127.0.0.1:3004`와 별개입니다. 포워딩을 다른 네트워크 인터페이스에 공개하거나 앱 포트를 인터넷으로 포트포워딩하지 않습니다. 터널은 확인이 끝나면 해당 연결만 종료합니다.

## 외부 도메인 연결은 별도 단계

NAS 배포와 SSH 터널 확인은 웹사이트의 외부 공개를 뜻하지 않습니다. `developer-john.com`의 DNS·HTTPS 인증서와 이 사이트 전용 역방향 프록시는 별도 작업으로 설정하고 외부 네트워크에서 확인합니다. 기존 사이트의 DNS·인증서·프록시 규칙은 유지합니다.

이후 프록시 대상은 NAS의 `127.0.0.1:3310`을 사용합니다. 도메인·인증서·프록시를 준비하기 위해 앱 바인딩을 바꿀 필요는 없습니다. GA4는 기존 코드의 운영 HTTPS origin 조건을 유지하므로 NAS 내부 HTTP 주소나 PC 터널 확인만으로 운영 수집을 검증한 것으로 간주하지 않습니다.

## 선택 사항: PC에서 이미지 만들기

Linux 컨테이너용 Docker를 사용할 수 있는 PC·CI에서는 이미지를 미리 빌드해 TAR로 저장한 다음 NAS에 가져오는 방식도 가능합니다. 이 대안에만 PC Docker가 필요하며 위의 기본 SSH 배포는 NAS에서 빌드합니다. 수동 이미지 가져오기를 선택하면 이미지 태그와 해당 release의 실행 설정·복구 기록도 함께 관리해야 합니다.

## 공식 참고 문서

- [Next.js standalone 출력과 정적 파일 복사](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Compose 서비스 설정](https://docs.docker.com/reference/compose-file/services/)
- [Docker Compose 환경 변수 설정](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [Synology Container Manager 프로젝트](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_project?version=7)
- [Synology 이미지 가져오기](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_image?version=7)
