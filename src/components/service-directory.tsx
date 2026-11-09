import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getLocalizedCategories, type Service } from "@/data/catalog";
import { localizePath, type Language } from "@/lib/i18n";
import { shell } from "@/data/shell";
import { ServiceCard } from "./service-card";

const copy = {
  ko: {
    planned: "준비 중",
    emptyTitle: "작업실을 채워가고 있습니다.",
    emptyFirst: "일상의 필요에서 시작한 프로그램과 웹서비스를 만듭니다.",
    emptySecond: "완성한 작업은 이곳에서 만나볼 수 있습니다.",
    about: "만드는 사람 소개",
  },
  en: {
    planned: "Coming soon",
    emptyTitle: "The workspace is taking shape.",
    emptyFirst: "Programs and web services inspired by everyday needs are on the way.",
    emptySecond: "They will be available here when they are ready.",
    about: "Meet the developer",
  },
};

export function ServiceDirectory({ services, language = "ko" }: { services: Service[]; language?: Language }) {
  const text = copy[language];
  const categories = getLocalizedCategories(language);
  const groups = Map.groupBy(services, service => service.category);
  return (
    <>
      <p className="directory-command"><span aria-hidden="true">{shell.user}:~/workspace$</span><code lang="en">ls</code></p>
      <div id="service-results">
        {services.length === 0 ? (
          <div className="empty-state">
            <span className="empty-symbol" aria-hidden="true">+</span>
            <span className="badge">{text.planned}</span>
            <h2>{text.emptyTitle}</h2>
            <p>{text.emptyFirst}<br />{text.emptySecond}</p>
            <Link className="text-link" href={localizePath("/about", language)}>
              {text.about} <ArrowRight width={18} height={18} aria-hidden="true" focusable="false" />
            </Link>
          </div>
        ) : (
          Array.from(groups, ([categoryId, entries]) => {
            const headingId = `service-category-${categoryId}`;
            const title = categories.find(category => category.id === categoryId)?.title ?? categoryId;
            return (
              <section key={categoryId} className="service-group" aria-labelledby={headingId}>
                <div className="service-group-heading">
                  <h2 id={headingId}>{title}</h2>
                  <span>{language === "ko" ? `${entries.length}개` : `${entries.length} ${entries.length === 1 ? "item" : "items"}`}</span>
                </div>
                <ul className="service-list" role="list">
                  {entries.map(service => (
                    <li key={service.id}><ServiceCard service={service} language={language} /></li>
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
