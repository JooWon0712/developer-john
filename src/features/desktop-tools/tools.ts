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
  release: { url: string; version?: string };
  screenshots: ToolScreenshot[];
  screenshotInfo?: Record<Language, string>;
  copy: Record<Language, ToolCopy>;
};

const overlayVersion = "v1.2.1";

export const desktopTools: DesktopTool[] = [
  {
    id: "nas-desktop-app",
    addedOrder: 1,
    path: "/workspace/tools/nas-desktop-app",
    repositoryUrl: "https://github.com/JooWon0712/nas-desktop-app",
    release: { url: "https://github.com/JooWon0712/nas-desktop-app/releases" },
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
    release: { url: "https://github.com/JooWon0712/pc-internet-monitor/releases" },
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
    release: {
      url: `https://github.com/JooWon0712/codex-usage-overlay/releases/tag/${overlayVersion}`,
      version: overlayVersion,
    },
    screenshotInfo: {
      ko: "아래는 v1.2.0에서 예시 데이터로 촬영한 화면입니다.",
      en: "These screenshots show v1.2.0 with sample data.",
    },
    screenshots: [
      {
        src: "/images/desktop-tools/codex-usage-overlay-detailed.png",
        width: 480,
        height: 314,
        caption: { ko: "상세형 배지", en: "Detailed badge" },
        alt: { ko: "Codex 주간 한도와 Claude Code 현재 세션·주간 한도를 막대와 초기화 일정으로 보여주는 배지", en: "Badge with bars and reset times for Codex’s weekly limit and Claude Code’s current session and weekly limits" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-compact.png",
        width: 516,
        height: 176,
        caption: { ko: "간결형 배지", en: "Compact badge" },
        alt: { ko: "Codex와 Claude Code의 잔여 한도와 초기화 일정을 한 줄씩 표시한 배지", en: "Badge showing each Codex and Claude Code limit with its reset time on one line" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-settings.png",
        width: 912,
        height: 1239,
        caption: { ko: "배지 형식과 표시 항목 설정", en: "Badge format and display settings" },
        alt: { ko: "배지 미리보기와 투명도, Codex 초기화 일정, Claude Code 한도 표시 옵션이 있는 설정 화면", en: "Settings with a badge preview, opacity slider, Codex reset options, and a Claude Code limit toggle" },
      },
      {
        src: "/images/desktop-tools/codex-usage-overlay-position-theme.png",
        width: 912,
        height: 1239,
        caption: { ko: "표시 위치와 테마 설정", en: "Position and theme settings" },
        alt: { ko: "세션 제목 아래 배치, 위치 보정, Codex 테마 따라가기 옵션이 있는 설정 화면", en: "Settings for placing the overlay below the session title, adjusting its position, and following the Codex theme" },
      },
    ],
    copy: {
      ko: {
        name: "Codex Usage Overlay",
        tagline: "남은 사용 한도를, 작업 화면에서 바로.",
        cardDescription: "Codex 주간 잔여 한도와 초기화 일정을 Codex 창 위에 표시하는 Windows 앱입니다. Claude Code의 5시간·주간 한도도 함께 볼 수 있습니다.",
        story: "Codex에서 작업하다가 잔여 한도를 보려면 다른 화면을 열어야 해서, 작업 창에서 바로 확인하는 배지를 만들었습니다. Codex와 Claude Code의 한도는 각 CLI에 로그인된 계정에서 가져옵니다.",
        features: [
          { title: "Codex 주간 한도", description: "주간 잔여 비율, 초기화 시각과 D-day를 확인합니다. 계정의 구독 요금제도 함께 표시할 수 있습니다." },
          { title: "Claude Code 한도", description: "설정에서 켜면 5시간 단위의 현재 세션과 주간 잔여 한도, 초기화 일정을 함께 표시합니다. 앱이 실행 중이면 보통 15분마다 자동으로 갱신합니다." },
          { title: "배지 형식과 위치", description: "막대가 있는 상세형과 한 줄씩 표시하는 간결형을 전환합니다. 세션 제목 아래 또는 사이드바에 배치하고 테마와 투명도를 조절할 수 있습니다." },
        ],
        requirements: ["Windows 10 / 11 · 64비트(x64)", ".NET Framework 4.8", "Windows용 Codex 데스크톱 앱", "Node.js와 ChatGPT 계정으로 로그인한 Codex CLI", "선택 항목 · 구독 계정으로 로그인한 Windows 네이티브 Claude Code CLI 2.1.273 이상(2.x)"],
        steps: [
          "GitHub 릴리스의 Assets에서 Windows x64 ZIP을 받습니다.",
          "ZIP 전체를 압축 해제한 뒤 UsageOverlay.exe를 실행합니다. 설정에서 ‘앱에서 확인’을 누르면 Codex로 돌아가 배지를 볼 수 있습니다.",
          "Claude Code 한도도 보고 싶다면 Claude Code CLI에 로그인한 뒤 오버레이 설정에서 ‘한도 표시’를 켭니다. 기본값은 꺼짐입니다.",
        ],
        notes: [
          "개인이 만든 보조 프로그램입니다. Codex 데스크톱과 CLI에 같은 계정으로 로그인하면 해당 계정의 한도가 표시됩니다.",
          "업데이트할 때는 X 또는 ‘종료’로 앱을 닫은 뒤 압축을 푼 폴더 전체를 교체합니다. 사용자 설정은 유지됩니다. runtime-paths.json을 직접 수정했다면 새 폴더에 옮기세요.",
          "Windows에서 게시자 확인 경고가 표시될 수 있습니다. GitHub 릴리스에서 SHA-256 체크섬과 실행 안내를 확인할 수 있습니다.",
        ],
      },
      en: {
        name: "Codex Usage Overlay",
        tagline: "Keep your remaining limits in view.",
        cardDescription: "A Windows overlay that shows your remaining weekly Codex limit and its reset time over the Codex window. You can also show Claude Code’s five-hour and weekly limits.",
        story: "I built a badge to check my remaining Codex usage without leaving the window where I work. The overlay reads usage limits from the accounts signed in to the Codex and Claude Code CLIs.",
        features: [
          { title: "Codex weekly limit", description: "See your remaining weekly percentage, reset time, and countdown. You can also display your subscription plan." },
          { title: "Claude Code limits", description: "Enable this option to show the current five-hour session and weekly limits with their reset times. They normally refresh every 15 minutes while the overlay is running." },
          { title: "Badge format and placement", description: "Switch between a detailed badge with bars and a compact one-line-per-limit badge. Place it below the session title or in the sidebar, and adjust the theme and opacity." },
        ],
        requirements: ["Windows 10 / 11 · 64-bit (x64)", ".NET Framework 4.8", "Codex desktop app for Windows", "Node.js and Codex CLI signed in with a ChatGPT account", "Optional · Native Windows Claude Code CLI 2.1.273 or later in the 2.x series, signed in with a subscription"],
        steps: [
          "Download the Windows x64 ZIP from Assets on the GitHub release page.",
          "Extract the entire ZIP and run UsageOverlay.exe. Use the button at the bottom of the settings window to return to Codex and see the badge.",
          "To see Claude Code limits, sign in to the Claude Code CLI and enable its limit display in the overlay settings. This option is off by default.",
        ],
        notes: [
          "This is an independently made companion. Use the same account in Codex desktop and Codex CLI to display the limits for that account.",
          "To update, close the app with X or Exit, then replace the whole extracted folder. Your settings are preserved. If you edited runtime-paths.json, copy it to the new folder.",
          "Windows may show a publisher warning. The GitHub release includes a SHA-256 checksum and setup guidance.",
        ],
      },
    },
  },
];

export function getDesktopTool(id: DesktopToolId) {
  return desktopTools.find(tool => tool.id === id)!;
}
