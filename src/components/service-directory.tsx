import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getLocalizedCategories, getLocalizedServices, type Service } from "@/data/catalog";
import { getBasePath, localizePath, type Language } from "@/lib/i18n";
import { shell } from "@/data/shell";

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

function ServiceCardContent({ service, displayPath, categoryLabel, plannedLabel }: { service: Service; displayPath: string; categoryLabel: string; plannedLabel: string }) {
  return <>
    <div className="service-row-heading">
      <h3 id={"service-" + service.id + "-title"}>
        <code className="service-directory-name" lang="en">{displayPath}</code>
        <span className="visually-hidden">{service.topic}</span>
        <span className="service-category">[{categoryLabel}]</span>
      </h3>
      {service.status === "planned" && <span className="badge">{plannedLabel}</span>}
    </div>
    <p><strong className="service-feature" id={"service-" + service.id + "-feature"}>{service.title}</strong>{service.description}</p>
  </>;
}

export function ServiceDirectory({ services, language = "ko" }: { services: Service[]; language?: Language }) {
  const text = copy[language];
  const categories = getLocalizedCategories(language);
  const localizedServices = getLocalizedServices(language, services);
  const categoryLabel = (service: Service) => categories.find(item => item.id === service.category)?.title ?? service.category;
  const displayPath = (service: Service) => {
    const path = service.status === "ready"
      ? getBasePath(service.href)
      : `${categories.find(item => item.id === service.category)?.pathPrefix ?? `/${service.category}`}/${service.directory}`;
    return path.replace(/^\/services\//, "/");
  };
  return (
    <>
      <p className="directory-command"><span aria-hidden="true">{shell.user}:~/services$</span><code lang="en">ls</code></p>
      <div id="service-results">
        {localizedServices.length === 0 ? (
          <div className="empty-state">
            <span className="empty-symbol" aria-hidden="true">+</span>
            <span className="badge">{text.planned}</span>
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyFirst}<br />{text.emptySecond}</p>
            <Link className="text-link" href={localizePath("/", language)}>
              {text.about} <ArrowRight width={18} height={18} aria-hidden="true" focusable="false" />
            </Link>
          </div>
        ) : (
          <div className="service-list">
            {localizedServices.map(service => service.status === "ready" ? (
              <Link
                className="service-row service-row-link"
                key={service.id}
                href={localizePath(service.href, language)}
                aria-labelledby={"service-" + service.id + "-title service-" + service.id + "-feature"}
              >
                <ServiceCardContent service={service} displayPath={displayPath(service)} categoryLabel={categoryLabel(service)} plannedLabel={text.planned} />
              </Link>
            ) : (
              <article className="service-row" key={service.id}>
                <ServiceCardContent service={service} displayPath={displayPath(service)} categoryLabel={categoryLabel(service)} plannedLabel={text.planned} />
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
