import { Children, type ReactNode } from "react";
import styles from "./site-content.module.css";

type SiteContentProps = {
  children: ReactNode;
  leftRail?: ReactNode;
  rightRail?: ReactNode;
};

function hasContent(content: ReactNode): boolean {
  return Children.toArray(content).some(child => typeof child !== "string" || child.length > 0);
}

export function SiteContent({ children, leftRail, rightRail }: SiteContentProps) {
  return <div className={styles.layout}>
    {hasContent(leftRail) && <aside className={`${styles.rail} ${styles.leftRail}`}>{leftRail}</aside>}
    <main id="main-content" className={`container ${styles.content}`} tabIndex={-1} google-side-rail-overlap="false">{children}</main>
    {hasContent(rightRail) && <aside className={`${styles.rail} ${styles.rightRail}`}>{rightRail}</aside>}
  </div>;
}
