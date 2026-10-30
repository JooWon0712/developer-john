import type { Metadata } from "next";
import Link from "next/link";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { localizePath } from "@/lib/i18n";
import { pageMetadata, siteUrl } from "@/lib/site";
import { division2EventGuides, division2Paths, type Division2Language } from "./event-guides";
import styles from "./division2.module.css";

const copy = {
  ko: {
    title: "디비전2",
    metadataTitle: "디비전2 이벤트·보상 정보",
    description: "디비전2의 이벤트 일정과 보상, 획득 조건을 한곳에서 확인하세요. 이벤트별 가이드에서 받은 보상을 기록할 수 있습니다.",
    heading: "이벤트 가이드", parent: "서비스 목록",
    introduction: "이벤트 일정과 보상, 획득 조건을 한곳에 모읍니다. 이벤트를 골라 받을 수 있는 보상을 살펴보고, 받은 보상을 기록하세요.",
    mainEvent: "메인 이벤트", count: (count: number) => `${count}개`,
    dates: "날짜는 공식 공지의 메인 이벤트 기간입니다. 개별 보상의 지급 기간과 조건은 각 가이드에서 확인하세요.",
  },
  en: {
    title: "The Division 2",
    metadataTitle: "The Division 2 Events & Rewards",
    description: "Explore The Division 2 event schedules, rewards and requirements. Open an event guide to track the rewards you have claimed.",
    heading: "Event guides", parent: "Services",
    introduction: "Event schedules, rewards and requirements in one place. Choose an event to explore its rewards and track the items you have claimed.",
    mainEvent: "Main event", count: (count: number) => `${count} ${count === 1 ? "guide" : "guides"}`,
    dates: "Dates show the announced main event period. Check each guide for individual reward periods and requirements.",
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
      <TerminalWindow title={division2Paths[language]} bodyClassName={styles.session} parentLink={{ href: localizePath("/services", language), label: text.parent }}>
        <p className={styles.command} aria-hidden="true"><span>{shell.user}:~{shell.division2}$</span><code lang="en">ls</code></p>
        <header className={styles.intro}>
          <h1 id="division2-title">{text.title}</h1>
          <p className="lead">{text.introduction}</p>
        </header>
        <section className={styles.guides} aria-labelledby="event-guides-title">
          <div className={styles.sectionHeading}><h2 id="event-guides-title">{text.heading}</h2><span>{text.count(division2EventGuides.length)}</span></div>
          <ul className={styles.guideList}>
            {division2EventGuides.map(guide => (
              <li key={guide.id}>
                <Link className={styles.guide} href={guide.paths[language]} aria-labelledby={`event-guide-${guide.id}-title`}>
                  <div>
                    <h3 id={`event-guide-${guide.id}-title`}><code className={styles.directory}>./{guide.directory}/</code><span className={styles.eventName}>{guide.title[language]}</span></h3>
                    <p className={styles.dates}><span>{text.mainEvent}</span><time dateTime={guide.startsOn}>{guide.startsOn.replaceAll("-", ".")}</time><span aria-hidden="true">–</span><time dateTime={guide.endsOn}>{guide.endsOn.replaceAll("-", ".")}</time></p>
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
