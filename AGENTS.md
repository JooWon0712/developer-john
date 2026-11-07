<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 사용자 배포 요청

- 사용자가 “배포해줘”라고 요청하면 변경 사항을 검토·검증한 뒤 커밋, `origin/main` 푸시, 기존 NAS 배포 순서로 진행한다.
- NAS 배포 명령은 사용자가 직접 입력할 수 있는 Codex 통합 터미널에서 처음부터 실행한다. 사용자에게 같은 창의 `Password:` 프롬프트에 NAS sudo 비밀번호를 직접 입력하도록 안내하고 배포 결과를 확인한다.
- 현재 도구에서 통합 터미널로 명령을 보낼 수 없으면, 푸시 완료 후 사용자가 `NAS 배포` 바로가기로 시작할 수 있게 안내한다. 바로가기가 보이지 않으면 [배포 문서](docs/deploy-synology.md)의 명령을 같은 터미널에서 실행하도록 전달한다.
- 선택하지 않은 디자인 시안과 프리뷰 HTML은 보관한다.

## 서비스 표시 순서

- 서비스는 분야와 관계없이 최근 추가한 순서로 표시한다. 새 서비스의 `addedOrder`는 기존 최댓값보다 크게 지정하며, 기존 서비스의 내용 수정만으로 순서를 올리지 않는다.
- 함께 추가한 서비스는 같은 `addedOrder`를 쓰고 사용자가 정한 순서를 유지한다. 현재 순서는 Codex Usage Overlay → NAS Desktop → PC 인터넷 모니터 → 디비전2다.
- 한국어·영어 모두 공통 서비스 목록의 정렬을 사용한다.
