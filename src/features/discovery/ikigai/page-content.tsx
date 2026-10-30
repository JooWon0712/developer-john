import Link from "next/link";
import { shell } from "@/data/shell";
import { localizePath, type Language } from "@/lib/i18n";
import { IkigaiWizard } from "./wizard";
import { ikigaiText } from "./translations";
import styles from "./ikigai.module.css";

export function IkigaiPageContent({ language = "ko" }: { language?: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  return <div className={styles.page}>
    <Link href={localizePath("/services", language)} className={`text-link ${styles.breadcrumb}`}>← {localizePath(shell.services, language)}</Link>
    <section className={styles.intro} aria-labelledby="ikigai-title">
      <p className={styles.kicker} aria-hidden="true">$ explore ./ikigai</p>
      <h1 id="ikigai-title">{t("좋아하는 일,", "Find what you enjoy,")}<br />{t("작게 해보면서 찾기.", "one small step at a time.")}</h1>
      <p className="lead">{t("좋아하는 것과 해본 일, 돕고 싶은 문제를 천천히 돌아보세요.", "Reflect on what you enjoy, what you have tried, and the problems you want to help with.")}<br />{t("이번 주에 해볼 세 가지 활동과 작은 실험을 함께 찾아드려요.", "Explore three activities and small experiments to try this week.")}</p>
      <p className={styles.footnote}>{t("이키가이의 네 질문을 참고한 자기 탐색 워크시트예요. 결과는 선택한 답변에 따른 활동 제안입니다.", "A self-exploration worksheet inspired by four questions associated with ikigai. The results are activity suggestions based on your choices.")}</p>
      <ul className={styles.introMeta}><li>{t("약 5~10분", "About 5–10 minutes")}</li><li>{t("모르는 질문은 건너뛰기", "Skip anything you don't know")}</li><li>{t("회원가입 없이 브라우저에 저장", "Saved in your browser, no account needed")}</li></ul>
    </section>
    <IkigaiWizard language={language} />
    <details className={styles.sourceDetails}>
      <summary>{t("이키가이와 네 가지 질문에 대하여", "About ikigai and the four questions")}</summary>
      <p>{t("이 서비스는 좋아하는 것·잘하는 것·사람들이 필요로 하는 것·보상받을 수 있는 것이라는 네 가지 질문을 참고한 생각 정리 도구예요. 적성이나 직업을 판정하는 검사는 아니에요.", "This tool helps organize your thoughts using four questions: what you love, what you are good at, what people need, and what you could be paid for. It is not an aptitude test or a career assessment.")}</p>
      <p>{t("이키가이는 일뿐 아니라 취미와 관계처럼 삶에서 기쁨과 의미를 느끼는 것까지 포함하는 더 넓은 개념이에요. 네 영역을 모두 채우거나 수익화할 필요는 없어요.", "Ikigai is a broader idea that includes sources of joy and meaning in life, such as hobbies and relationships as well as work. You do not need to fill all four areas or earn money from them.")}</p>
      <p>{t("선택한 활동과 문제를 미리 준비한 20개 후보에 연결해 제안해요. 직접 쓴 메모는 자동으로 해석하지 않으며, 답변을 전송하는 기능은 없어요.", "Your selected activities and problems are linked to 20 prepared candidates. Written notes are not interpreted automatically, and this tool has no feature that sends your answers elsewhere.")}</p>
      <p>{t("참고:", "References:")} <a className="text-link" href="https://theviewinside.me/what-is-your-ikigai" target="_blank" rel="noreferrer">{t("Marc Winn의 네 가지 질문 ↗", "The four questions introduced by Marc Winn ↗")}</a> · <a className="text-link" href="https://www.japan.go.jp/kizuna/2022/03/ikigai_japanese_secret_to_a_joyful_life.html" target="_blank" rel="noreferrer">{t("일본 정부의 이키가이 설명 ↗", "The Japanese government's explanation of ikigai ↗")}</a></p>
    </details>
  </div>;
}
