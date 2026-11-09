import type { Metadata } from "next";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { pageMetadata, siteUrl } from "@/lib/site";
import { brooklynGuide, division2Paths, type Division2Language } from "../event-guides";
import styles from "../central-park/central-park.module.css";
import brooklynStyles from "./checklist.module.css";
import { BrooklynChecklist } from "./reward-checklist";
import { launchSource } from "./rewards";

const copy = {
  ko: {
    title: "디비전2 브루클린 전투 DLC 보상 체크리스트",
    subtitle: "DLC 보상 체크리스트",
    intro: "브루클린에서 얻을 수 있는 장비, 스킬, 헌터 마스크를 한곳에서 확인하고 획득한 보상을 체크하세요.",
    release: "DLC 출시일",
    releaseDate: "2025.05.27",
    parent: "디비전2",
    browse: "보상 살펴보기 ↓",
    shareNote: "링크에는 개인 체크 기록이 포함되지 않아요.",
    credits: "팬이 만든 비공식 가이드입니다. 게임 이미지와 상표의 권리는 각 권리자에게 있습니다.",
  },
  en: {
    title: "The Division 2: Battle for Brooklyn DLC Reward Checklist",
    subtitle: "DLC reward checklist",
    intro: "Find gear, skills and hidden Hunter masks across Brooklyn, then check off each reward as you earn it.",
    release: "DLC release date",
    releaseDate: "May 27, 2025",
    parent: "The Division 2",
    browse: "Browse rewards ↓",
    shareNote: "The link shares this guide. Your checks stay in your browser.",
    credits: "This is an unofficial fan guide. Game images and trademarks belong to their respective owners.",
  },
};

export function brooklynMetadata(language: Division2Language): Metadata {
  return pageMetadata(copy[language].title, brooklynGuide.description[language], brooklynGuide.paths[language]);
}

export function BrooklynPage({ language }: { language: Division2Language }) {
  const text = copy[language];
  const path = brooklynGuide.paths[language];

  return (
    <article className={`${styles.page} ${brooklynStyles.page}`} lang={language} aria-labelledby="brooklyn-title">
      <TerminalWindow title={path} bodyClassName={styles.session} parentLink={{ href: division2Paths[language], label: text.parent }}>
        <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}/{brooklynGuide.directory}$</span><code lang="en">cat rewards</code></p>
        <header className={`${styles.hero} ${brooklynStyles.hero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow} lang="en">THE DIVISION 2 · FIELD GUIDE</p>
            <h1 id="brooklyn-title">{brooklynGuide.title[language]}</h1>
            <p className={styles.subtitle}>{text.subtitle}</p>
            <p className={styles.intro}>{text.intro}</p>
            <div className={styles.links}>
              <a className={styles.primaryLink} href="#brooklyn-rewards">{text.browse}</a>
              <a href={launchSource.href} target="_blank" rel="noopener noreferrer">{launchSource.label[language]} ↗</a>
            </div>
            <SharePageButton url={new URL(path, siteUrl).href} language={language} description={text.shareNote} />
          </div>
          <div className={`${styles.releaseCard} ${brooklynStyles.releaseCard}`}>
            <svg className={`${styles.map} ${brooklynStyles.map}`} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M0 98H320M0 110H320M0 98l16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12 16 12 16-12" />
              <path d="M70 98V29H100V98M70 40H100M70 98l30-58M70 40l30 58M220 98V29H250V98M220 40H250M220 98l30-58M220 40l30 58M0 94Q44 79 70 33M100 33Q160 121 220 33M250 33Q276 79 320 94M120 57V98M140 71V98M160 77V98M180 71V98M200 57V98" />
            </svg>
            <div><p>{text.release}</p><time dateTime={brooklynGuide.releasedOn}>{text.releaseDate}</time></div>
          </div>
        </header>
        <BrooklynChecklist language={language} />
        <footer className={styles.credits}>{text.credits}</footer>
      </TerminalWindow>
    </article>
  );
}
