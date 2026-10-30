import { HomeTerminal } from "@/components/home/home-terminal";
import type { Language } from "@/lib/i18n";
import styles from "@/app/home.module.css";
import { sitePageCopy } from "./copy";

export function HomePage({ language }: { language: Language }) {
  const text = sitePageCopy[language].home;
  return (
    <section className={styles.profile} aria-labelledby="home-title" lang={language}>
      <div className={styles.heading}>
        <p className={styles.eyebrow} lang="en">A SMALL PLACE FOR IDEAS</p>
        <h1 id="home-title">{text.headline}</h1>
      </div>
      <HomeTerminal introduction={text.introduction} language={language} />
    </section>
  );
}
