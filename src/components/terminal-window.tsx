import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "./icons";
import styles from "./terminal-window.module.css";

type ParentLink = { href: string; label: string; command: string };

export function TerminalWindow({ title, children, bodyClassName, parentLink }: { title: string; children: ReactNode; bodyClassName?: string; parentLink?: ParentLink }) {
  return <div className={styles.window}>
    <div className={styles.bar} aria-hidden="true">
      <span className={styles.dots}><i /><i /><i /></span>
      <span className={styles.title}>{title}</span>
      <span className={styles.label}>terminal</span>
    </div>
    <div className={bodyClassName}>
      {parentLink && <Link className={styles.parentLink} href={parentLink.href} aria-label={parentLink.label}>
        <ArrowRight width={16} height={16} />
        <code aria-hidden="true" lang="en">{parentLink.command}</code>
        <span>[{parentLink.label}]</span>
      </Link>}
      {children}
    </div>
  </div>;
}
