import type { Language } from "@/lib/i18n";
import { normalizeState, type Activity, type IkigaiState, type Option } from "./model";
import { getIkigaiActivities, getIkigaiOptions, ikigaiText } from "./translations";

export type DomainSignal = { status: "matched" | "unconfirmed" | "self-reported" | "not-needed"; label: string; evidence: string[] };
export type ActivityRecommendation = {
  activity: Activity; category: "try" | "learn" | "explore"; reasons: string[];
  signals: { likes: DomainSignal; strengths: DomainSignal; needs: DomainSignal; rewards: DomainSignal };
  questions: string[]; isExploration: boolean;
};
function selectedLabels(selected: string[], candidate: string[], domain: readonly Option[]): string[] {
  return domain.filter(option => selected.includes(option.id) && candidate.includes(option.id)).map(option => option.label);
}
function signal(label: string, evidence: string[]): DomainSignal {
  return { status: evidence.length ? "matched" : "unconfirmed", label, evidence };
}
function rewardSignal(state: IkigaiState, language: Language): DomainSignal {
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  switch (state.rewards) {
    case "experienced": return { status: "self-reported", label: t("전체 답변에서 보상 경험을 골랐어요", "You reported reward experience in your overall answers"), evidence: [t("전체 활동에 대한 본인의 답변이에요. 이 활동의 대가는 별도 확인이 필요해요.", "This is your own report across your activities. Payment for this specific activity still needs to be checked.")] };
    case "seen": return { status: "self-reported", label: t("전체 답변에서 보상 사례를 봤다고 골랐어요", "You reported seeing paid examples in your overall answers"), evidence: [t("본인이 본 사례에 대한 답변이에요. 이 활동의 수요와 대가는 별도 확인이 필요해요.", "This is your report of examples you have seen. Demand and payment for this specific activity still need to be checked.")] };
    case "not-interested": return { status: "not-needed", label: t("수익화는 이번 탐색의 조건이 아니에요", "Earning money is not a condition of this exploration"), evidence: [t("전체 답변에서 수익화에 관심 없음을 골랐어요.", "You selected that you are not interested in earning money from this.")] };
    default: return { status: "unconfirmed", label: t("보상 가능성은 아직 확인하지 않았어요", "The possibility of a reward has not been checked"), evidence: [] };
  }
}
/** Scores are only an ordering aid, never a psychological assessment or an income prediction. */
export function matchActivities(input: IkigaiState, language: Language = "ko"): ActivityRecommendation[] {
  const state = normalizeState(input);
  const { activityTags, needTags } = getIkigaiOptions(language);
  const activities = getIkigaiActivities(language);
  const t = (ko: string, en: string) => ikigaiText(language, ko, en);
  const exploratory = !state.likes.length && !state.strengths.length && !state.needs.length;
  const weights = state.goal === "enjoy" ? [5, 2, 2] : state.goal === "strength" ? [2, 5, 2] : state.goal === "work" ? [2, 4, 4] : [3, 3, 3];
  const target = state.time === "short" ? 25 : state.time === "medium" ? 40 : state.time === "long" ? 60 : null;
  const ordered = activities.map((activity, index) => {
    const likes = selectedLabels(state.likes, activity.tags, activityTags);
    const strengths = selectedLabels(state.strengths, activity.tags, activityTags);
    const needs = selectedLabels(state.needs, activity.needs, needTags);
    const relevance = likes.length * weights[0] + strengths.length * weights[1] + needs.length * weights[2];
    // Blank answers contribute no penalty. Duration only resolves similar levels of relevance.
    const timeFit = target === null ? 0 : -Math.abs(activity.minutes - target) / 20;
    return { activity, index, likes, strengths, needs, rank: relevance + timeFit };
  }).sort((a, b) => b.rank - a.rank || a.index - b.index);
  return ordered.slice(0, 3).map(({ activity, likes, strengths, needs }) => {
    const reasons: string[] = [];
    if (likes.length) reasons.push(t(`좋아하는 일에서 고른 ${likes.join(" · ")}와 연결되는 활동이에요.`, `This activity connects with ${likes.join(" · ")}, which you selected as things you enjoy.`));
    if (strengths.length) reasons.push(t(`직접 해봤거나 부탁받은 일에서 고른 ${strengths.join(" · ")}와 연결돼요.`, `It connects with ${strengths.join(" · ")}, which you selected as things you have tried or been asked to do.`));
    if (needs.length) reasons.push(t(`관심 있는 불편에서 고른 ${needs.join(" · ")}를 살펴볼 수 있어요.`, `It lets you explore ${needs.join(" · ")}, which you selected as problems you care about.`));
    if (!reasons.length) reasons.push(t("선택한 태그와 직접 연결된 근거가 아직 없어 일반 탐색 후보로 보여드려요. 성격이나 능력을 추정한 결과가 아니에요.", "This is a general exploration idea because there is no direct link to your selected tags yet. It does not infer your personality or ability."));
    if (state.time !== "unknown") reasons.push(t(`실험 예상 시간은 ${activity.minutes}분이에요. 선택한 시간 범위를 순서에 반영했어요.`, `The experiment takes about ${activity.minutes} minutes. Your chosen time range is reflected in the order.`));
    const hasMatch = likes.length + strengths.length + needs.length > 0;
    const category = strengths.length ? "try" : hasMatch ? "learn" : "explore";
    const questions = [activity.question];
    if (!strengths.length) questions.push(t("이 활동을 실제로 해본 경험이나 배워보고 싶은 부분이 있나요?", "Have you tried this activity before, or is there a part you would like to learn?"));
    if (!needs.length) questions.push(t("이 활동이 도움이 될 사람은 누구이며, 그 사람이 원하는 도움인가요?", "Who might this help, and is it the help they actually want?"));
    if (state.goal === "work" && state.rewards !== "not-interested") questions.push(t("이 활동에 비용을 내는 구체적인 대상과 조건을 확인할 수 있나요?", "Can you identify who would pay for this activity and under what conditions?"));
    return {
      activity: { ...activity, tags: [...activity.tags], needs: [...activity.needs] }, category, reasons,
      signals: {
        likes: signal(likes.length ? t("선택한 관심과 연결돼요", "Linked to an interest you selected") : t("즐거움은 실험으로 확인해요", "Try the experiment to see whether you enjoy it"), likes),
        strengths: signal(strengths.length ? t("직접 경험했다고 고른 항목과 연결돼요", "Linked to something you selected as direct experience") : t("직접 경험은 아직 확인하지 않았어요", "Direct experience has not been confirmed yet"), strengths),
        needs: signal(needs.length ? t("선택한 불편과 연결돼요", "Linked to a problem you selected") : t("도움이 필요한 대상은 더 찾아봐요", "Explore who might need this help"), needs),
        rewards: rewardSignal(state, language),
      }, questions, isExploration: exploratory || !hasMatch,
    };
  });
}
