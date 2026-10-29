"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "@/lib/i18n";
import {
  type ExperimentRecord, type IkigaiState, type Option, type ReflectionAnswer,
} from "./model";
import { matchActivities, type ActivityRecommendation } from "./match";
import { getIkigaiOptions, getIkigaiWizardCopy, ikigaiText } from "./translations";
import { useIkigaiState } from "./use-ikigai-state";
import styles from "./ikigai.module.css";

const signalClass = { matched: "signalMatched", unconfirmed: "signalUnconfirmed", "self-reported": "signalSelfReported", "not-needed": "signalNotNeeded" } as const;
type TagField = "likes" | "strengths" | "needs";
type NoteField = TagField | "rewards";

function labels(ids: string[], options: readonly Option[]) {
  return options.filter(option => ids.includes(option.id)).map(option => option.label);
}

function RadioChoices<T extends string>({ name, options, value, onChange }: {
  name: string; options: readonly Option<T>[]; value: T; onChange: (value: T) => void;
}) {
  return <div className={styles.choiceGrid}>
    {options.map(option => <label className={`${styles.choice} ${value === option.id ? styles.choiceSelected : ""}`} key={option.id}>
      <input type="radio" name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
      <span className={styles.choiceCopy}><span>{option.label}</span>{option.description && <small>{option.description}</small>}</span>
    </label>)}
  </div>;
}

function Note({ id, label, value, onChange, language }: { id: string; label: string; value: string; onChange: (value: string) => void; language: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  return <div className={styles.noteField}>
    <label htmlFor={id}>{label} <span className={styles.help}>{t("(선택)", "(optional)")}</span></label>
    <textarea id={id} value={value} maxLength={500} rows={3} onChange={event => onChange(event.target.value)} aria-describedby={`${id}-hint`} />
    <p id={`${id}-hint`} className={styles.noteCounter}>{t("나만 볼 메모 · 최대 500자", "Your own note · up to 500 characters")} ({value.length}/500)</p>
  </div>;
}

function AnswerSummary({ state, edit, language }: { state: IkigaiState; edit: (step: number) => void; language: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  const { activityTags, needTags, rewardOptions, goalOptions, timeOptions } = getIkigaiOptions(language);
  const { domainNames } = getIkigaiWizardCopy(language);
  const summaries: { field: NoteField; step: number; items: string[] }[] = [
    { field: "likes", step: 1, items: labels(state.likes, activityTags) },
    { field: "strengths", step: 2, items: labels(state.strengths, activityTags) },
    { field: "needs", step: 3, items: labels(state.needs, needTags) },
    { field: "rewards", step: 4, items: [rewardOptions.find(option => option.id === state.rewards)!.label] },
  ];
  return <div className={styles.reviewGrid}>
    <section className={styles.reviewBlock}>
      <div className={styles.reviewHeader}><h3>{t("이번 탐색의 방향", "Your exploration goal")}</h3><button type="button" className="text-link" onClick={() => edit(0)} aria-label={t("이번 탐색의 방향 수정", "Edit your exploration goal")}>{t("수정", "Edit")}</button></div>
      <p>{goalOptions.find(option => option.id === state.goal)!.label} · {timeOptions.find(option => option.id === state.time)!.label}</p>
    </section>
    {summaries.map(({ field, step, items }) => <section className={styles.reviewBlock} key={field}>
      <div className={styles.reviewHeader}><h3>{domainNames[field]}</h3><button type="button" className="text-link" onClick={() => edit(step)} aria-label={t(`${domainNames[field]} 답변 수정`, `Edit answer: ${domainNames[field]}`)}>{t("수정", "Edit")}</button></div>
      <p className={styles.summaryTags}>{items.length ? items.join(" · ") : t("아직 모르겠어요", "I'm not sure yet")}</p>
      {state.notes[field] && <p className={styles.memo}>{state.notes[field]}</p>}
    </section>)}
  </div>;
}

function Reflection({ activityId, record, update, language }: { activityId: string; record?: ExperimentRecord; update: (change: Partial<ExperimentRecord>) => void; language: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  const { reflectionOptions } = getIkigaiOptions(language);
  const value: ExperimentRecord = record ?? { tried: false, enjoyed: "unknown", again: "unknown", helped: "unknown", note: "" };
  const questions: { key: "enjoyed" | "again" | "helped"; title: string }[] = [
    { key: "enjoyed", title: t("하는 동안 즐거웠나요?", "Did you enjoy doing it?") }, { key: "again", title: t("다시 해보고 싶나요?", "Would you like to do it again?") }, { key: "helped", title: t("누군가에게 도움이 됐나요?", "Did it help anyone?") },
  ];
  return <details className={styles.reflection}>
    <summary>{t("실험 후기 기록하기", "Record your experiment")}{value.tried && <span className={styles.recorded}> · {t("해봤어요", "Tried it")}</span>}</summary>
    <label className={styles.reflectionChoice}><input type="checkbox" checked={value.tried} onChange={event => update({ tried: event.target.checked })} /> {t("이 실험을 해봤어요", "I tried this experiment")}</label>
    {value.tried && <>
      {questions.map(question => <fieldset className={styles.reflectionGroup} key={question.key}>
        <legend>{question.title}</legend>
        <div className={styles.chipGrid}>{reflectionOptions.map(option => <label className={`${styles.chip} ${value[question.key] === option.id ? styles.chipSelected : ""}`} key={option.id}>
          <input type="radio" name={`${activityId}-${question.key}`} value={option.id} checked={value[question.key] === option.id} onChange={() => update({ [question.key]: option.id as ReflectionAnswer })} /> {option.label}
        </label>)}</div>
      </fieldset>)}
      <Note language={language} id={`reflection-${activityId}`} label={t("해보고 알게 된 점", "What you learned by trying")} value={value.note} onChange={note => update({ note })} />
    </>}
    <p className={styles.help}>{t("후기는 자동 저장되며 추천 순서를 바꾸지는 않아요. 도움이 됐는지 아직 모른다면 그대로 남겨도 괜찮아요.", "Reflections are saved automatically and do not change the recommendation order. It's fine if you don't know yet whether it helped.")}</p>
  </details>;
}

function Recommendation({ item, record, update, language }: { item: ActivityRecommendation; record?: ExperimentRecord; update: (change: Partial<ExperimentRecord>) => void; language: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  const { categoryLabels, domainNames, signalLabel } = getIkigaiWizardCopy(language);
  const { activity } = item;
  return <article className={styles.recommendation} aria-labelledby={`activity-${activity.id}`}>
    <div className={styles.recommendationHeader}><div><span className={styles.category}>{categoryLabels[item.category]}</span><h3 id={`activity-${activity.id}`}>{activity.title}</h3></div><span className={styles.duration}>{t(`예상 ${activity.minutes}분`, `About ${activity.minutes} min`)}</span></div>
    <p className={styles.description}>{activity.description}</p>
    <div className={styles.activityBody}>
      <div><h4>{t("이 후보를 보여드린 이유", "Why this activity is here")}</h4><ul className={styles.reasons}>{item.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></div>
      <div className={styles.experiment}><p className={styles.experimentLabel}>{t("이번 주의 작은 실험", "A small experiment for this week")}</p><p>{activity.experiment}</p></div>
    </div>
    <div className={styles.signals}>
      {(Object.keys(domainNames) as NoteField[]).map(domain => {
        const signal = item.signals[domain];
        return <section className={`${styles.signal} ${styles[signalClass[signal.status]]}`} key={domain}>
          <h4>{domainNames[domain]} <span>{signalLabel[signal.status]}</span></h4><p>{signal.label}</p>
          {signal.evidence.length > 0 && <p className={styles.help}>{signal.evidence.join(" · ")}</p>}
        </section>;
      })}
    </div>
    <div className={styles.questions}><h4>{t("해보면서 확인할 질문", "Questions to explore as you try")}</h4><ul>{item.questions.map(question => <li key={question}>{question}</li>)}</ul></div>
    <Reflection language={language} activityId={activity.id} record={record} update={update} />
  </article>;
}

export function IkigaiWizard({ language = "ko" }: { language?: Language }) {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  const { steps, headings, help, domainNames } = getIkigaiWizardCopy(language);
  const { activityTags, goalOptions, needTags, rewardOptions, timeOptions } = getIkigaiOptions(language);
  const { state, loaded, storageState, change, reset } = useIkigaiState();
  const [deleteFailed, setDeleteFailed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusRequested = useRef(false);
  useEffect(() => {
    if (focusRequested.current) {
      heading.current?.focus();
      focusRequested.current = false;
    }
  }, [state.step, state.view]);

  function go(step: number) {
    focusRequested.current = true;
    change(previous => ({ ...previous, step, view: "questions" }));
  }
  function results() {
    focusRequested.current = true;
    change(previous => ({ ...previous, view: "results", step: 5 }));
  }
  function note(field: NoteField, value: string) {
    change(previous => ({ ...previous, notes: { ...previous.notes, [field]: value } }));
  }
  function toggle(field: TagField, id: string) {
    change(previous => ({ ...previous, [field]: previous[field].includes(id) ? previous[field].filter(value => value !== id) : [...previous[field], id] }));
  }
  function updateExperiment(id: string, update: Partial<ExperimentRecord>) {
    change(previous => ({ ...previous, experiments: { ...previous.experiments, [id]: { ...(previous.experiments[id] ?? { tried: false, enjoyed: "unknown", again: "unknown", helped: "unknown", note: "" }), ...update } } }));
  }
  // A native confirmation keeps deletion explicit and scoped to this service.
  function clearRecords() {
    if (!window.confirm(t("좋아하는 일 찾기의 답변과 실험 기록을 모두 지울까요? 디비전2 보상 기록은 유지됩니다.", "Delete all answers and experiment records for this activity explorer? Your Division 2 reward records will be kept."))) return;
    focusRequested.current = true;
    setDeleteFailed(!reset());
    requestAnimationFrame(() => {
      heading.current?.focus();
      focusRequested.current = false;
    });
  }

  const field: TagField | null = state.step === 1 ? "likes" : state.step === 2 ? "strengths" : state.step === 3 ? "needs" : null;
  const tagOptions = field === "needs" ? needTags : activityTags;
  const recommendations = state.view === "results" ? matchActivities(state, language) : [];
  const explorationOnly = !state.likes.length && !state.strengths.length && !state.needs.length;

  return <div className={styles.workbench} aria-busy={!loaded}>
    <div className={styles.windowBar}><span aria-hidden="true">./discovery/ikigai</span><p className={styles.status} role="status">{!loaded ? t("저장된 답변을 확인하는 중…", "Checking saved answers…") : storageState !== "ready" ? t("자동 저장 멈춤 · 현재 화면에서만 유지", "Auto-save paused · kept on this screen only") : state.savedAt ? t("이 브라우저에 자동 저장됨", "Saved automatically in this browser") : t("답변을 고르면 자동 저장돼요", "Your choices will be saved automatically")}</p></div>
    {loaded && storageState !== "ready" && <div className={styles.warning} role="alert">
      <p>{storageState === "corrupt" ? t("기존 저장 기록을 읽을 수 없어 덮어쓰지 않았어요. 새 답변은 현재 화면에서만 유지돼요.", "Your existing record could not be read and has not been overwritten. New answers are kept on this screen only.") : t("브라우저 저장 공간을 사용할 수 없거나 저장에 실패했어요. 새 답변은 현재 화면에서만 유지되며 새로고침하면 사라질 수 있어요.", "Browser storage is unavailable or saving failed. New answers are kept on this screen only and may disappear on refresh.")}</p>
      {deleteFailed && <p>{t("저장된 기록을 삭제하지 못했어요. 현재 화면만 비웠으며, 기존 기록은 브라우저에 남아 있을 수 있어요.", "The saved record could not be deleted. Only this screen was cleared; the existing record may still be in your browser.")}</p>}
      <p>{t("브라우저 저장 설정을 확인하거나, 아래 ‘이 서비스 기록 모두 삭제’로 초기화한 뒤 다시 시작할 수 있어요. 삭제에 실패하면 자동 저장은 계속 멈춰요.", "Check your browser storage settings, or use ‘Delete this service's records’ below to reset and start again. Auto-save stays paused if deletion fails.")}</p>
    </div>}
    {state.view === "questions" ? <form className={styles.layout} onSubmit={event => { event.preventDefault(); if (!loaded) return; if (state.step === 5) results(); else go(state.step + 1); }}>
      <nav className={styles.stepper} aria-label={t("좋아하는 일 찾기 질문 단계", "Activity explorer question steps")}>
        {steps.map((step, index) => <button type="button" disabled={!loaded} className={`${styles.stepButton} ${state.step === index ? styles.stepActive : ""}`} aria-current={state.step === index ? "step" : undefined} onClick={() => go(index)} key={step}>
          <span className={styles.stepIndex} aria-hidden="true">0{index + 1}</span><span className={styles.stepText}>{step}</span>
        </button>)}
      </nav>
      <fieldset className={styles.panel} disabled={!loaded} aria-labelledby="ikigai-question">
        <p className={styles.stepLabel}>{String(state.step + 1).padStart(2, "0")} / 06 · {steps[state.step]}</p>
        <h2 id="ikigai-question" className={styles.questionHeading} tabIndex={-1} ref={heading}>{headings[state.step]}</h2>
        <p className={styles.help}>{help[state.step]}</p>
        {state.step === 0 && <>
          <fieldset className={styles.fieldGroup}><legend>{t("찾아보고 싶은 방향", "What you would like to explore")}</legend><RadioChoices name="goal" options={goalOptions} value={state.goal} onChange={goal => change(previous => ({ ...previous, goal }))} /></fieldset>
          <fieldset className={styles.fieldGroup}><legend>{t("이번 주 작은 실험에 쓸 수 있는 시간", "Time for a small experiment this week")}</legend><RadioChoices name="time" options={timeOptions} value={state.time} onChange={time => change(previous => ({ ...previous, time }))} /></fieldset>
        </>}
        {field && <>
          <fieldset className={styles.fieldGroup}><legend>{domainNames[field]} {t("(여러 개 선택 가능)", "(choose any that apply)")}</legend>
            <div className={styles.chipGrid}>{tagOptions.map(option => <label className={`${styles.chip} ${state[field].includes(option.id) ? styles.chipSelected : ""}`} key={option.id}>
              <input type="checkbox" name={field} value={option.id} checked={state[field].includes(option.id)} onChange={() => toggle(field, option.id)} /> {option.label}
            </label>)}</div>
            <button type="button" className={styles.unknownButton} aria-pressed={state[field].length === 0} onClick={() => change(previous => ({ ...previous, [field]: [] }))}>{t("지금은 모르겠어요", "I'm not sure yet")}{state[field].length === 0 ? " ✓" : ""}</button>
          </fieldset>
          <Note language={language} id={`note-${field}`} label={field === "likes" ? t("최근에 즐거웠던 순간", "A moment you recently enjoyed") : field === "strengths" ? t("직접 해본 일이나 부탁받은 경험", "Something you have tried or been asked to do") : t("누구의 어떤 어려움인지", "Who faces this difficulty, and what is it?")} value={state.notes[field]} onChange={value => note(field, value)} />
        </>}
        {state.step === 4 && <>
          <fieldset className={styles.fieldGroup}><legend>{t("활동에 대한 보상 경험", "Your experience of rewards for activities")}</legend><RadioChoices name="rewards" options={rewardOptions} value={state.rewards} onChange={rewards => change(previous => ({ ...previous, rewards }))} /></fieldset>
          <p className={styles.help}>{t("전체 경험을 묻는 질문이에요. 선택하더라도 추천 활동의 수입 가능성이 확인된 것은 아니에요.", "This asks about your overall experience. Your answer does not confirm earning potential for a recommended activity.")}</p>
          <Note language={language} id="note-rewards" label={t("떠오르는 경험이나 사례", "An experience or example that comes to mind")} value={state.notes.rewards} onChange={value => note("rewards", value)} />
        </>}
        {state.step === 5 && <AnswerSummary language={language} state={state} edit={go} />}
        <div className={styles.navigation}>
          {state.step > 0 && <button type="button" className={styles.backButton} onClick={() => go(state.step - 1)}>{t("이전", "Back")}</button>}
          {state.step < 5 && <button type="button" className={styles.skipButton} onClick={() => go(state.step + 1)}>{t("건너뛰기", "Skip")}</button>}
          <button type="submit" className={`button ${styles.primaryButton}`}>{state.step === 5 ? t("세 가지 활동 살펴보기 →", "Explore three activities →") : t("다음 →", "Next →")}</button>
        </div>
        <p className={styles.footnote}>{state.step < 5 ? t("선택 없이 넘어가도 괜찮아요. 건너뛰면 이미 적은 답변은 그대로 남아요.", "It's fine to continue without choosing. Skipping keeps any answers you already entered.") : t("정답이나 적성 점수 대신, 지금 해볼 후보와 확인할 질문을 보여드려요.", "You'll see activities to try and questions to explore, rather than a correct answer or an aptitude score.")}</p>
      </fieldset>
    </form> : <div className={styles.results}>
      <div className={styles.resultHeader}><div><p className={styles.stepLabel}>./next-experiments</p><h2 className={styles.questionHeading} tabIndex={-1} ref={heading}>{t("이번 주, 작게 해볼 세 가지.", "Three small things to try this week.")}</h2><p className={styles.help}>{t("직업을 정하는 결과가 아니라, 직접 해보면서 좋아하는 일을 좁혀가는 출발점이에요.", "A starting point for discovering what you enjoy through experience, rather than a decision about your career.")}</p></div>
        <div className={styles.resultActions}><button type="button" className={styles.secondaryButton} onClick={() => go(5)}>{t("답변 수정", "Edit answers")}</button></div>
      </div>
      {explorationOnly && <p className={styles.zeroState}>{t("아직 선택한 활동이나 문제가 없어 일반적인 탐색 아이디어를 보여드려요. 해보고 느낌을 기록하거나, 답변을 더 고르면 다른 후보를 살펴볼 수 있어요.", "You haven't selected any activities or problems yet, so these are general exploration ideas. Try one and record how it felt, or choose more answers to explore other candidates.")}</p>}
      <details className={styles.resultSummary}><summary>{t("내 답변 다시 보기", "Review my answers")}</summary><AnswerSummary language={language} state={state} edit={go} /></details>
      <div className={styles.cards}>{recommendations.map(item => <Recommendation language={language} key={item.activity.id} item={item} record={state.experiments[item.activity.id]} update={update => updateExperiment(item.activity.id, update)} />)}</div>
      <p className={styles.footnote}>{t("20개 활동 후보에서 선택한 항목과의 연결, 탐색 방향, 실험 시간을 참고해 3개를 골랐어요. 직접 적은 메모와 실험 후기는 추천 계산에 쓰지 않아요.", "Three activities were chosen from 20 candidates using links to your selections, your exploration goal, and experiment time. Your written notes and reflections are not used to calculate recommendations.")}</p>
    </div>}
    <div className={styles.resetBar}><p className={styles.help}>{t("답변과 후기는 이 브라우저에만 저장해요. 다른 기기와 동기화하지 않으며, 브라우저 데이터를 지우면 함께 사라질 수 있어요.", "Answers and reflections are saved only in this browser. They do not sync across devices and may be lost if you clear browser data.")}</p><button type="button" disabled={!loaded} className={styles.secondaryButton} onClick={clearRecords}>{t("이 서비스 기록 모두 삭제", "Delete this service's records")}</button></div>
    <noscript><p className={styles.warning}>{t("질문 선택·결과 계산·브라우저 저장을 사용하려면 JavaScript를 켜주세요. 아래 개념 설명은 그대로 읽을 수 있어요.", "Enable JavaScript to answer questions, calculate results, and save in your browser. You can still read the explanation below.")}</p></noscript>
  </div>;
}
