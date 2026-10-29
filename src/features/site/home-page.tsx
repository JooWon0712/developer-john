import { HomeTerminal } from "@/components/home/home-terminal";
import type { Language } from "@/lib/i18n";
import styles from "@/app/home.module.css";
import { sitePageCopy } from "./copy";

export function HomePage({ language }: { language: Language }) {
  const text = sitePageCopy[language].home;
  return (
    <section className={styles.profile} aria-labelledby="home-title" lang={language}>
      <h1 id="home-title" className={styles.visuallyHidden}>{text.title}</h1>
      <HomeTerminal introduction={text.introduction} language={language} />
    </section>
  );
}
