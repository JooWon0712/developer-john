import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { shell } from "@/data/shell";
import { localizePath, type Language } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import { getDesktopTool, type DesktopToolId } from "./tools";
import styles from "./tool-page.module.css";

const labels = {
  ko: {
    category: "PC 도구 · Windows 앱",
    parent: "작업실",
    story: "필요해서 만들고, 직접 쓰고 있습니다.",
    screenshots: "실행 화면",
    screenshotInfo: "개인 환경 정보는 예시 값으로 바꾼 화면입니다.",
    openScreenshot: "크게 보기 (새 탭)",
    features: "이렇게 사용합니다",
    requirements: "사용 환경",
    steps: "시작하는 방법",
    notes: "사용 전 참고",
    download: "GitHub에서 다운로드",
    builds: "GitHub 빌드 확인",
    repository: "소스 코드",
    issues: "문제 제보",
    releaseInfo: "릴리스 페이지에서 Windows용 파일과 사용 안내를 확인할 수 있습니다.",
    buildInfo: "GitHub Actions의 성공한 빌드에서 Windows ZIP을 받을 수 있습니다. 파일을 받으려면 GitHub 로그인이 필요합니다.",
  },
  en: {
    category: "PC tools · Windows app",
    parent: "Workspace",
    story: "Built for a need. Part of my everyday life.",
    screenshots: "App screenshots",
    screenshotInfo: "Personal environment details have been replaced with example values.",
    openScreenshot: "View full size (new tab)",
    features: "What it does",
    requirements: "Requirements",
    steps: "Getting started",
    notes: "Before you use it",
    download: "Download on GitHub",
    builds: "View GitHub builds",
    repository: "Source code",
    issues: "Report an issue",
    releaseInfo: "Find the Windows files and setup instructions on the releases page.",
    buildInfo: "Get the Windows ZIP from a successful GitHub Actions build. A GitHub sign-in is required to download the files.",
  },
};

export function DesktopToolPage({ id, language }: { id: DesktopToolId; language: Language }) {
  const tool = getDesktopTool(id);
  const text = tool.copy[language];
  const ui = labels[language];
  const path = localizePath(tool.path, language);
  const hasRelease = tool.distribution.kind === "releases";

  return <article className={styles.page} lang={language} aria-labelledby="tool-title">
    <TerminalWindow title={path} bodyClassName={styles.body} parentLink={{ href: localizePath("/workspace", language), label: ui.parent }}>
      <p className="directory-command"><span aria-hidden="true">{shell.user}:~{tool.path}$</span><code lang="en">cat README</code></p>

      <header className={styles.header}>
        <p className={styles.eyebrow}>{ui.category}</p>
        <h1 id="tool-title">{text.name}</h1>
        <p className={styles.tagline}>{text.tagline}</p>
      </header>

      <div className={styles.overview}>
        <section className={styles.story} aria-labelledby="tool-story">
          <h2 id="tool-story">{ui.story}</h2>
          <p>{text.story}</p>
          <div className={styles.links}>
            <a className="button" href={tool.distribution.url}>{hasRelease ? ui.download : ui.builds}<ArrowRight width={18} height={18} aria-hidden="true" /></a>
            <a className="text-link" href={tool.repositoryUrl}>{ui.repository}<ArrowRight width={16} height={16} aria-hidden="true" /></a>
          </div>
          <p className={styles.releaseInfo}>{hasRelease ? ui.releaseInfo : ui.buildInfo}</p>
        </section>
        <aside className={styles.requirements} aria-labelledby="tool-requirements">
          <h2 id="tool-requirements">{ui.requirements}</h2>
          <ul>{text.requirements.map(item => <li key={item}>{item}</li>)}</ul>
        </aside>
      </div>

      <section className={styles.section} aria-labelledby="tool-screenshots">
        <h2 id="tool-screenshots">{ui.screenshots}</h2>
        <p className={styles.screenshotInfo}>{tool.screenshotInfo?.[language] ?? ui.screenshotInfo}</p>
        <div className={styles.screenshots}>{tool.screenshots.map(screenshot => <figure className={styles.screenshot} key={screenshot.src}>
          <a className={styles.screenshotLink} href={screenshot.src} target="_blank" rel="noopener noreferrer" aria-label={`${screenshot.caption[language]} — ${ui.openScreenshot}`}>
            <Image
              className={styles.screenshotImage}
              src={screenshot.src}
              alt={screenshot.alt[language]}
              width={screenshot.width}
              height={screenshot.height}
              sizes="(max-width: 760px) calc(100vw - 104px), (max-width: 1184px) calc((100vw - 154px) / 2), 514px"
            />
            <span className={styles.screenshotAction}>{ui.openScreenshot}<span aria-hidden="true"> ↗</span></span>
          </a>
          <figcaption>{screenshot.caption[language]}</figcaption>
        </figure>)}</div>
      </section>

      <section className={styles.section} aria-labelledby="tool-features">
        <h2 id="tool-features">{ui.features}</h2>
        <div className={styles.features}>{text.features.map((feature, index) => <div className={styles.feature} key={feature.title}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>)}</div>
      </section>

      <section className={styles.section} aria-labelledby="tool-steps">
        <h2 id="tool-steps">{ui.steps}</h2>
        <ol className={styles.steps}>{text.steps.map(step => <li key={step}>{step}</li>)}</ol>
      </section>

      <section className={`${styles.section} ${styles.notes}`} aria-labelledby="tool-notes">
        <h2 id="tool-notes">{ui.notes}</h2>
        <ul>{text.notes.map(note => <li key={note}>{note}</li>)}</ul>
        <a className="text-link" href={`${tool.repositoryUrl}/issues`}>{ui.issues}<ArrowRight width={16} height={16} aria-hidden="true" /></a>
      </section>

      <SharePageButton url={new URL(path, siteUrl).href} language={language} />
    </TerminalWindow>
  </article>;
}
