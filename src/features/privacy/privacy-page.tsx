import { TerminalWindow } from "@/components/terminal-window";
import { contact } from "@/data/contact";
import { shell } from "@/data/shell";
import { localizePath, type Language } from "@/lib/i18n";
import { privacyCopy, privacyWrittenDate } from "./copy";
import styles from "./privacy.module.css";

export function PrivacyPage({ language }: { language: Language }) {
  const text = privacyCopy[language];

  return <article className={styles.page} lang={language} aria-labelledby="privacy-title">
    <TerminalWindow title={localizePath(shell.privacy, language)} bodyClassName={styles.session} parentLink={{ href: localizePath("/", language), label: text.home }}>
      <p className={styles.command} lang="en"><span>{shell.user}:~/privacy$</span> <code>cat privacy.md</code></p>
      <header className={styles.heading}>
        <p className={styles.written}>{text.dateLabel} <time dateTime={privacyWrittenDate}>{privacyWrittenDate}</time></p>
        <h1 id="privacy-title">{text.title}</h1>
        <p>{text.introduction}</p>
      </header>

      <nav className={styles.contents} aria-label={text.contents}>
        {text.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}
        </a>)}
        <a href="#privacy-contact"><span aria-hidden="true">06</span>{text.contact}</a>
      </nav>

      <div className={styles.document}>
        {text.sections.map((section, index) => <section className={styles.section} id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.details && <dl className={styles.details}>
            {section.details.map(detail => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}
          </dl>}
          {section.links && <ul className={styles.links}>
            {section.links.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
          </ul>}
        </section>)}

        <section className={styles.section} id="privacy-contact" aria-labelledby="privacy-contact-title">
          <h2 id="privacy-contact-title"><span aria-hidden="true">06</span>{text.contact}</h2>
          <p>{text.contactText}</p>
          {contact.email && <a className={styles.email} href={`mailto:${contact.email}`}>{contact.email}</a>}
        </section>
      </div>
    </TerminalWindow>
  </article>;
}
