import type { Language } from "./localization";
import type { StorageState } from "./storage";

type RewardCopy = {
  storageMessages: Record<StorageState, string>;
  stats: Record<"reward" | "bounty" | "apparel" | "owned", { title: string; note: string }>;
  otherTabApplied: string;
  otherTabFailed: string;
  resetConfirm: string;
  resetNotice: string;
  apparelError: string;
  statsLabel: string;
  progressLabel: (title: string) => string;
  browseRewards: string;
  categoriesLabel: string;
  sidebarNote: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  filterAll: string;
  filterUnchecked: string;
  filterChecked: string;
  visibleCount: (count: number) => string;
  loading: string;
  savingStopped: string;
  saved: string;
  savePrompt: string;
  noScript: string;
  accordionHelp: string;
  expandAll: string;
  collapseAll: string;
  groupCount: (current: number | string, total: number) => string;
  groupLink: string;
  apparelLabel: string;
  apparelUnit: string;
  checkLabel: (group: string, entry: string, check: string) => string;
  completed: string;
  owned: string;
  received: string;
  unchecked: string;
  imageLabel: (title: string) => string;
  enlarge: string;
  emptyTitle: string;
  emptyHelp: string;
  showAll: string;
  privacyTitle: string;
  privacyHelp: string;
  resetButton: string;
  dialogTitle: string;
  close: string;
  imageEvidence: string;
  officialDetails: string;
  noticeDates: (published: string, checked: string) => string;
};

const copy: Record<Language, RewardCopy> = {
  ko: {
    storageMessages: {
      ready: "",
      unavailable: "이 브라우저에 기록을 저장할 수 없어요. 현재 화면에서만 유지되며, 페이지를 닫으면 변경 내용을 잃을 수 있어요.",
      corrupt: "기존 저장 기록을 읽을 수 없어 자동 저장을 멈췄어요. 기존 기록은 덮어쓰지 않았어요. 새로 시작하려면 이벤트 기록 초기화를 이용하세요.",
    },
    stats: {
      reward: { title: "보상 수령", note: "실제로 받은 보상" },
      bounty: { title: "현상수배 완료", note: "보상 수령과 별도" },
      apparel: { title: "의류 수집", note: "43종 중 수집한 수량" },
      owned: { title: "장비 보유", note: "이벤트 획득 경로 확인" },
    },
    otherTabApplied: "다른 탭의 최신 기록을 반영했어요.",
    otherTabFailed: "다른 탭의 기록을 읽지 못해 현재 화면을 유지했어요.",
    resetConfirm: "이 이벤트의 체크와 의류 수량을 모두 0으로 초기화할까요?",
    resetNotice: "이 이벤트의 기록을 초기화했어요.",
    apparelError: "0부터 43까지의 정수를 입력하세요.",
    statsLabel: "내 보상 기록",
    progressLabel: title => `${title} 진행`,
    browseRewards: "보상 둘러보기",
    categoriesLabel: "보상 분류",
    sidebarNote: "보상은 실제로 수령한 뒤 체크하세요. 체크 기록은 이 브라우저에만 저장돼요.",
    searchLabel: "보상 검색",
    searchPlaceholder: "보상, 표적, 지역 이름",
    filterLabel: "표시 상태",
    filterAll: "전체 보기",
    filterUnchecked: "미체크만",
    filterChecked: "체크한 항목만",
    visibleCount: count => `표시 중 ${count}개 체크 항목`,
    loading: "저장 기록 불러오는 중",
    savingStopped: "자동 저장 중지",
    saved: "이 브라우저에 저장됨",
    savePrompt: "체크하면 자동 저장",
    noScript: "보상 정보는 읽을 수 있어요. 체크와 자동 저장을 사용하려면 JavaScript를 허용하세요.",
    accordionHelp: "제목을 누르면 펼치거나 접을 수 있어요. 검색·필터 결과는 자동으로 펼쳐요.",
    expandAll: "모두 펼치기",
    collapseAll: "모두 접기",
    groupCount: (current, total) => `체크 ${current} / ${total}`,
    groupLink: "이 분류 바로가기 ↗",
    apparelLabel: "수집한 의류 수",
    apparelUnit: " / 43종",
    checkLabel: (group, entry, check) => `${group} · ${entry} · ${check}`,
    completed: "완료",
    owned: "보유",
    received: "수령함",
    unchecked: "확인 전",
    imageLabel: title => `${title} 이미지 크게 보기`,
    enlarge: "확대 ↗",
    emptyTitle: "조건에 맞는 보상이 없어요.",
    emptyHelp: "검색어나 분류, 표시 상태를 바꿔보세요.",
    showAll: "전체 보상 보기",
    privacyTitle: "내 기록은 이 브라우저에만",
    privacyHelp: "게임 계정과 연결되지 않으며, 체크해도 게임에서 보상이 수령되지는 않아요. 브라우저 데이터 삭제 시 기록도 사라질 수 있어요.",
    resetButton: "이벤트 기록 초기화",
    dialogTitle: "보상 이미지",
    close: "닫기 ×",
    imageEvidence: "게임에서 확인할 수 있는 보상 이미지입니다.",
    officialDetails: "공식 보상 안내 ↗",
    noticeDates: (published, checked) => `공지 ${published} · 안내 확인 ${checked}`,
  },
  en: {
    storageMessages: {
      ready: "",
      unavailable: "This browser cannot save your progress. Changes are kept on this page only and may be lost when you close it.",
      corrupt: "Your saved progress could not be read, so automatic saving has stopped. The existing record has not been overwritten. Use Reset event progress to start again.",
    },
    stats: {
      reward: { title: "Rewards received", note: "Rewards you have actually received" },
      bounty: { title: "Bounties completed", note: "Tracked separately from rewards received" },
      apparel: { title: "Apparel collected", note: "Items collected out of 43" },
      owned: { title: "Gear owned", note: "Check the event acquisition method" },
    },
    otherTabApplied: "The latest progress from another tab has been applied.",
    otherTabFailed: "Progress from another tab could not be read. This page has been kept as it was.",
    resetConfirm: "Reset all checkmarks and the apparel count for this event to zero?",
    resetNotice: "Progress for this event has been reset.",
    apparelError: "Enter a whole number from 0 to 43.",
    statsLabel: "My reward progress",
    progressLabel: title => `${title} progress`,
    browseRewards: "Browse rewards",
    categoriesLabel: "Reward categories",
    sidebarNote: "Check off rewards only after you receive them. Your checklist is saved in this browser only.",
    searchLabel: "Search rewards",
    searchPlaceholder: "Reward, target, or location name",
    filterLabel: "Show items",
    filterAll: "All items",
    filterUnchecked: "Unchecked only",
    filterChecked: "Checked only",
    visibleCount: count => `Checklist items shown: ${count}`,
    loading: "Loading saved progress",
    savingStopped: "Automatic saving stopped",
    saved: "Saved in this browser",
    savePrompt: "Check an item to save automatically",
    noScript: "You can read the reward information without JavaScript. Enable JavaScript to use the checklist and automatic saving.",
    accordionHelp: "Select a heading to expand or collapse it. Search and filter results expand automatically.",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    groupCount: (current, total) => `Checked ${current} / ${total}`,
    groupLink: "Link to this category ↗",
    apparelLabel: "Apparel items collected",
    apparelUnit: " / 43 items",
    checkLabel: (group, entry, check) => `${group} · ${entry} · ${check}`,
    completed: "Completed",
    owned: "Owned",
    received: "Received",
    unchecked: "Not checked",
    imageLabel: title => `View full image: ${title}`,
    enlarge: "Enlarge ↗",
    emptyTitle: "No rewards match these filters.",
    emptyHelp: "Try a different search, category, or item status.",
    showAll: "Show all rewards",
    privacyTitle: "Your progress stays in this browser",
    privacyHelp: "This tool is not connected to your game account. Checking an item does not claim a reward in the game. Clearing browser data may also remove your progress.",
    resetButton: "Reset event progress",
    dialogTitle: "Reward image",
    close: "Close ×",
    imageEvidence: "An image of the reward as shown in the game.",
    officialDetails: "Official reward details ↗",
    noticeDates: (published, checked) => `Published ${published} · Checked ${checked}`,
  },
};

export function getRewardCopy(language: Language) {
  return copy[language];
}
