import type { Metadata } from "next";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { pageMetadata, siteUrl } from "@/lib/site";
import { event } from "./event";
import { division2Paths } from "../event-guides";
import { englishEventPath, getEventPath, type Language } from "./localization";
import { EventAvailability, RewardChecklist } from "./reward-checklist";
import styles from "./red-moon.module.css";

const pageText = {
  ko: {
    metadataTitle: "디비전2 레드 문 언리시드 보상",
    metadataDescription: "디비전2 레드 문 언리시드의 현상수배, 보스, 기부, Twitch 드롭스 보상을 확인하고 받은 보상을 기록하세요.",
    title: "레드 문 언리시드", subtitle: "받은 보상, 빠짐없이.", parent: "디비전2",
    intro: "현상수배부터 이벤트 외형까지, 받을 수 있는 보상을 한곳에서. 획득 조건을 살펴보고 실제로 받은 보상을 체크하세요.",
    browse: "보상 살펴보기 ↓", official: "Ubisoft 공식 안내 ↗", schedule: "EVENT SCHEDULE",
    shareNote: "내 체크 기록은 포함되지 않아요.",
    mainEvent: "메인 이벤트", drops: "Twitch 드롭스", mainFrom: "2026.10.15", mainTo: "11.03", dropsFrom: "2026.10.15", dropsTo: "10.22",
    dates: "공식 공지 날짜 기준 · 정확한 종료 시각은 미공지. 종료된 보상도 확인하고 수령 기록을 남길 수 있어요.",
    sourcesTitle: "정보 출처와 이용 안내",
    notes: [
      "보상 조건과 확률은 Ubisoft 공식 공지 기준이며, 한국어 이름·이미지는 한국어 게임 화면과 대조했습니다. 확인하지 못한 이름은 미확인으로 표시해요.",
      "현상수배 완료와 보상 수령은 별도예요. 주요 장비의 이벤트 획득 경로와 조건은 각 항목에서 확인할 수 있어요.",
      "의류 43종 수집과 완성 장식 수령을 따로 기록해요. 개별 의류 이름은 아직 대조하지 않아 수량으로 관리해요.",
      "개별 팔 휘장은 확률 보상이에요. 여섯 현상수배 처치 공훈과 개별 팔 휘장 여섯 종 수집은 서로 다른 조건이에요.",
      "기간 상태는 한국 날짜 기준으로 공지 일정을 비교해 표시하며, 정확한 시작·종료 시각을 보장하는 안내는 아니에요.",
      "체크 기록은 현재 브라우저 프로필에만 저장돼요. 다른 기기로 자동 동기화되지 않으며 게임 파일이나 계정에 접근하지 않아요.",
      "이 페이지는 팬이 만든 비공식 보상 가이드예요. 게임 이미지와 상표의 권리는 각 권리자에게 있습니다.",
    ],
    sourceNames: ["Ubisoft 공식 이벤트 안내", "Ubisoft 한국어 Twitch 드롭스 안내"],
    verified: "공식 정보 확인", screens: "한국어 명칭·보상 화면 대조",
  },
  en: {
    metadataTitle: "The Division 2: Red Moon Unleashed Rewards",
    metadataDescription: "Explore Red Moon Unleashed bounty, boss, donation and Twitch Drops rewards in The Division 2. Track claimed rewards in your browser.",
    title: "Red Moon Unleashed", subtitle: "Track every reward.", parent: "The Division 2",
    intro: "Bounties, boss drops and event cosmetics, all in one place. Review how to earn each item, then check it off only after claiming it.",
    browse: "Browse rewards ↓", official: "Official Ubisoft announcement ↗", schedule: "EVENT SCHEDULE",
    shareNote: "Your personal checklist is not included.",
    mainEvent: "Main event", drops: "Twitch Drops", mainFrom: "Oct 15, 2026", mainTo: "Nov 3", dropsFrom: "Oct 15, 2026", dropsTo: "Oct 22",
    dates: "Dates follow the official announcements; exact end times have not been announced. You can still review expired rewards and record claims.",
    sourcesTitle: "Sources and guide information",
    notes: [
      "Reward conditions and drop rates follow Ubisoft's official announcements. Korean names and images were checked against Korean in-game screens. Unverified names are marked as such.",
      "Bounty completion and reward claims are tracked separately. Each gear entry lists its event acquisition routes and conditions.",
      "Collecting all 43 apparel items and claiming the completion trophy are separate records. The full apparel item list has not been cross-checked, so collection is tracked by count.",
      "Individual arm patches are chance drops. The commendation for defeating all six bounty targets and collecting all six individual patches have different requirements.",
      "Period labels compare announcement dates using the date in South Korea (Asia/Seoul). They do not confirm exact start or end times.",
      "Progress is stored only in this browser profile. It is shared by both language versions, does not sync across devices, and never accesses your game files or account.",
      "This is an unofficial, fan-made reward guide. Game images and trademarks belong to their respective owners.",
    ],
    sourceNames: ["Official Ubisoft event announcement", "Official Ubisoft Twitch Drops announcement (Korean)"],
    verified: "Official information checked", screens: "Korean item names and reward screens checked",
  },
};

export function redMoonMetadata(language: Language): Metadata {
  const text = pageText[language];
  const metadata = pageMetadata(text.metadataTitle, text.metadataDescription, getEventPath(language));
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        ko: new URL(event.path, siteUrl).href,
        en: new URL(englishEventPath, siteUrl).href,
        "x-default": new URL(event.path, siteUrl).href,
      },
    },
    openGraph: { ...metadata.openGraph, locale: language === "en" ? "en_US" : "ko_KR" },
  };
}

export function RedMoonEventPage({ language }: { language: Language }) {
  const text = pageText[language];
  return <article className={styles.page} lang={language} aria-labelledby="red-moon-title">
    <TerminalWindow title={getEventPath(language)} bodyClassName={styles.session} parentLink={{ href: division2Paths[language], label: text.parent }}>
      <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}/{event.slug}$</span><code lang="en">cat rewards</code></p>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>THE DIVISION 2 · EVENT REWARDS</p>
          <EventAvailability language={language} />
          <h1 id="red-moon-title">{text.title}<span>{text.subtitle}</span></h1>
          <p className={styles.heroCopy}>{text.intro}</p>
          <div className={styles.heroLinks}><a href="#reward-results">{text.browse}</a><a href={event.sources[0].url} target="_blank" rel="noopener noreferrer">{text.official}</a></div>
          <SharePageButton url={new URL(getEventPath(language), siteUrl).href} language={language} description={text.shareNote} />
        </div>
        <div className={styles.schedule}>
          <p className={styles.scheduleTitle}>{text.schedule}</p>
          <dl><dt>{text.mainEvent}</dt><dd><time dateTime={event.startsOn}>{text.mainFrom}</time> — <time dateTime={event.endsOn}>{text.mainTo}</time></dd><dt>{text.drops}</dt><dd><time dateTime={event.dropsStartsOn}>{text.dropsFrom}</time> — <time dateTime={event.dropsEndsOn}>{text.dropsTo}</time></dd></dl>
          <p className={styles.dateNote}>{text.dates}</p>
        </div>
      </header>
      <RewardChecklist language={language} />
      <footer className={styles.sources}>
        <details><summary>{text.sourcesTitle}</summary><ul>{text.notes.map(note => <li key={note}>{note}</li>)}</ul>
          <ul>{event.sources.map((source, index) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{text.sourceNames[index]} ↗</a></li>)}</ul>
        </details>
        <p>{text.verified} {event.verifiedAt} · {text.screens} 2026-10-29 · developer-john</p>
      </footer>
    </TerminalWindow>
  </article>;
}
