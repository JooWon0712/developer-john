# 디비전2 DLC 출시 이벤트 구현 리서치

확인일은 **2026년 11월 4일**, 사용자 시간대는 **Asia/Seoul**이다. developer-john의 이벤트별 보상 가이드를 추가할 때 사용할 사실, 데이터, 이미지와 수정 범위를 정리했다.

**현재 결정: 독립 페이지 구현 보류.** 2026-11-04 사용자는 연간 대형 이벤트 가이드 3~4개 정도에 집중하기로 정했다. 이번 출시 드롭스와 지원 요청 이벤트는 별도 체크리스트를 만들지 않고 자료를 참고용으로 보관한다. [서비스 운영 목표](../../service-plan.md)의 최신 선택을 따른다.

아래는 범위 조정 전의 구현 후보 설계다. 드롭스 보상 5개와 지원 요청 프로젝트 6단계의 사실·조건·이미지는 참고할 수 있지만, 구현 순서와 신규 페이지 제안은 현재 작업 지시가 아니다.

이 폴더는 구현 자료다. 앱 소스와 런타임 설정은 수정하지 않았으며, 아래 검증 계획은 후속 구현 단계에서 수행한다.

## 구현에 사용할 파일

| 파일 | 용도 |
| --- | --- |
| [rewards.json](rewards.json) | 이벤트 2개, 체크 11개, 한국어·영어 문구, 조건, 기간, 저장 키와 출처 |
| [assets/manifest.json](assets/manifest.json) | 이미지 원본 URL, 출처 성격, 크기, SHA-256과 그림 대조 결과 |
| [validation.json](validation.json) | 자료 검증 16개 결과와 앱 빌드·테스트 미실행 구분 |
| assets/*.png | 드롭스 개별 아이콘 5개 원본 |
| assets/*.jpg | 공식 드롭스 종합 이미지, 추천 보상 종합 이미지, 특급 장갑 이미지 |

JSON은 새 가이드의 입력 자료이며 현재 Red Moon 타입과 직접 호환되는 런타임 모듈이 아니다. 필요한 데이터만 신규 이벤트 모듈로 옮긴다. 문서의 구현 방식과 고정 ID·경로·저장 키는 권장 설계이며, 이벤트 사실과 구분한다.

## 기존 초안에서 보완할 내용

1. 공식 드롭스 안내의 날짜와 실제 캠페인 시각 자료를 분리한다. 공지의 11월 3~10일을 한국 시간 자정 경계로 바꾸어 카운트다운을 만들면 안 된다.
2. 보상 5종은 **누적 30·60·120·180·240분**이다. 시청 시간을 더해 10시간 30분으로 계산하지 않는다.
3. 친구 추천은 **추천인 2종, 초대받은 사람 1종**으로 역할을 구분한다. 누구나 한 계정에서 의상 3종을 받는 목록으로 만들지 않는다.
4. 지원 요청은 **프로젝트 보상 묶음 6개**를 체크한다. 마지막 단계 체크로 이전 단계나 무기 수령을 자동 처리하지 않는다.
5. 의상 토큰은 상점의 지정 대상 의상에 쓰는 시스템이다. 이번 토큰으로 모든 의상이나 DLC 디럭스 동료 의상을 해금할 수 있다고 쓰지 않는다.
6. 신규 보상 이름은 정식 한국어판 표기를 확인하기 전까지 영문명을 유지한다. 설명용 종류인 팔 휘장·백팩 장식과 아이템 고유 이름을 구분한다.
7. 보상 정보를 확인하거나 이미지를 표시한 사실을 실제 사용자 수령으로 기록하지 않는다.

## 출시 기념 Twitch 드롭스

### 공식 보상과 체크 항목

[Ubisoft 11월 3일 공지](https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/5EEgwKS6kDqyvUFo5PJYsB/the-division-2-echoes-of-central-park-launch-twitch-drops)에 따른 목록이다.

| 고정 체크 ID | 누적 분 | 공식 영문 이름 | 한국어 화면 표시 | 이미지 ID |
| --- | ---: | --- | --- | --- |
| drops-central-park-arm-patch | 30 | Central Park Arm Patch | 영문명 + 팔 휘장 | central-park-arm-patch |
| drops-named-cache | 60 | Named Cache | 네임드 상자 | named-cache |
| drops-bird-skull-backpack-trophy | 120 | Bird Skull Backpack Trophy | 영문명 + 백팩 장식 | bird-skull-backpack-trophy |
| drops-exotic-cache | 180 | Exotic Cache | 특급 상자 | exotic-cache |
| drops-outfit-token | 240 | Outfit Token | 의상 토큰 · 설명용 번역 | outfit-token |

팔 휘장·장식·토큰의 새 한국어 고유 이름은 미검증이다. 한국어 화면에서는 고유 이름 미확인 표시와 영문명을 함께 제공한다. 네임드 상자와 특급 상자는 기존 사이트의 한국어 용어를 사용한다. 이름을 나중에 수정해도 체크 ID는 유지한다.

### 기간의 두 가지 근거

| 근거 | 표기 | 구현에서의 용도 |
| --- | --- | --- |
| Ubisoft 공식 공지 | 2026-11-03~2026-11-10, 시각·시간대 없음 | 공식 안내 기간으로 표시 |
| TTVDrops의 TwitchDropsMiner 자료 | 11/03 16:00~11/10 15:59 UTC, 분 단위 | 비공식 시각 참고자료로만 표시 |
| 위 자료의 한국 시간 환산 | 11/04 01:00~11/11 00:59 KST | 출처와 함께 참고 표시 가능 |

[캠페인 자료](https://ttvdrops.lovinator.space/twitch/campaigns/3ca93244-cef5-4afc-947f-ad4bca063509/)의 데이터 원천은 TwitchDropsMiner이며, Ubisoft가 발표한 공식 해금 시각이 아니다. 종료 초 단위는 확인되지 않았다. 공개 화면의 기본값은 **정확한 마감은 Twitch 드롭스 보관함에서 확인**으로 한다. 공식 일정과 비공식 시각을 조합해 새로운 확정 종료일을 만들지 않는다.

JSON의 공식 startsAt·endsAt·timeZone은 null이다. 비공식 시각은 thirdPartyObservation에 별도로 보관했으며 공식 카운트다운에 쓰지 않도록 표시했다.

### 참여와 수령

공식 안내의 참여 순서는 계정 연결, 참여 방송 시청, Twitch에서 직접 수령, 해당 플랫폼의 게임 로그인이다. 참여 채널 사이의 시청 시간은 합산된다.

- 연결: [Ubisoft Drops](https://drops-register.ubi.com/)
- 참여 방송 탐색: [디비전2 Twitch 카테고리](https://www.twitch.tv/directory/category/tom-clancys-the-division-2)
- 진행·수령 확인: [Twitch 드롭스 보관함](https://www.twitch.tv/drops/inventory)

사이트는 시청 시간·계정 연동·실제 지급 여부를 조회하지 않는다. 체크는 사용자가 직접 입력하는 수령 기록이다. 시청 시간 조건을 채웠다는 이유로 자동 체크하지 않는다.

DLC 구매 조건, 다음 보상 진행에 이전 Claim이 필수인지, 이번 드롭의 최대 배송 시간은 공지에 없다. 임의 조건이나 배송 보장 시간을 추가하지 않는다. 친구 추천 약관의 최대 24시간 안내를 Twitch 배송 시간으로 재사용하지 않는다.

### 의상 토큰 설명

[8월 11일 공식 시스템 설명](https://news.ubisoft.com/en-us/article/20x1vIjVZwX7f14yN12JaV/the-division-2-broken-rain-incursion-everything-you-need-to-know)은 토큰 아이콘이 붙은 일부 상점 의상을 토큰 1개로 전체 해금한다고 안내한다. 일부 부위를 이미 소유해도 토큰 한 개를 사용한다. 이는 일반 시스템의 설명이며, 11월 드롭의 별도 사용 대상 목록이 발표된 것은 아니다.

공개 문구는 **상점에서 의상 토큰 아이콘이 표시된 대상 의상을 확인하세요**로 제한한다.

## 지원 요청 이벤트

### 기간과 조건

[11월 2일 TUY8S3.3 공지](https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/7L8TlD1Hv0XC1prOD8mdte/tuy8s33-crossplay-rollout-conflict-improvements-more)는 **11월 17~26일**, 프로젝트 6개와 단계별 지원 등급 1 상승을 안내한다. 전체 체인은 첫날부터 제공되므로 일일 공개를 기다리는 구조로 설명하지 않는다. 기존 등급의 소급 인정이나 수락 화면의 세부 순서는 확인되지 않았다.

### 단계별 기록

| 체크 ID | 묶음 보상 |
| --- | --- |
| shepherd-project-1~5 각각 | 특급 부품 10개, 경험치 700,000, Reconstructed Cache 1개 |
| shepherd-project-6 | 특급 부품 10개, 경험치 700,000, Malinois 네임드 Mk16 1개 |

전체 합계는 **특급 부품 60개 + 경험치 4,200,000 + 상자 5개 + Malinois 1개**다. 이 합계는 공지의 단계별 수치로 계산했으며 XP 배수·추가 보너스를 포함하지 않는다.

여섯 단계는 JSON에서 각각 분리돼 있다. 체크 의미는 **해당 프로젝트 보상 수령**이다. 별도 Malinois 중복 체크를 두거나, 진행 완료와 수령을 한 번에 추정하지 않는다. 캐시와 무기의 한국어 이름, 프로젝트별 공식 제목과 Malinois 전용 이미지는 미확인이다.

단계별 보상 수령률은 여섯 묶음 중 체크된 수로 표시한다. 부품 60개를 60개의 체크로 만들거나, 경험치를 수령률 분모에 합산하지 않는다.

## 관련 안내의 범위

### 시즌 최종 임무

Loaded for Bear 특급 장갑은 11월 3일부터 마스터 난이도 첫 완료로 보장된다. 다른 난이도에서도 드롭될 수 있으나 확률 수치는 없다. 정확한 시즌 선행 HVT 개수, DLC 소유 조건과 종료일은 이 공지에서 확인되지 않았다. 기존 시즌의 HVT 개수나 일정을 옮겨 쓰지 않는다.

HVT 표시 정찰 과제를 완료해도 임무가 잠겨 있으면 로그아웃 후 재접속하라는 공지상 해결책이 있다. 공개 전에 최신 수정 공지와 대조한다. [공식 패치 안내](https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/7L8TlD1Hv0XC1prOD8mdte/tuy8s33-crossplay-rollout-conflict-improvements-more)

### 친구 추천

| 대상 | 조건 | 보상 |
| --- | --- | --- |
| 추천인 | 유효 추천 1명 | Cyclops Outfit |
| 추천인 | 유효 추천 2명 | Esprit de Corps Outfit |
| 초대받은 사람 | 해당 추천 참여 | Frenzied Outfit |

공지의 최소 플레이 시간은 초대된 친구 **2시간**이다. 추천인과 동행해야 하는지, 현재 신규·복귀 자격과 기존 추천 보상 소급 여부는 미확인이다. [공식 추천 사이트](https://referral.ubisoft.com/the-division-2-referral/)의 현행 FAQ와 계정별 안내로 연결한다.

2020년의 세 임무 동행 규칙이나 2024년 도움말의 첫 플레이 날짜 조건을 2026년 조건으로 확정하지 않는다. 일반 추천 약관은 지급 반영에 최대 24시간이 걸릴 수 있다고 설명하지만, 프로그램별 자격은 현행 FAQ에 맡긴다. [추천 약관](https://www.ubisoft.com/legal/documents/termsandconditionsreferralprogram/en-US)

이 두 안내는 출시 드롭스 상세 페이지 하단의 체크 없는 관련 정보 section으로 둔다. 이벤트 registry와 신규 기간 한정 이벤트 11개 체크의 수령률에는 등록하지 않는다. 이후 역할별 개인 기록을 요구하면 별도 설계를 추가할 수 있다.

## 공개를 보류할 항목

| 항목 | 확인 상태 | 처리 |
| --- | --- | --- |
| DLC 기념 이벤트 패스 | 후속 상세 안내 예고만 확인 | 가격·트랙·종료일·체크 항목 생성 보류 |
| 이벤트 패스 11/10~11/24 주장 | 공식 근거 미확인 | 확정 일정으로 게시하지 않음 |
| 경험치 3배·6배와 이후 글로벌 이벤트 | 커뮤니티 캘린더 확인 | 일정 참고 정보로만 다루고 보상 체크와 분리 |
| 핏빛 사냥개 조련사 의상 지급 | 기존 레드 문 후속 보상 | 기존 가이드에서 다루며 새 드롭스 보상에 추가하지 않음 |

[커뮤니티 캘린더](https://prototrack.gg/seasonal-calendar.php?season=y8s3)에는 11/3~6 XP 3배, 11/6~10 XP 6배, 11/10~17 시즌 XP 5배와 Golden Bullet이 표기돼 있다. 실제 게임 내 일정과 공식 자료를 대조하기 전까지 출시 보상 페이지의 확정 조건으로 사용하지 않는다.

## 이미지 자료와 적용

모든 파일은 원본 바이트이며 크롭·재인코딩하지 않았다. 실제 그림을 확인해 드롭스 5종과 공식 종합 이미지의 일치를 대조했다. 원본 다운로드와 파일 검증은 공개 재사용 라이선스 확인을 뜻하지 않는다. 사이트에서 사용할 때 원래 Ubisoft·Twitch 출처를 보존한다.

| 파일 | 크기 | 용량 바이트 | 그림 확인 |
| --- | --- | ---: | --- |
| twitch-drops-overview.jpg | 960×540 | 168,920 | 시간별 보상 5종과 NOV 3~NOV 10 표기 |
| twitch-central-park-arm-patch.png | 160×160 | 52,122 | CENTRAL PARK 글자와 청록·녹색 도안 |
| twitch-named-cache.png | 160×160 | 30,989 | 회색·주황색 상자 |
| twitch-bird-skull-backpack-trophy.png | 160×160 | 18,421 | 고리가 달린 새 두개골 |
| twitch-exotic-cache.png | 160×160 | 32,561 | 붉은 덮개의 특급 상자 |
| twitch-outfit-token.png | 160×160 | 39,898 | 청록 토큰과 검은 셔츠 아이콘 |
| friend-referral-outfits.jpg | 960×540 | 149,682 | 인물 2명과 장식·아이콘, 개별 의상명 없음 |
| loaded-for-bear.jpg | 960×540 | 170,674 | 장갑과 LOADED FOR BEAR 영문 표기 |

이미지 8개의 합계는 **663,267바이트**, 개별 드롭스 아이콘 5개는 **173,991바이트**다. JPEG 3개는 공식 본문 연결 파일이고, PNG 5개는 비공식 캠페인 색인에서 발견한 Twitch CDN 파일이다. 출처 호스트와 매핑 발견 경로를 manifest에서 구분한다.

친구 추천 종합 이미지는 개별 3종의 이름과 위치를 확인할 수 없으므로 특정 인물 크롭에 Cyclops·Esprit de Corps·Frenzied를 임의 배정하지 않는다. Malinois는 확인한 이미지가 없으므로 텍스트 카드로 시작한다.

런타임 자산을 만들 때는 다음을 권장한다.

- public/games/the-division-2/<event-slug>/ 아래에 이벤트별로 분리한다.
- 투명 아이콘은 알파를 유지한 WebP 후보를 원본과 비교한다. 160px 원본을 512px로 확대하지 않는다.
- 카드 아이콘은 약 80~120 CSS px로 표시한다. 확대 시 실제 원본 크기와 한계를 고려한다.
- 이미지 확대에는 width·height와 설명을 제공하고, 닫으면 원래 버튼으로 키보드 초점을 돌린다.
- 데이터에 Base64 이미지나 런타임 원격 이미지 요청을 추가하지 않는다. 현재 자료를 앱 자산으로 옮긴 뒤 로컬 경로를 사용한다.
- 비공식 자료를 동작 중인 외부 API로 연결하지 않는다. 이번 JSON은 정적 스냅샷이다.

## 현재 코드에서 확인한 연결 지점

저장소의 실제 소스는 README의 오래된 화면 설명보다 우선한다. 이번 조사에서 다음을 확인했다.

| 위치 | 확인한 구조 | 신규 작업 |
| --- | --- | --- |
| src/features/division2/event-guides.ts:12~22 | 이벤트 목록 registry, startsOn·endsOn 필수, Red Moon 1건 | 신규 이벤트 2건 등록 |
| src/features/division2/game-page.tsx:63 | registry를 링크 목록으로 렌더링 | 최상위 catalog 서비스 중복 등록 불필요 |
| src/app/services/game/the-division-2/red-moon-unleashed-2026/page.tsx | 한국어 정적 wrapper | 새 slug용 wrapper |
| src/app/en/services/game/the-division-2/red-moon-unleashed-2026/page.tsx | 영어 정적 wrapper | 대응 영어 wrapper |
| src/lib/site.ts:26 | pageMetadata의 canonical·언어·공유 메타데이터 | 기존 함수 재사용 |
| src/components/language-switch.tsx:26 | 쿼리·해시 유지 언어 전환 | 공통 동작 사용 |
| src/features/privacy/copy.ts:38 | 이벤트별 localStorage 안내 | 새 처리 범위와 실제 초기화 방식 일치 확인 |

별도 DNS·서브도메인·서버·DB·계정 시스템은 필요 없다. 현재 src/app에는 XML sitemap·robots 파일이 없으므로 새 이벤트 추가가 자동으로 XML sitemap에 반영된다고 설명하지 않는다.

### Red Moon 전용 코드

다음 모듈은 이벤트 데이터가 직접 결합되어 있다.

| 파일 | 결합 내용 |
| --- | --- |
| red-moon/progress.ts:1~54 | 전용 key·eventId·체크 집합, apparelCount 43, reward/bounty/owned 집계 |
| red-moon/storage.ts:1 | 위 정규화·key 직접 사용 |
| red-moon/localization.ts:1 | Red Moon 두 언어 데이터와 검색 색인 |
| red-moon/navigation.ts:1 | Red Moon group만 해시 해석 |
| red-moon/reward-checklist.tsx:5,145,168,219 | 전용 import, 의류·통계·twitch group 예외 |
| red-moon/event-page.tsx:12 | 레드 문 제목·기간·출처와 main/drops 일정 |
| red-moon/event-en.ts:8 | 기존 ID별 영어 사전 |

이 컴포넌트에 새 event만 넘겨 즉시 재사용할 수는 없다. 기존 Red Moon 디렉터리를 보존하고, 신규 이벤트끼리 쓸 작은 공유 기반을 추가하는 방식을 권장한다. 프레임 TerminalWindow, SharePageButton, pageMetadata와 스타일의 시각 패턴은 재사용할 수 있다.

## 신규 페이지와 저장 설계

| 구분 | 값 |
| --- | --- |
| 드롭스 ID·slug | echoes-of-central-park-drops-2026 |
| 지원 요청 ID·slug | shepherd-event-2026-11 |
| 한국어 기본 경로 | /services/game/the-division-2/<slug> |
| 영어 기본 경로 | /en/services/game/the-division-2/<slug> |
| 저장 키 | developer-john:division2:<event-id>:v1 |
| 기록 형식 | eventId, schema:1, checkedIds, savedAt |
| 초기값 | checkedIds는 빈 배열, savedAt은 null |
| 수령률 | 드롭스 5개, 지원 요청 6개 각각 계산 |

두 언어는 ID·순서·저장 키를 공유한다. 전역 합산 진행도를 만들 필요는 없다. 안내 카드와 미래 패스는 체크 수에 넣지 않는다. 기존 Red Moon key인 developer-john:division2:red-moon-unleashed-2026:v1과 66개 ID는 그대로 둔다.

### 상태와 사용자 입력

- 저장 내역을 읽기 전 체크를 비활성화해 초기 빈 상태로 기존 기록을 덮지 않는다.
- 손상된 값·다른 eventId·다른 schema·알 수 없는 ID는 오류로 다루고 원본을 자동 덮어쓰지 않는다.
- 정상 기록의 중복 ID는 한 번만 센다.
- 저장 실패 시 화면의 선택을 유지하고 저장되지 않았음을 안내한다.
- 다른 탭에서 같은 key가 바뀌거나 삭제되면 반영한다. 전역 clear 이벤트도 다시 읽되 앱에서 localStorage.clear()를 실행하지 않는다.
- 초기화는 기존 사이트 방침에 맞춰 현재 이벤트 key에 정상 형식의 빈 기록을 저장하고 해당 화면을 빈 상태로 돌린다. 다른 이벤트 key를 변경하지 않는다.
- 종료된 이벤트도 과거 수령 기록을 입력·해제할 수 있게 한다.
- 시간 경과, 이전 단계, 마지막 단계 선택으로 다른 체크를 자동 처리하지 않는다.
- 계정명·인증 정보·실제 시청 기록을 수집하지 않고 체크 값을 GA 이벤트로 전송하지 않는다.

### 검색과 일정 표시

한국어·영어 이름과 별칭을 함께 검색하며 NFKC 정규화와 소문자화를 적용한다. 예를 들어 Backpack Trophy Bird Skul처럼 캠페인 색인에서 잘린 이름은 검색 별칭으로만 두고 공식 이름은 Bird Skull Backpack Trophy로 표시한다.

기존 periodStatus는 날짜 경계에 **시각 미공지**를 표시하는 정책을 참고할 수 있다. 정확한 UTC·KST 시각이 확정되지 않은 이벤트는 seconds 카운트다운을 만들지 않는다. 공지 기간 종료 표시는 실제 보상 수령 서버가 닫혔다는 판정과 구분하고 체크 기능을 잠그지 않는다.

기간 미정인 추천·최종 임무를 registry에 등록하려면 endsOn 필수 타입과 game-page의 날짜 표시를 먼저 바꿔야 한다. 이번 1·2단계는 기간이 있는 두 이벤트만 registry에 추가하면 그 변경은 필요 없다.

안내 카드에는 체크가 없으므로 현재 visibleChecks 기반 필터에 그대로 넣으면 사라질 수 있다. 신규 공유 구조에서는 안내와 보상 항목의 렌더링 규칙을 나눈다.

## 추후 구현을 재개할 때의 참고 순서

1. 저장소 AGENTS.md와 설치된 node_modules/next/dist/docs의 관련 가이드를 확인하고 현재 Git 변경을 먼저 확인한다.
2. 신규 이벤트용 공유 화면·저장 정규화·일정 함수를 src/features/division2/event-guide/에 만든다. Red Moon 전체 일반화는 이번 범위에서 피한다.
3. 드롭스 데이터와 두 언어 정적 wrapper, 로컬 이미지, 이벤트 목록 등록을 추가한다.
4. 드롭스 5개만으로 검색·수령·저장·언어 전환·초기화를 확인한다.
5. 지원 요청 6개 묶음을 독립 데이터·wrapper·저장 키로 추가한다.
6. 최종 임무·친구 추천은 관련 안내 카드로 추가한다. 계정 자격은 공식 사이트로 연결한다.
7. 공식 패스 보상과 한국어판 명칭이 확인되면 기존 ID를 유지하면서 데이터를 갱신한다.

구조 예시는 다음과 같다. 파일명은 구현 단계에서 조정할 수 있으나 이벤트 ID와 저장 키는 공개 후 안정적으로 유지한다.

```text
src/features/division2/
  event-guide/                       신규 가이드 공용 화면과 저장
  echoes-of-central-park-drops-2026/  이벤트 데이터와 문구
  shepherd-event-2026-11/             이벤트 데이터와 문구
src/app/services/game/the-division-2/<slug>/page.tsx
src/app/en/services/game/the-division-2/<slug>/page.tsx
public/games/the-division-2/<slug>/
scripts/test-dlc-launch-events.mjs    신규 검증
```

## 구현 후 검증

| 영역 | 필수 확인 |
| --- | --- |
| 데이터 | 체크 5·6개, ID 고유성, 두 언어 ID·순서 일치, 단계 보상 합계 |
| 저장 | 첫 방문 빈 상태, 재실행 복원, 이벤트 격리, 언어 공유, 현재 key만 초기화, 새로고침 없이 두 이벤트 사이를 이동한 뒤의 기록 격리 |
| 오류 | 손상 기록 보존, 잘못된 eventId/schema 거부, quota 실패, storage 이벤트 |
| 일정 | 시작·종료일 당일 시각 미공지, KST 환산 분리, 공지 종료 뒤 체크 가능 |
| UI | 검색과 필터, 빈 결과, 앵커 자동 펼침, 이미지 확대·Esc·초점 복귀 |
| 접근성 | 키보드 체크, 라벨, 수령률 텍스트, 모바일 가로 넘침 |
| 경로 | ko/en 200, canonical·hreflang, 언어 전환 query/hash, 없는 slug 404 |
| 회귀 | 기존 Red Moon 66개·23개 이미지와 저장 fixture 유지 |
| 자료 | 이미지 해시·크기·출처, 개별 의상 이미지 오배정 없음 |

현재 package.json에서 사용할 수 있는 확인 명령은 npm run typecheck와 npm run build이다. 기존 scripts/test-red-moon.mjs, test-i18n.mjs와 신규 이벤트 검증을 실행한다. 브라우저 저장·두 탭·초점·모바일 검토는 구현 후 실제 화면에서 확인한다.

이번 리서치에는 앱 빌드·자동 테스트 통과 결과가 포함되어 있지 않다. 현재 소스 읽기, 자료 JSON과 이미지 검증을 앱 기능 검증과 구분한다.

## 추후 구현을 재개할 때의 인계

현재는 구현을 진행하지 않는다. 이후 사용자가 이 구현을 재개하면 README.md, rewards.json, assets/manifest.json과 최신 서비스 운영 목표를 먼저 확인한다. 아래 설계를 재사용할 경우 기존 레드 문 화면·66개 체크·저장 키는 보존한다. 한국어·영어 경로는 같은 수령 기록을 사용하고, 새 방문자는 미체크 상태로 시작한다. 공식 미확인 시각·이름·추천 자격은 최신 자료로 다시 대조한다. 제공 이미지의 원본과 매핑을 확인해 이벤트별 로컬 자산으로 적용하고, 관련 Node 검증·typecheck·build와 브라우저 저장·접근성 확인을 완료한 뒤 변경 내용을 보고한다.

현재 자료는 보류된 구현 후보의 참고 기록이다. 앱 구현·커밋·푸시·배포는 수행하지 않았다.
