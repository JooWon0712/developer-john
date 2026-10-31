import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { TerminalWindow } from "@/components/terminal-window";
import { contact } from "@/data/contact";
import { localizePath, type Language } from "@/lib/i18n";
import { aboutCopy } from "./about-copy";
import styles from "./about.module.css";

export function AboutPage({ language }: { language: Language }) {
  const text = aboutCopy[language];

  return (
    <article className={styles.page} lang={language} aria-labelledby="about-title">
      <div className={styles.content}>
        <header>
          <p className={styles.eyebrow} lang="en">ABOUT JOHN</p>
          <h1 id="about-title" className={styles.headline}>{text.headline}</h1>
          <p className={styles.summary}>{text.summary}</p>
        </header>
        <Link className={styles.serviceLink} href={localizePath("/services", language)}>
          {text.browseServices}<ArrowRight width={18} height={18} />
        </Link>

        <div className={styles.approach}>
          <p>{text.approach}</p>
        </div>

        <ul className={styles.topics} aria-label={text.interestsLabel}>
          {text.interests.map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
        {contact.email && (
          <a className={styles.contactLink} href={`mailto:${contact.email}`}>
            <span>{text.contactLabel}</span>
            <span className={styles.emailAddress}>{contact.email}</span>
            <ArrowRight width={18} height={18} />
          </a>
        )}
      </div>

      <figure className={styles.photo}>
        <TerminalWindow title={text.photoLabel} titleLang={language}>
          <Image
            className={styles.image}
            src="/images/home/harbor-cafe-cozy-pixel.webp"
            alt={text.imageAlt}
            width={1536}
            height={1024}
            loading="eager"
            unoptimized
          />
        </TerminalWindow>
      </figure>
    </article>
  );
}
