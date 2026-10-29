# Synology NAS 배포 준비

이 문서는 **PC 또는 CI에서 developer-john 사이트의 Linux 이미지를 빌드하고 Synology NAS에서는 실행만 하는 방식**을 설명합니다. 예시는 `linux/amd64` 환경을 대상으로 하므로 사용할 NAS의 CPU 아키텍처와 Container Manager 지원 여부를 먼저 확인합니다. 실제 NAS 배포·DNS·HTTPS·프록시 설정은 별도 단계입니다.

기본 사이트 주소는 `https://developer-john.com`입니다. 모든 소스 명령은 프로젝트 루트에서 실행합니다. 내부 프로젝트·이미지 이름은 `johnwest-lab`을 유지하며 아래 NAS 경로와 포트는 실제 장비 설정이 아닌 배포 예시입니다.

다른 애플리케이션의 폴더·컨테이너·이미지·프록시를 덮어쓰지 않도록 이 사이트에 독립된 프로젝트 이름·배포 경로·호스트 포트를 사용합니다.

## 준비한 구성

| 파일/설정 | 역할 |
| --- | --- |
| `Dockerfile` | Node.js 24 Alpine 다단계 빌드, `npm ci`, Next.js standalone, 일반 사용자 실행 |
| `compose.nas.yaml` | 이미 가져온 이미지 실행 전용. NAS에서 빌드하거나 레지스트리에서 자동 다운로드하지 않음 |
| `.env.example` | 기본 사이트 주소 `https://developer-john.com`. 로컬에서는 필요하면 `.env.local`로 복사해 변경 |
| `.env.nas.example` | Compose 프로젝트·이미지·바인딩 주소·호스트 포트 예시 |
| NAS 폴더 예시 | `/volume1/docker/johnwest-lab` — 실제 볼륨과 가용 경로 확인 필요 |
| 포트 예시 | NAS `127.0.0.1:3310` → 컨테이너 `3000`. `3310` 가용성은 미확인 |

현재 웹 기능에는 DB나 호스트 데이터 볼륨이 필요하지 않습니다. Compose의 컨테이너 메모리 `512m`, Node.js V8 힙 `256MB`, CPU 1코어는 예시 시작값이며 NAS 전체 사양이나 실측 사용량을 뜻하지 않습니다. 배포 후 이 앱과 다른 서비스의 자원 사용량을 확인해 조정합니다. 로그는 파일당 5MB, 3개로 제한합니다.

## 1. PC/CI의 Docker 확인

```powershell
docker version
docker compose version
```

Linux 컨테이너를 빌드할 수 있는 Docker 엔진이 필요합니다. Docker 명령이나 엔진이 없다면 여기에서 이미지 검증을 멈춥니다. 대신 Node.js로 TypeScript 검사와 프로덕션 빌드를 진행할 수 있습니다. Docker를 자동 설치하거나 NAS에 연결해 대신 빌드하지 않습니다.

**Docker 이미지 빌드·실행과 실제 NAS 동작은 아직 검증하지 않았습니다.** 아래 절차는 배포 준비 가이드입니다.

## 2. Linux 이미지 만들기

프로젝트 루트에서 실행합니다. `20261028`은 버전 태그 예시이며 실제 배포마다 구분되는 태그를 사용합니다.

```powershell
docker build --platform linux/amd64 -t johnwest-lab:20261028 .
```

위 명령은 기본값 `https://developer-john.com`으로 메타데이터를 생성합니다. 선택한 주소를 명시하려면 빌드 인자를 전달합니다.

```powershell
docker build --platform linux/amd64 --build-arg NEXT_PUBLIC_SITE_URL=https://developer-john.com -t johnwest-lab:20261028 .
```

다른 공개 주소나 로컬 주소를 메타데이터에 쓰려면 `--build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3310`처럼 빌드 인자를 변경합니다. 인자를 생략하거나 환경 변수 값이 비어 있어도 앱은 `https://developer-john.com`을 기본값으로 사용합니다. 기본 주소 설정은 도메인 구매·DNS·HTTPS 연결을 완료한다는 의미가 아닙니다.

`NEXT_PUBLIC_SITE_URL`은 정적 페이지와 메타데이터를 만드는 **빌드 시 설정**입니다. 이미지 실행 시 `.env`만 변경해도 빌드된 페이지의 주소는 바뀌지 않습니다. 주소를 바꾸면 이미지를 새로 빌드합니다. `.env*`는 Docker 빌드 컨텍스트에서 제외되므로 PC의 `.env.local`을 이미지가 자동으로 읽는 것으로 가정하지 않습니다. `NEXT_PUBLIC_*` 값은 공개되므로 비밀번호를 넣지 않습니다.

Dockerfile은 `public`, `.next/standalone`, `.next/static`을 Linux 빌드 단계에서 가져옵니다. Windows에서 만든 `.next`를 NAS에 복사하지 않습니다. 의존성은 저장소의 `package-lock.json`으로 설치합니다.

## 3. PC에서 이미지 확인

Docker를 사용할 수 있을 때만 수행합니다. 로컬 `3310` 포트도 비어 있는지 확인하고 필요한 경우 변경합니다.

```powershell
docker run --rm -d --name johnwest-lab-check --platform linux/amd64 -p 127.0.0.1:3310:3000 johnwest-lab:20261028
docker inspect --format '{{json .State.Health}}' johnwest-lab-check
Invoke-WebRequest http://localhost:3310/
Invoke-WebRequest http://localhost:3310/about
Invoke-WebRequest http://localhost:3310/projects
Invoke-WebRequest http://localhost:3310/services
docker logs johnwest-lab-check
```

각 경로의 HTTP `200`, 한글 표시, 탐색, 정적 CSS·아이콘을 확인합니다. 헬스체크는 컨테이너 내부 `/`의 HTTP `200`을 확인합니다. 시작 직후에는 `starting`일 수 있으므로 첫 검사 이후 `healthy`인지 확인합니다. 확인을 마치면 임시 컨테이너만 중지합니다. `--rm`으로 자동 제거됩니다.

```powershell
docker stop johnwest-lab-check
```

이미지 파일을 저장합니다. `dist/`는 Git과 Docker 빌드 대상에서 제외됩니다.

```powershell
New-Item -ItemType Directory -Force dist
docker save --output dist/johnwest-lab-20261028.tar johnwest-lab:20261028
```

## 4. NAS에서 별도 프로젝트 준비

이 단계부터는 실제 배포 요청을 받은 뒤 수행합니다.

1. Container Manager 지원 여부, DSM 세부 버전, Docker/Compose 버전과 여유 메모리·디스크를 확인합니다.
2. 예를 들어 `/volume1/docker/johnwest-lab`에 새 프로젝트 폴더를 만듭니다. 실제 볼륨과 가용 경로를 확인하고 기존 프로젝트 폴더는 사용하지 않습니다.
3. 이미지 TAR를 업로드하고 Container Manager의 **이미지 → 작업 → 가져오기**에서 이미지로 불러옵니다. TAR는 소스 압축 파일처럼 풀지 않습니다.
4. 새 폴더에 `compose.nas.yaml`과 `.env.nas.example`을 복사합니다. 예시 환경 파일을 `.env`라는 이름으로 복사하고 값을 확인합니다.

   ```dotenv
   COMPOSE_PROJECT_NAME=johnwest-lab
   JOHNWEST_IMAGE=johnwest-lab:20261028
   JOHNWEST_BIND_ADDRESS=127.0.0.1
   JOHNWEST_PORT=3310
   ```

5. 새 프로젝트 이름이 기존 이름과 겹치지 않는지, `3310`이 비어 있는지 확인합니다. 이미지 태그는 가져온 이미지와 정확히 일치시킵니다.
6. Container Manager에서 **새 프로젝트**를 만들고 이 폴더의 Compose 구성을 사용합니다. 기존 프로젝트를 선택해 덮어쓰지 않습니다. GUI가 Compose 파일명을 지정하게 하면 `compose.nas.yaml`을 지정하고 YAML 입력 방식이면 내용을 사용합니다. `.env`가 같은 프로젝트 폴더에서 읽히는지도 확인합니다.

이 Compose는 `build:`가 없으며 `pull_policy: never`입니다. 이미지가 없다는 오류가 나면 가져온 태그를 확인합니다. NAS에서 빌드하도록 변경하지 않습니다.

SSH 사용이 별도로 허용된 환경에서는 새 프로젝트 폴더에서 다음 명령으로 구성을 확인하고 실행할 수 있습니다. `config` 결과에 개인 설정이 표시될 수 있으므로 공개 로그나 Git에 저장하지 않습니다.

```sh
docker compose --env-file .env -f compose.nas.yaml config
docker compose --env-file .env -f compose.nas.yaml up -d
docker compose --env-file .env -f compose.nas.yaml ps
docker compose --env-file .env -f compose.nas.yaml logs --tail=100 web
```

기본 바인딩이 `127.0.0.1`이므로 PC에서 `http://NAS_IP:3310`으로 바로 접속할 수 없습니다. NAS 자체에서 `http://127.0.0.1:3310`을 검사하거나, 이후 별도로 설정한 DSM 역방향 프록시를 통해 접속합니다. 내부 LAN에서 직접 확인하려면 허용된 작업 범위 안에서 `JOHNWEST_BIND_ADDRESS`를 NAS의 내부 IP 등으로 바꾸고 Compose를 재적용합니다. 이 앱의 호스트 포트를 인터넷에 직접 포트포워딩할 필요는 없습니다.

## 5. 공개 전 남은 설정

- 실제 NAS 프로젝트 경로, 고유 프로젝트 이름, 비어 있는 호스트 포트 확정.
- 선택한 `developer-john.com`의 DNS·HTTPS 연결 상태 확인. 다른 주소를 쓰면 `NEXT_PUBLIC_SITE_URL`을 변경해 이미지 재빌드.
- 해당 도메인의 DNS와 HTTPS 인증서 준비.
- 이 사이트만을 위한 DSM 역방향 프록시 규칙 준비: 공개 HTTPS 주소 → HTTP `127.0.0.1:선택한 포트`.
- 기존 서비스의 프록시와 네트워크 설정을 유지하며 실제 모바일·외부 HTTPS 접속 확인.

공개 도메인과 NAS 주소가 없어도 로컬 화면 개발과 이미지 준비는 가능합니다. 이 문서가 해당 설정을 완료했다는 의미는 아닙니다.

## 업데이트와 복구

PC/CI에서 새 태그의 이미지를 빌드·검사·저장하고 NAS로 가져옵니다. 이 프로젝트 `.env`의 `JOHNWEST_IMAGE`만 새 태그로 바꾼 뒤 같은 프로젝트의 `up -d`를 실행합니다. 실행 중인 컨테이너를 단순히 재시작하는 것으로는 새 이미지가 반영되지 않습니다.

이전 이미지를 확인이 끝날 때까지 보관합니다. 문제가 생기면 이 프로젝트의 `JOHNWEST_IMAGE`를 이전 태그로 되돌리고 `up -d`를 실행합니다. 사이트 확인 후 이미지 정리를 별도로 판단하며, NAS 전체 컨테이너·이미지를 지우는 명령은 사용하지 않습니다. 현재 첫 버전에는 영속 데이터가 없고, 저장 기능을 추가하면 별도의 백업 절차가 필요합니다.

## 공식 참고 문서

- [Next.js standalone 출력과 정적 파일 복사](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Compose 서비스 설정](https://docs.docker.com/reference/compose-file/services/)
- [Docker Compose 환경 변수 설정](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [Synology Container Manager 프로젝트](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_project?version=7)
- [Synology 이미지 가져오기](https://kb.synology.com/en-us/DSM/help/ContainerManager/docker_image?version=7)
