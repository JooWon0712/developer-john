import type { Metadata } from "next";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { pageMetadata, siteUrl } from "@/lib/site";
import { baseGameLaunchSource, baseGameSections } from "./base-game/rewards";
import styles from "./central-park/central-park.module.css";
import { baseGameGuide, division2Paths, warlordsGuide, type Division2Language } from "./event-guides";
import { RewardChecklist } from "./reward-checklist";
import { warlordsLaunchSource, warlordsSections } from "./warlords-of-new-york/rewards";

const guides = {
  [baseGameGuide.id]: { guide: baseGameGuide, source: baseGameLaunchSource, sections: baseGameSections },
  [warlordsGuide.id]: { guide: warlordsGuide, source: warlordsLaunchSource, sections: warlordsSections },
};

type GuideId = keyof typeof guides;

const copy = {
  ko: {
    parent: "디비전2",
    subtitle: { base: "본편 보상 체크리스트", dlc: "DLC 보상 체크리스트" },
    release: { base: "본편 출시일", dlc: "DLC 출시일" },
    browse: "보상 살펴보기 ↓",
    shareNote: "링크에는 개인 체크 기록이 포함되지 않아요.",
    credits: "팬이 만든 비공식 가이드입니다.",
  },
  en: {
    parent: "The Division 2",
    subtitle: { base: "Base game reward checklist", dlc: "DLC reward checklist" },
    release: { base: "Base game release date", dlc: "DLC release date" },
    browse: "Browse rewards ↓",
    shareNote: "The link shares this guide. Your checks stay in your browser.",
    credits: "This is an unofficial fan guide.",
  },
};

export function rewardGuideMetadata(guideId: GuideId, language: Division2Language): Metadata {
  const { guide } = guides[guideId];
  const title = language === "ko"
    ? `디비전2 ${guide.title.ko} 보상 체크리스트`
    : `The Division 2: ${guide.title.en} Reward Checklist`;
  return pageMetadata(title, guide.description[language], guide.paths[language]);
}

export function RewardGuidePage({ guideId, language }: { guideId: GuideId; language: Division2Language }) {
  const { guide, source, sections } = guides[guideId];
  const text = copy[language];
  const titleId = `${guideId}-title`;
  const path = guide.paths[language];

  return (
    <article className={styles.page} lang={language} aria-labelledby={titleId}>
      <TerminalWindow title={path} bodyClassName={styles.session} parentLink={{ href: division2Paths[language], label: text.parent }}>
        <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}/{guide.directory}$</span><code lang="en">cat rewards</code></p>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow} lang="en">THE DIVISION 2 · FIELD GUIDE</p>
            <h1 id={titleId}>{guide.title[language]}</h1>
            <p className={styles.subtitle}>{text.subtitle[guide.kind]}</p>
            <p className={styles.intro}>{guide.description[language]}</p>
            <div className={styles.links}>
              <a className={styles.primaryLink} href={`#${guideId}-rewards`}>{text.browse}</a>
              <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label[language]} ↗</a>
            </div>
            <SharePageButton url={new URL(path, siteUrl).href} language={language} description={text.shareNote} />
          </div>
          <div className={styles.releaseCard}>
            <div><p>{text.release[guide.kind]}</p><time dateTime={guide.releasedOn}>{guide.releasedOn.replaceAll("-", ".")}</time></div>
          </div>
        </header>
        <RewardChecklist key={guideId} collection={guideId} language={language} name={guide.title[language]} sections={sections} />
        <footer className={styles.credits}>{text.credits}</footer>
      </TerminalWindow>
    </article>
  );
}
