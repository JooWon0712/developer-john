import Link from "next/link";
import { shell } from "@/data/shell";
import { contact } from "@/data/contact";
import { sitePageCopy } from "@/features/site/copy";
import { localizePath, type Language } from "@/lib/i18n";
import { TerminalWindow } from "@/components/terminal-window";
import styles from "@/app/home.module.css";

export function HomeTerminal({ introduction, language = "ko" }: { introduction: string; language?: Language }) {
  const text = sitePageCopy[language].home;
  const homePath = localizePath(shell.home, language);
  const servicesPath = localizePath(shell.services, language);
  return (
    <div className={styles.layeredWindows}>
      <section id="about" className={styles.aboutWindow} aria-label={text.title} tabIndex={-1}>
        <TerminalWindow title="about" bodyClassName={styles.aboutBody}>
          <p className={styles.biography}>{introduction}</p>
          {contact.email && <a className={`${styles.commandLink} ${styles.contactLink}`} href={`mailto:${contact.email}`} aria-label={`contact ${shell.user}: ${text.contactLabel}`}>
            <span className={styles.bracket} aria-hidden="true">[</span>
            <code lang="en">contact {shell.user}</code>
            <span className={styles.bracket} aria-hidden="true">]</span>
          </a>}
        </TerminalWindow>
      </section>

      <Link className={styles.serviceWindow} href={servicesPath} aria-label={`${text.browseServices}: ${servicesPath}`}>
        <TerminalWindow title={homePath} bodyClassName={styles.serviceBody}>
          <code className={styles.servicePath} lang="en">{servicesPath}</code>
          <span className={styles.serviceLabel}>{text.browseServices}</span>
          <span className={styles.serviceRule} aria-hidden="true"><i /></span>
        </TerminalWindow>
      </Link>

      <div className={styles.directoryWindow}>
        <TerminalWindow title="site map" bodyClassName={styles.directoryBody}>
          <nav aria-label={text.directory.label}>
            <div className={styles.treeTopline} aria-hidden="true">
              <span lang="en">SITE DIRECTORY</span><span>⌘</span>
            </div>
            <div className={styles.treeMap}>
              <div className={styles.treeRoot}>
                <span className={styles.treeRootIcon} aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h7l2 3h9v11H3V6Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <span>{homePath}</span><small lang="en">{shell.user}’s space</small>
              </div>
              <ul className={styles.treeBranches}>
                <li>
                  <a className={styles.treeNode} href="#about" aria-label={`about: ${text.title}`}>
                    <span className={styles.treeBranch} aria-hidden="true">├──</span><span className={styles.treeFileIcon} aria-hidden="true">≡</span>
                    <span className={styles.treeName} lang="en">about</span><small>{text.title}</small>
                  </a>
                </li>
                <li>
                  <Link className={styles.treeNode} href={localizePath(shell.privacy, language)} aria-label={`privacy: ${text.directory.privacy}`}>
                    <span className={styles.treeBranch} aria-hidden="true">├──</span><span className={styles.treeFileIcon} aria-hidden="true">≡</span>
                    <span className={styles.treeName} lang="en">privacy</span><small>{text.directory.privacy}</small>
                  </Link>
                </li>
                <li>
                  <Link className={`${styles.treeNode} ${styles.treeSelected}`} href={servicesPath} aria-label={`services/: ${text.directory.services}`}>
                    <span className={styles.treeBranch} aria-hidden="true">└──</span><span className={styles.treeFolderIcon} aria-hidden="true" />
                    <span className={styles.treeName} lang="en">services/</span><small>{text.directory.services}</small>
                  </Link>
                </li>
              </ul>
            </div>
            <p className={styles.treeCaption}><span aria-hidden="true">└─</span>{text.directory.caption}</p>
          </nav>
        </TerminalWindow>
      </div>
    </div>
  );
}
