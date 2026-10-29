import Link from "next/link";
import Image from "next/image";
import { shell } from "@/data/shell";
import { sitePageCopy } from "@/features/site/copy";
import { localizePath, type Language } from "@/lib/i18n";
import { TerminalWindow } from "@/components/terminal-window";
import styles from "@/app/home.module.css";

export function HomeTerminal({ introduction, language = "ko" }: { introduction: string; language?: Language }) {
  const text = sitePageCopy[language].home;
  return (
    <TerminalWindow title={shell.home} bodyClassName={styles.terminalBody}>
        <p className={styles.commandLine}>
          <span className={styles.prompt} aria-hidden="true">{shell.user}:~$</span>
          <code className={styles.command} lang="en">whoami</code>
        </p>
        <div className={styles.artwork}>
          <Image
            className={styles.mascot}
            src="/characters/wombat-style-pixel-v2.png"
            alt={text.imageAlt}
            width={1536}
            height={1024}
            unoptimized
            loading="eager"
          />
        </div>
        <p className={styles.biography}>{introduction}</p>
        <Link className={styles.serviceLink} href={localizePath("/services", language)}>
          <span className={styles.serviceArrow} aria-hidden="true">→</span>
          <span>{text.browseServices}</span>
          <code className={styles.servicePath} aria-hidden="true">{shell.services}</code>
        </Link>
    </TerminalWindow>
  );
}
