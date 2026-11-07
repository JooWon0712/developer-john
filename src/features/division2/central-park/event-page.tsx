import type { Metadata } from "next";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { pageMetadata, siteUrl } from "@/lib/site";
import { centralParkGuide, division2Paths, type Division2Language } from "../event-guides";
import { collectiblesId } from "./collectibles";
import { launchSource } from "./rewards";
import { CentralParkChecklist } from "./reward-checklist";
import styles from "./central-park.module.css";

const copy = {
  ko: {
    title: "디비전2 센트럴 파크의 메아리 DLC 보상",
    subtitle: "DLC 보상 가이드",
    intro: "장비와 스킬, 숨겨진 헌터 마스크부터 출시 특전까지. 획득 조건을 확인하고 실제로 받은 보상을 기록하세요.",
    release: "DLC 출시일",
    releaseDate: "2026.11.03",
    parent: "디비전2",
    browse: "보상 살펴보기 ↓",
    browseCollectibles: "수집품 살펴보기 ↓",
    shareNote: "링크에는 개인 체크 기록이 포함되지 않아요.",
    credits: "팬이 만든 비공식 가이드입니다. 게임 이미지와 상표의 권리는 각 권리자에게 있습니다.",
  },
  en: {
    title: "The Division 2: Echoes of Central Park DLC Rewards",
    subtitle: "DLC reward guide",
    intro: "Find gear, skills, hidden Hunter masks and launch extras. Check how to earn each reward and record what you have collected.",
    release: "DLC release date",
    releaseDate: "Nov 3, 2026",
    parent: "The Division 2",
    browse: "Browse rewards ↓",
    browseCollectibles: "Browse collectibles ↓",
    shareNote: "The link only shares this guide. Your checks stay in your browser.",
    credits: "This is an unofficial fan guide. Game images and trademarks belong to their respective owners.",
  },
};

export function centralParkMetadata(language: Division2Language): Metadata {
  return pageMetadata(copy[language].title, centralParkGuide.description[language], centralParkGuide.paths[language]);
}

export function CentralParkPage({ language }: { language: Division2Language }) {
  const text = copy[language];
  const path = centralParkGuide.paths[language];
  return (
    <article className={styles.page} lang={language} aria-labelledby="central-park-title">
      <TerminalWindow title={path} bodyClassName={styles.session} parentLink={{ href: division2Paths[language], label: text.parent }}>
        <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}/{centralParkGuide.directory}$</span><code lang="en">cat rewards</code></p>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow} lang="en">THE DIVISION 2 · FIELD GUIDE</p>
            <h1 id="central-park-title">{centralParkGuide.title[language]}</h1>
            <p className={styles.subtitle}>{text.subtitle}</p>
            <p className={styles.intro}>{text.intro}</p>
            <div className={styles.links}>
              <a className={styles.primaryLink} href="#central-park-rewards">{text.browse}</a>
              <a href={`#${collectiblesId}`}>{text.browseCollectibles}</a>
              <a href={launchSource.href} target="_blank" rel="noopener noreferrer">{launchSource.label[language]} ↗</a>
            </div>
            <SharePageButton url={new URL(path, siteUrl).href} language={language} description={text.shareNote} />
          </div>
          <div className={styles.releaseCard}>
            <svg className={styles.map} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor">
              <path d="M-15 153C44 73 108 168 171 107S270 96 342 22M-15 174C52 99 115 191 180 126S279 117 342 45M-15 130C51 52 103 146 159 85S267 78 342 0M-15 106C39 28 94 126 151 65S266 56 313-19" />
              <circle cx="240" cy="80" r="43" /><circle cx="240" cy="80" r="60" strokeDasharray="3 7" />
              <path d="M240 14v23m0 86v23m-66-66h23m86 0h23m-78 0 12-17 12 17-12 17Z" />
            </svg>
            <div><p>{text.release}</p><time dateTime={centralParkGuide.releasedOn}>{text.releaseDate}</time></div>
          </div>
        </header>
        <CentralParkChecklist language={language} />
        <footer className={styles.credits}>{text.credits}</footer>
      </TerminalWindow>
    </article>
  );
}
