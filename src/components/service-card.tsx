import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getLocalizedCategories, getLocalizedServices, type Service } from "@/data/catalog";
import { localizePath, type Language } from "@/lib/i18n";
import styles from "./service-card.module.css";

export function ServiceCard({ service, language }: { service: Service; language: Language }) {
  const entry = getLocalizedServices(language, [service])[0];
  const category = getLocalizedCategories(language).find(item => item.id === entry.category);
  const english = language === "en";
  const content = <>
    <div className={styles.content}>
      <span className={styles.category}>[ {category?.title ?? entry.category} ]</span>
      <h3>{entry.topic}</h3>
      <p className={styles.feature}>{entry.title}</p>
      <p className={styles.description}>{entry.description}</p>
      {entry.id === "the-division-2" && <small>{english ? "No account needed · Progress saved in your browser" : "로그인 없이 이용 · 기록은 내 브라우저에 저장"}</small>}
    </div>
    <span className={styles.action}>{entry.status === "ready" ? <ArrowRight width={22} height={22} /> : english ? "Coming soon" : "준비 중"}</span>
  </>;
  return entry.status === "ready"
    ? <Link className={styles.card} href={localizePath(entry.href, language)}>{content}</Link>
    : <article className={styles.card}>{content}</article>;
}
