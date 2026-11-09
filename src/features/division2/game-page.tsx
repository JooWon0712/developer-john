import type { Metadata } from "next";
import Link from "next/link";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { localizePath } from "@/lib/i18n";
import { pageMetadata, siteUrl } from "@/lib/site";
import { division2EventGuides, division2Paths, type Division2Language } from "./event-guides";
import styles from "./division2.module.css";

const copy = {
  ko: {
    title: "디비전2",
    metadataTitle: "디비전2 본편·DLC·이벤트 보상 가이드",
    description: "디비전2의 본편, DLC, 이벤트별 보상과 획득 조건을 확인하고 수령 내역을 기록하세요.",
    heading: "보상 가이드", parent: "작업실",
    introduction: "본편, DLC, 이벤트의 보상과 획득 조건을 살펴보고 받은 보상을 기록하세요.",
    baseRelease: "본편 출시", dlcRelease: "DLC 출시", mainEvent: "메인 이벤트", count: (count: number) => `${count}개`,
    dates: "출시일과 메인 이벤트 기간은 공식 공지 기준입니다. 개별 보상의 기간과 조건은 각 가이드에서 확인하세요.",
  },
  en: {
    title: "The Division 2",
    metadataTitle: "The Division 2 Base Game, DLC & Event Reward Guides",
    description: "Explore rewards and requirements for The Division 2’s base game, expansions and events, and track what you have collected.",
    heading: "Reward guides", parent: "Workspace",
    introduction: "Find out how to earn rewards across the base game, DLC and events, and track what you have claimed.",
    baseRelease: "Base game release", dlcRelease: "DLC release", mainEvent: "Main event", count: (count: number) => `${count} ${count === 1 ? "guide" : "guides"}`,
    dates: "Release dates and main event periods follow official announcements. Check each guide for individual reward periods and requirements.",
  },
};

export function division2Metadata(language: Division2Language): Metadata {
  const text = copy[language];
  const metadata = pageMetadata(text.metadataTitle, text.description, division2Paths[language]);
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        ko: new URL(division2Paths.ko, siteUrl).href,
        en: new URL(division2Paths.en, siteUrl).href,
        "x-default": new URL(division2Paths.ko, siteUrl).href,
      },
    },
    openGraph: { ...metadata.openGraph, locale: language === "en" ? "en_US" : "ko_KR" },
  };
}

export function Division2Page({ language }: { language: Division2Language }) {
  const text = copy[language];
  return (
    <article className={styles.page} lang={language} aria-labelledby="division2-title">
      <TerminalWindow title={division2Paths[language]} bodyClassName={styles.session} parentLink={{ href: localizePath("/workspace", language), label: text.parent }}>
        <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}$</span><code lang="en">ls</code></p>
        <header className={styles.intro}>
          <h1 id="division2-title">{text.title}</h1>
          <p className="lead">{text.introduction}</p>
          <SharePageButton url={new URL(division2Paths[language], siteUrl).href} language={language} />
        </header>
        <section className={styles.guides} aria-labelledby="event-guides-title">
          <div className={styles.sectionHeading}><h2 id="event-guides-title">{text.heading}</h2><span>{text.count(division2EventGuides.length)}</span></div>
          <ul className={styles.guideList}>
            {division2EventGuides.map(guide => (
              <li key={guide.id}>
                <Link className={styles.guide} href={guide.paths[language]} aria-labelledby={`event-guide-${guide.id}-title`}>
                  <div>
                    <h3 id={`event-guide-${guide.id}-title`}><code className={styles.directory}>./{guide.directory}/</code><span className={styles.eventName}>{guide.title[language]}</span></h3>
                    <p className={styles.dates}>
                      {guide.kind === "event" ? (
                        <><span>{text.mainEvent}</span><time dateTime={guide.startsOn}>{guide.startsOn.replaceAll("-", ".")}</time><span aria-hidden="true">–</span><time dateTime={guide.endsOn}>{guide.endsOn.replaceAll("-", ".")}</time></>
                      ) : (
                        <><span>{guide.kind === "base" ? text.baseRelease : text.dlcRelease}</span><time dateTime={guide.releasedOn}>{guide.releasedOn.replaceAll("-", ".")}</time></>
                      )}
                    </p>
                    <p className={styles.description}>{guide.description[language]}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.dateNote}>{text.dates}</p>
        </section>
      </TerminalWindow>
    </article>
  );
}
