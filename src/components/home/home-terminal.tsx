import Link from "next/link";
import { ThemedImage } from "@/components/themed-image";
import { shell } from "@/data/shell";
import { sitePageCopy } from "@/features/site/copy";
import { localizePath, type Language } from "@/lib/i18n";
import { TerminalWindow } from "@/components/terminal-window";
import { ArrowRight } from "@/components/icons";
import styles from "@/app/home.module.css";

export function HomeTerminal({ language = "ko" }: { language?: Language }) {
  const text = sitePageCopy[language].home;
  const workspacePath = localizePath(shell.workspace, language);
  const aboutPath = localizePath("/about", language);
  return (
    <TerminalWindow title="/" bodyClassName={styles.session}>
      <p className={styles.command}><span aria-hidden="true">{shell.user}:~$</span><code lang="en">whoami</code></p>
      <div className={styles.scene}>
        <ThemedImage
          className={styles.sceneImage}
          lightSrc="/images/home/harbor-cafe-cozy-pixel-light-clean-v1.webp"
          darkSrc="/images/home/harbor-cafe-cozy-pixel-night-desk-sleep-v1.webp"
          lightAlt={text.sceneAlt}
          darkAlt={text.sceneAltDark}
          width={1536}
          height={1024}
          loading="eager"
          fetchPriority="high"
          unoptimized
        />
        <section id="about" className={styles.about} aria-label={text.title} tabIndex={-1}>
          <h1 id="home-title" className={styles.headline}>{text.headline}</h1>
          <p className={styles.biography}>{text.introduction}</p>
          <div className={styles.actions}>
            <Link className="button" href={workspacePath}>{text.browseServices}<ArrowRight width={17} height={17} /></Link>
            <Link className={`button ${styles.secondary}`} href={aboutPath}>{text.about}<ArrowRight width={17} height={17} /></Link>
          </div>
        </section>
      </div>
    </TerminalWindow>
  );
}
