import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "./icons";
import styles from "./terminal-window.module.css";

type ParentLink = { href: string; label: string };

export function TerminalWindow({ title, titleLang = "en", children, bodyClassName, parentLink }: { title: string; titleLang?: "ko" | "en"; children: ReactNode; bodyClassName?: string; parentLink?: ParentLink }) {
  return <div className={styles.window}>
    <div className={`${styles.bar}${parentLink ? ` ${styles.navigationBar}` : ""}`}>
      <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
      <span className={styles.title} lang={titleLang} title={title}>{title}</span>
      {parentLink && <Link className={styles.parentLink} href={parentLink.href} title={parentLink.href}>
        <ArrowRight width={16} height={16} />
        <span>{parentLink.label}</span>
      </Link>}
    </div>
    <div className={bodyClassName}>
      {children}
    </div>
  </div>;
}
