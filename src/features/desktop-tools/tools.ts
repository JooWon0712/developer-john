import type { Language } from "@/lib/i18n";

export type DesktopToolId = "nas-desktop-app" | "pc-internet-monitor" | "codex-usage-overlay";

type ToolCopy = {
  name: string;
  tagline: string;
  cardDescription: string;
  story: string;
  features: { title: string; description: string }[];
  requirements: string[];
  steps: string[];
  notes: string[];
};

type ToolScreenshot = {
  src: string;
  width: number;
  height: number;
  caption: Record<Language, string>;
  alt: Record<Language, string>;
};

type DesktopTool = {
  id: DesktopToolId;
  addedOrder: number;
  path: string;
  repositoryUrl: string;
  distribution: { kind: "releases" | "actions"; url: string };
  screenshots: ToolScreenshot[];
  screenshotInfo?: Record<Language, string>;
  copy: Record<Language, ToolCopy>;
};

export const desktopTools: DesktopTool[] = [
  {
    id: "nas-desktop-app",
    addedOrder: 1,
    path: "/workspace/tools/nas-desktop-app",
    repositoryUrl: "https://github.com/JooWon0712/nas-desktop-app",
    distribution: { kind: "releases", url: "https://github.com/JooWon0712/nas-desktop-app/releases" },
    screenshots: [
      {
        src: "/images/desktop-tools/nas-desktop-login.png",
        width: 1529,
        height: 1029,
        caption: { ko: "NAS 로그인 화면", en: "NAS sign-in screen" },
        alt: { ko: "NAS Desktop 전용 창 안에 표시된 NAS 로그인 화면", en: "The NAS sign-in interface inside the NAS Desktop window" },
      },
      {
        src: "/images/desktop-tools/nas-desktop-connected.png",
        width: 1529,
        height: 1029,
        caption: { ko: "NAS에 연결한 화면", en: "Connected to the NAS" },
        alt: { ko: "NAS Desktop에서 NAS에 연결해 관리 화면을 연 모습", en: "The NAS management interface open in NAS Desktop after connecting" },
      },
    ],
    copy: {
      ko: {
        name: "NAS Desktop",
        tagline: "내 NAS를, 익숙한 앱처럼.",
        cardDescription: "시놀로지 NAS를 전용 창에서 편하게 쓰고 싶어 직접 만들었습니다. 지금도 제 NAS에 접속할 때 사용하는 Windows 앱입니다.",
        story: "시놀로지 NAS를 사용하면서 관리 화면을 Windows 앱처럼 열어 쓰고 싶었습니다. 제 사용 방식에 맞춰 직접 만들었고, 지금도 NAS 관리 화면과 여러 앱을 한 창에서 사용하고 있습니다.",
        features: [
          { title: "한 창에서 여는 NAS 앱", description: "Photos·Drive 등 같은 NAS의 앱 화면을 탭으로 열고, 단축키로 전환합니다." },
          { title: "주소와 연결 관리", description: "NAS 주소와 이름을 저장하고, 직접 HTTPS 주소나 Synology QuickConnect로 연결합니다." },
          { title: "내게 맞는 화면", description: "라이트·다크·시스템 모드와 색상 테마를 선택해 사용합니다." },
        ],
        requirements: ["Windows 10 / 11 · 64비트(x64)", ".NET Framework 4.8 이상", "WebView2 Evergreen Runtime", "정상 인증서가 적용된 NAS HTTPS 연결"],
        steps: [
          "GitHub 릴리스에서 Windows ZIP을 받아 전체를 압축 해제하고 NasDesktop.exe를 실행합니다. 함께 제공되는 DLL도 같은 폴더에 둡니다.",
          "주소 기록 → 새 주소 추가에서 NAS HTTPS 주소나 QuickConnect 정보를 등록합니다.",
          "사용할 NAS를 선택해 연결하고, NAS 웹 화면에서 로그인합니다. 같은 NAS의 앱은 탭으로 열어 사용합니다.",
        ],
        notes: [
          "개인이 만든 프리뷰 앱입니다. 제조사 공식 앱이 아니며, 모든 NAS 패키지·2단계 인증·업로드 방식의 호환성을 확인한 것은 아닙니다.",
          "현재 배포 파일에는 Windows 게시자 서명이 없습니다. 릴리스에서 실행 안내와 빌드 출처 확인 방법을 확인할 수 있습니다.",
        ],
      },
      en: {
        name: "NAS Desktop",
        tagline: "A dedicated window for my NAS.",
        cardDescription: "I built this Windows app because I wanted a dedicated window for my Synology NAS. I still use it to access my NAS.",
        story: "While using my Synology NAS, I wanted to open its management interface like a Windows app. I built a tool around the way I use my NAS, and I still use it to keep its management interface and apps in one window.",
        features: [
          { title: "NAS apps in one window", description: "Open apps from the same NAS, such as Photos and Drive, in tabs and switch between them with keyboard shortcuts." },
          { title: "Saved connections", description: "Manage NAS addresses and names, then connect using a direct HTTPS address or Synology QuickConnect." },
          { title: "A familiar look", description: "Choose light, dark or system mode and a color theme." },
        ],
        requirements: ["Windows 10 / 11 · 64-bit (x64)", ".NET Framework 4.8 or later", "WebView2 Evergreen Runtime", "A NAS HTTPS connection with a valid certificate"],
        steps: [
          "Download the Windows ZIP from GitHub Releases, extract the whole folder and run NasDesktop.exe. Keep the included DLL files in the same folder.",
          "Open the connection history, add a new address, and enter your NAS HTTPS address or QuickConnect details.",
          "Select your NAS, connect and sign in through its web interface. Open apps from the same NAS in tabs.",
        ],
        notes: [
          "This is an independently made preview, not an official NAS manufacturer app. Compatibility with every NAS package, two-step verification flow and upload workflow has not been verified.",
          "The current release is not signed with a Windows publisher certificate. Release notes include setup guidance and build provenance information.",
        ],
      },
    },
  },
  {
    id: "pc-internet-monitor",
    addedOrder: 1,
    path: "/workspace/tools/pc-internet-monitor",
    repositoryUrl: "https://github.com/JooWon0712/pc-internet-monitor",
    distribution: { kind: "releases", url: "https://github.com/JooWon0712/pc-internet-monitor/releases" },
    screenshots: [
      {
        src: "/images/desktop-tools/pc-internet-monitor-running.png",
        width: 1372,
        height: 1146,
        caption: { ko: "연결 검사 실행 화면", en: "Connection checks in progress" },
        alt: { ko: "PC 인터넷 모니터에서 연결 검사 결과를 표시하는 화면", en: "PC Internet Monitor displaying connection check results" },
      },
      {
        src: "/images/desktop-tools/pc-internet-monitor-history.png",
        width: 1372,
        height: 1146,
        caption: { ko: "검사 실패 이력 화면", en: "Check failure history" },
        alt: { ko: "PC 인터넷 모니터에서 기록한 검사 실패 이력을 살펴보는 화면", en: "The recorded check failure history in PC Internet Monitor" },
      },
    ],
    copy: {
      ko: {
        name: "PC 인터넷 모니터",
        tagline: "끊겼던 순간을, 기록으로 다시 확인.",
        cardDescription: "게임 중 가끔 인터넷이 끊기는 이유가 궁금해 직접 만들었습니다. 연결 상태와 검사 실패·회복 이력을 기록하며 원인을 좁혀보는 데 사용하고 있습니다.",
        story: "게임을 하다 가끔 인터넷이 끊겼지만, 지나고 나면 어디에서 문제가 있었는지 알기 어려웠습니다. 문제가 생긴 시각의 연결 상태를 남기고 싶어 직접 만들었고, 지금도 검사 실패와 회복 이력을 확인하는 데 사용하고 있습니다.",
        features: [
          { title: "연결 상태 확인", description: "PC 연결과 공유기·외부 응답·DNS·HTTPS 검사 결과를 확인합니다." },
          { title: "실패와 회복 이력", description: "어느 검사에서 언제 실패와 회복이 관측됐는지, 확인된 범위와 함께 살펴봅니다." },
          { title: "내 PC에 기록 저장", description: "검사 결과와 요약을 로컬 파일에 남겨 문제가 생긴 시점을 다시 확인합니다." },
        ],
        requirements: ["Windows 10 / 11 · 64비트(x64)", ".NET Framework 4.8", "기록 파일을 저장할 수 있는 폴더"],
        steps: [
          "GitHub 릴리스에서 PcInternetMonitor.exe를 받아 기록을 저장할 수 있는 폴더에 두고 실행합니다. 별도 설치 과정은 없습니다.",
          "확인할 랜선·Wi-Fi 연결을 고르고 검사 시작을 누릅니다. 검사 결과와 실패·회복 이력을 확인합니다.",
          "검사 중지로 마무리한 뒤, 기록 폴더에서 원본 기록과 요약을 확인합니다.",
        ],
        notes: [
          "검사 기록은 원인을 좁혀보는 자료입니다. 인터넷 전체 장애나 통신사 고장을 확정하거나 실제 게임 핑을 측정하지는 않습니다.",
          "최소화하면 검사가 중지됩니다. 최소화하지 않고 게임이나 다른 창으로 전환하면 검사를 계속할 수 있습니다.",
          "현재 배포 파일에는 Windows 게시자 서명이 없습니다. 실행 전 GitHub 릴리스의 안내를 확인하세요.",
        ],
      },
      en: {
        name: "PC Internet Monitor",
        tagline: "A record of when the connection failed.",
        cardDescription: "I built this after occasional internet interruptions while gaming left me wondering what had gone wrong. I use its check history to narrow down possible causes.",
        story: "My internet would occasionally cut out while gaming, but afterwards it was difficult to tell what had failed. I built this app to keep a record of connection checks at the time, and I still use it to review failures and recoveries.",
        features: [
          { title: "Connection checks", description: "Check the PC connection alongside gateway, external response, DNS and HTTPS results." },
          { title: "Failure and recovery history", description: "See which check failed, when failure or recovery was observed, and what the observations establish." },
          { title: "Local records", description: "Save check results and summaries on your PC to review what happened later." },
        ],
        requirements: ["Windows 10 / 11 · 64-bit (x64)", ".NET Framework 4.8", "A folder where the app can save its records"],
        steps: [
          "Download PcInternetMonitor.exe from GitHub Releases and run it from a folder where it can save records. No installer is needed.",
          "Choose the Ethernet or Wi-Fi connection to check, start the checks, and review the results and failure-and-recovery history.",
          "Stop the checks, then open the records folder to review the recorded results and summary.",
        ],
        notes: [
          "The results help narrow down possible causes. They do not conclusively identify an internet-wide or ISP outage, or measure in-game ping.",
          "Minimizing the app stops the checks. Switching to a game or another window without minimizing it allows the checks to continue.",
          "The current release is not signed with a Windows publisher certificate. Read the release notes on GitHub before running it.",
        ],
      },
    },
  },
  {
    id: "codex-usage-overlay",
    addedOrder: 2,
    path: "/workspace/tools/codex-usage-overlay",
    repositoryUrl: "https://github.com/JooWon0712/codex-usage-overlay",
    distribution: { kind: "actions", url: "https://github.com/JooWon0712/codex-usage-overlay/actions/workflows/windows-build.yml" },
    screenshotInfo: {
      ko: "오버레이의 수치는 촬영 당시의 값이며, 설정 미리보기는 예시 데이터입니다. 현재 계정의 실시간 한도를 보여주는 화면은 아닙니다.",
      en: "The overlay values were captured at the time of the screenshot; the settings preview uses example data. These images do not show your account’s live limits.",
    },
    screenshots: [
      {
        src: "/images/desktop-tools/codex-usage-overlay-light.png",
        width: 601,
        height: 247,
        caption: { ko: "밝은 테마의 잔여 한도 표시", en: "Remaining limits in the light theme" },
        alt: { ko: "Codex 창 위에 주간 잔여 한도와 초기화 일정을 표시한 밝은 테마 오버레이", en: "A light overlay displaying the remaining weekly limit and reset schedule over the Codex window" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-dark.png",
        width: 570,
        height: 264,
        caption: { ko: "어두운 테마의 잔여 한도 표시", en: "Remaining limits in the dark theme" },
        alt: { ko: "Codex 창 위에 주간 잔여 한도와 초기화 일정을 표시한 어두운 테마 오버레이", en: "A dark overlay displaying the remaining weekly limit and reset schedule over the Codex window" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-settings.png",
        width: 900,
        height: 1011,
        caption: { ko: "표시 항목과 투명도 설정", en: "Display options and opacity settings" },
        alt: { ko: "예시 한도 미리보기와 투명도, 초기화 일정, 요금제 표시 옵션이 있는 설정 화면", en: "Settings with a sample limit preview, opacity control, and options for the reset schedule and subscription plan" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-position-theme.png",
        width: 900,
        height: 1011,
        caption: { ko: "표시 위치와 테마 설정", en: "Position and theme settings" },
        alt: { ko: "세션 제목 아래 배치, 위치 보정과 어두운 테마를 선택하는 설정 화면", en: "Settings for placing the overlay below the session title, adjusting its position and selecting the dark theme" },
      },
    ],
    copy: {
      ko: {
        name: "Codex Usage Overlay",
        tagline: "남은 사용 한도를, 작업 화면에서 바로.",
        cardDescription: "Codex의 남은 사용 한도를 작업 중에도 바로 확인하고 싶어 직접 만들었습니다. 주간·5시간 잔여 한도와 초기화 일정을 Codex 창 위에 작게 표시하는 Windows 앱입니다.",
        story: "Codex를 사용하면서 남은 한도를 확인하느라 작업 흐름을 끊고 싶지 않았습니다. 필요한 정보를 작업 화면 위에 작게 띄워두려고 만들었습니다. Codex가 제공하는 한도 정보를 조회하며, 대화 내용이나 토큰 수로 잔여 한도를 추정하지 않습니다.",
        features: [
          { title: "잔여 한도와 초기화 일정", description: "계정에서 제공하는 주간·5시간 잔여 한도, 요금제와 주간 초기화 시각·D-day를 확인합니다." },
          { title: "작업 화면 위에 작게", description: "세션 제목 아래나 사이드바에 배치합니다. Codex가 전면에 있을 때 표시하고, 마우스 클릭은 아래 창으로 전달합니다." },
          { title: "내게 맞는 표시와 갱신", description: "위치·테마·투명도를 조절합니다. Codex가 전면에 있을 때 60초 간격으로 갱신하며, 오래된 값이나 조회 실패를 구분해 표시합니다." },
        ],
        requirements: ["Windows 10 / 11 · 64비트(x64)", ".NET Framework 4.8", "Windows용 Codex 데스크톱 앱(MSIX 버전)", "Node.js와 ChatGPT 계정으로 로그인한 Codex CLI", "한도 정보를 조회할 수 있는 인터넷 연결"],
        steps: [
          "GitHub 빌드 목록에서 성공한 실행을 열고, 로그인 후 Artifacts의 Windows x64 파일을 받습니다. 아직 정식 릴리스는 없으며 빌드 파일은 보관기간이 지나면 내려받을 수 없습니다.",
          "포함된 ZIP의 전체 내용을 압축 해제하고 UsageOverlay.exe를 실행합니다. 함께 제공되는 파일을 같은 폴더에 두고, Node.js와 Codex CLI를 먼저 준비합니다.",
          "Codex를 열어 한도 표시를 확인하고 위치·테마를 조정합니다. X나 종료를 누르면 완전히 종료되며, 업데이트할 때는 종료 후 전체 폴더의 파일을 교체합니다.",
        ],
        notes: [
          "OpenAI의 공식 앱이나 확장 기능이 아닌 개인 보조 프로그램입니다. 기존 Codex CLI의 로그인 계정을 사용하므로 데스크톱 앱과 CLI가 같은 계정인지 확인하세요.",
          "Codex 창의 구조를 이용해 위치를 맞추므로 앱 업데이트에 따라 배치가 달라질 수 있습니다. 모든 DPI·가상 데스크톱 환경의 호환성을 확인한 것은 아닙니다.",
          "설치 프로그램·트레이 상주·자동 시작·자동 업데이트 기능은 없습니다. 배포 파일에는 Windows 게시자 서명이 없으므로 GitHub의 실행 안내를 확인하세요.",
        ],
      },
      en: {
        name: "Codex Usage Overlay",
        tagline: "Keep your remaining limits in view.",
        cardDescription: "I built this to check my remaining Codex limits without leaving my work. It is a small Windows overlay showing weekly and five-hour limits and the reset schedule over the Codex window.",
        story: "I wanted to keep an eye on my remaining Codex limits without interrupting my work, so I built a small overlay. It reads the limit information provided by Codex, rather than estimating it from conversation content or token counts.",
        features: [
          { title: "Limits and reset schedule", description: "See the weekly and five-hour limits provided for your account, your subscription plan, and the weekly reset time and countdown." },
          { title: "A small overlay while you work", description: "Place it below the session title or in the sidebar. It appears while Codex is in the foreground, and mouse clicks pass through to the window below." },
          { title: "Display and refresh options", description: "Adjust the position, theme and opacity. It refreshes every 60 seconds while Codex is in the foreground and distinguishes stale data from failed requests." },
        ],
        requirements: ["Windows 10 / 11 · 64-bit (x64)", ".NET Framework 4.8", "Codex desktop app for Windows (MSIX version)", "Node.js and Codex CLI signed in with a ChatGPT account", "An internet connection to retrieve limit information"],
        steps: [
          "Open a successful run in the GitHub build list, sign in and download the Windows x64 artifact. There is no formal release yet, and build files are only available within their retention period.",
          "Extract the entire included ZIP and run UsageOverlay.exe. Keep all included files together, and set up Node.js and Codex CLI first.",
          "Open Codex to see the overlay and adjust its position and theme. Close it with X or Exit to fully stop the app. Exit before replacing the complete folder when updating.",
        ],
        notes: [
          "This is an independently made companion, not an official OpenAI app or extension. It uses the existing Codex CLI sign-in, so check that the CLI and desktop app use the same account.",
          "Positioning depends on the structure of the Codex window and may be affected by app updates. Compatibility with every DPI and virtual desktop setup has not been verified.",
          "There is no installer, system tray, automatic startup or automatic update feature. The files are not signed with a Windows publisher certificate; read the setup guidance on GitHub before running them.",
        ],
      },
    },
  },
];

export function getDesktopTool(id: DesktopToolId) {
  return desktopTools.find(tool => tool.id === id)!;
}
