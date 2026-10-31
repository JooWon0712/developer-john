import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import type { Service } from "@/data/catalog";
import { localizePath, type Language } from "@/lib/i18n";
import { shell } from "@/data/shell";
import { ServiceCard } from "./service-card";

const copy = {
  ko: {
    planned: "준비 중",
    emptyTitle: "서비스를 준비하고 있습니다.",
    emptyFirst: "알아두면 좋은 정보를 모으는 작은 서비스부터 시작합니다.",
    emptySecond: "서비스가 완성되면 이곳에서 바로 만나볼 수 있습니다.",
    about: "만드는 사람 소개",
  },
  en: {
    planned: "Coming soon",
    emptyTitle: "Services are coming soon.",
    emptyFirst: "Small services that bring useful information together are on the way.",
    emptySecond: "They will be available here when they are ready.",
    about: "Meet the developer",
  },
};

export function ServiceDirectory({ services, language = "ko" }: { services: Service[]; language?: Language }) {
  const text = copy[language];
  return (
    <>
      <p className="directory-command"><span aria-hidden="true">{shell.user}:~/services$</span><code lang="en">ls</code></p>
      <div id="service-results">
        {services.length === 0 ? (
          <div className="empty-state">
            <span className="empty-symbol" aria-hidden="true">+</span>
            <span className="badge">{text.planned}</span>
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyFirst}<br />{text.emptySecond}</p>
            <Link className="text-link" href={localizePath("/about", language)}>
              {text.about} <ArrowRight width={18} height={18} aria-hidden="true" focusable="false" />
            </Link>
          </div>
        ) : (
          <div className="service-list">
            {services.map(service => <ServiceCard key={service.id} service={service} language={language} />)}
          </div>
        )}
      </div>
    </>
  );
}
