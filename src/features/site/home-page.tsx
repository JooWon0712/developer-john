import { HomeTerminal } from "@/components/home/home-terminal";
import type { Language } from "@/lib/i18n";
import styles from "@/app/home.module.css";

export function HomePage({ language }: { language: Language }) {
  return (
    <section className={styles.profile} aria-labelledby="home-title" lang={language}>
      <HomeTerminal language={language} />
    </section>
  );
}
