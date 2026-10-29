export type Goal = "enjoy" | "strength" | "work" | "unknown";
export type TimeBudget = "short" | "medium" | "long" | "unknown";
export type RewardAnswer = "experienced" | "seen" | "unknown" | "not-interested";
export type ReflectionAnswer = "yes" | "unsure" | "no" | "unknown";
export type ExperimentRecord = { tried: boolean; enjoyed: ReflectionAnswer; again: ReflectionAnswer; helped: ReflectionAnswer; note: string };
export type IkigaiState = {
  schema: 1; step: number; view: "questions" | "results"; goal: Goal; time: TimeBudget;
  likes: string[]; strengths: string[]; needs: string[]; rewards: RewardAnswer;
  notes: { likes: string; strengths: string; needs: string; rewards: string };
  experiments: Record<string, ExperimentRecord>; savedAt: string | null;
};
export type Option<T extends string = string> = { id: T; label: string; description?: string };
export const goalOptions: readonly Option<Goal>[] = [
  { id: "enjoy", label: "일상에서 즐길 거리" }, { id: "strength", label: "잘하는 것 발견" },
  { id: "work", label: "진로·부업 탐색" }, { id: "unknown", label: "아직 모르겠어요" },
];
export const timeOptions: readonly Option<TimeBudget>[] = [
  { id: "short", label: "30분 이내" }, { id: "medium", label: "30~60분" },
  { id: "long", label: "1시간 이상" }, { id: "unknown", label: "아직 모르겠어요" },
];
export const activityTags: readonly Option[] = [
  { id: "explain", label: "설명하기" }, { id: "make", label: "만들기" }, { id: "organize", label: "정리하기" },
  { id: "research", label: "탐구하기" }, { id: "care", label: "돌보기" }, { id: "express", label: "표현하기" },
  { id: "together", label: "함께하기" }, { id: "move", label: "움직이기" }, { id: "craft", label: "손으로 작업하기" },
  { id: "game", label: "게임하기" }, { id: "tech", label: "기술 다루기" }, { id: "nature", label: "자연 관찰하기" },
];
export const needTags: readonly Option[] = [
  { id: "beginners", label: "입문자의 어려움" }, { id: "information", label: "정보 찾기·선택의 어려움" },
  { id: "daily", label: "생활의 번거로움" }, { id: "connection", label: "교류할 기회 부족" },
  { id: "learning", label: "배움의 어려움" }, { id: "accessibility", label: "이용하기 불편한 환경" },
  { id: "environment", label: "환경·자원 낭비" }, { id: "wellbeing", label: "일상의 쉼과 활력 부족" },
  { id: "local", label: "우리 동네의 불편" }, { id: "small-business", label: "작은 가게의 알림·운영 어려움" },
];
export const rewardOptions: readonly Option<RewardAnswer>[] = [
  { id: "experienced", label: "보상받은 경험이 있어요", description: "선택한 활동 전반에 대한 본인의 경험이에요." },
  { id: "seen", label: "비슷한 일에 돈을 내는 사례를 봤어요" },
  { id: "unknown", label: "아직 모르겠어요" }, { id: "not-interested", label: "수익화에 관심 없어요" },
];
export const reflectionOptions: readonly Option<ReflectionAnswer>[] = [
  { id: "yes", label: "그랬어요" }, { id: "unsure", label: "애매해요" },
  { id: "no", label: "아니었어요" }, { id: "unknown", label: "아직 모르겠어요" },
];
export type Activity = {
  id: string; title: string; description: string; tags: string[]; needs: string[];
  minutes: number; experiment: string; question: string;
};
export const activities: readonly Activity[] = [
  { id: "game-guide", title: "게임 입문 팁 만들기", description: "처음 시작한 사람이 막히는 부분을 짧게 설명해 봐요.", tags: ["game", "explain", "organize"], needs: ["beginners", "information"], minutes: 30, experiment: "익숙한 게임의 입문 팁 5개를 적고, 관심 있는 한 사람에게 이해하기 쉬운지 물어보세요.", question: "게임을 즐기는 것과 설명하는 것 중 어느 쪽이 더 즐거웠나요?" },
  { id: "room-system", title: "작은 공간 정리법 만들기", description: "책상이나 서랍 하나에 다시 쓰기 쉬운 정리법을 찾아봐요.", tags: ["organize", "make"], needs: ["daily", "environment"], minutes: 20, experiment: "서랍 하나를 정리하고 물건을 다시 찾는 데 도움이 되는 규칙 3개를 적어 보세요.", question: "정리 과정과 정리된 결과 중 무엇을 다시 경험하고 싶나요?" },
  { id: "nature-log", title: "동네 자연 관찰 기록", description: "가까운 곳의 작은 변화를 발견하고 기록해 봐요.", tags: ["nature", "research", "move"], needs: ["environment", "wellbeing"], minutes: 20, experiment: "익숙한 길에서 식물이나 풍경 3개를 관찰하고 달라 보인 점을 짧게 기록해 보세요.", question: "다음 주에도 같은 장소를 관찰하고 싶은가요?" },
  { id: "digital-help", title: "디지털 사용법 도와주기", description: "동의한 지인과 앱의 기본 기능 하나를 함께 익혀요.", tags: ["tech", "explain", "care"], needs: ["beginners", "accessibility", "learning"], minutes: 40, experiment: "도움받고 싶은 기능을 지인에게 묻고, 본인이 직접 따라 할 수 있도록 순서 3개로 설명해 보세요. 비밀번호는 직접 입력하게 하세요.", question: "상대의 속도에 맞춰 설명하는 과정이 어땠나요?" },
  { id: "skill-note", title: "배운 내용 한 장으로 설명하기", description: "최근 배운 것을 다른 사람이 따라 할 수 있게 정리해요.", tags: ["explain", "organize", "research"], needs: ["learning", "information"], minutes: 30, experiment: "최근 배운 개념 하나를 예시와 함께 한 장에 적고, 처음 보는 사람에게 이해되는지 물어보세요.", question: "어떤 설명이 실제로 도움이 됐다는 피드백을 받았나요?" },
  { id: "walk-map", title: "동네 산책길 안내 만들기", description: "직접 걸어 본 길의 특징을 사람들에게 알려봐요.", tags: ["move", "research", "organize"], needs: ["local", "wellbeing", "information"], minutes: 40, experiment: "익숙하고 안전한 길을 걸으며 거리·쉼터·주의할 점을 기록해 짧은 안내를 만들어 보세요.", question: "어떤 사람에게 이 길 안내가 유용할까요?" },
  { id: "care-checkin", title: "상대가 원하는 작은 도움 찾기", description: "친한 사람에게 필요한 것을 묻고 가능한 도움 하나를 해봐요.", tags: ["care", "together"], needs: ["connection", "daily"], minutes: 20, experiment: "지인에게 이번 주 번거로운 일 하나를 묻고, 원하는 경우에만 20분 안에 가능한 도움을 함께 정해 보세요.", question: "상대가 원한 도움과 내가 예상한 도움은 같았나요?" },
  { id: "photo-story", title: "사진으로 짧은 이야기 만들기", description: "일상의 장면을 골라 나만의 시선으로 표현해요.", tags: ["express", "make", "research"], needs: ["connection", "local"], minutes: 40, experiment: "사생활이 드러나지 않는 사진 3장을 골라 각 장면의 이야기를 한 문장씩 적어 보세요.", question: "찍기·고르기·글쓰기 중 어떤 순간이 가장 즐거웠나요?" },
  { id: "repair-start", title: "생활용품 관리법 익히기", description: "작은 물건을 오래 쓰는 기본 관리법을 배워봐요.", tags: ["craft", "research", "make"], needs: ["environment", "daily"], minutes: 60, experiment: "전기·날붙이를 다루지 않는 물건 하나를 골라 공식 관리법을 읽고 세척이나 단순 관리부터 해보세요.", question: "문제를 찾아 손으로 해결하는 과정을 더 배우고 싶은가요?" },
  { id: "community-meet", title: "소규모 취미 모임 진행하기", description: "관심사가 비슷한 사람과 짧은 만남을 구성해요.", tags: ["together", "organize", "care"], needs: ["connection", "local"], minutes: 60, experiment: "참여를 원하는 지인 1~2명과 주제 하나를 정해 30분 대화하고, 준비와 마무리에 각각 15분을 써보세요.", question: "직접 참여할 때와 모임을 준비할 때 중 무엇이 더 잘 맞았나요?" },
  { id: "simple-tool", title: "반복 작업을 줄이는 작은 도구", description: "자주 하는 일 하나를 간단한 양식이나 기능으로 줄여봐요.", tags: ["tech", "make", "research"], needs: ["daily", "small-business"], minutes: 60, experiment: "반복하는 일의 단계를 적고, 익숙한 도구의 양식·함수 등으로 한 단계만 줄여보세요. 새 설치는 필요 없어요.", question: "만드는 즐거움과 실제 절약된 시간 중 어떤 근거가 남았나요?" },
  { id: "choice-comparison", title: "선택을 돕는 비교표 만들기", description: "정보를 확인하고 차이를 알기 쉽게 정리해요.", tags: ["research", "organize", "explain"], needs: ["information", "beginners"], minutes: 30, experiment: "익숙한 도구나 취미 선택지 3개의 공식 정보를 찾아 같은 기준으로 비교하고 확인한 날짜를 적어보세요.", question: "자료를 찾는 과정과 차이를 설명하는 과정 중 무엇이 더 좋았나요?" },
  { id: "reading-circle", title: "한 편 읽고 이야기 나누기", description: "짧은 글을 함께 읽고 서로의 생각을 들어봐요.", tags: ["together", "explain", "research"], needs: ["learning", "connection"], minutes: 40, experiment: "지인과 공개된 짧은 글 한 편을 읽고, 궁금했던 점 2개를 정해 서로 이야기해 보세요.", question: "혼자 읽을 때와 함께 이야기할 때의 즐거움은 어떻게 달랐나요?" },
  { id: "recipe-card", title: "익숙한 요리 순서 카드", description: "직접 해본 생활 기술을 따라 하기 쉽게 기록해요.", tags: ["craft", "organize", "explain"], needs: ["daily", "beginners"], minutes: 40, experiment: "익숙한 간단한 요리를 하면서 준비물과 헷갈리는 순서를 적어 한 장의 카드로 만들어 보세요.", question: "직접 만드는 일과 방법을 전달하는 일 중 무엇을 계속하고 싶나요?" },
  { id: "local-interview", title: "동네의 작은 불편 들어보기", description: "해결책을 정하기 전에 사람들이 겪는 일을 들어봐요.", tags: ["research", "care", "together"], needs: ["local", "small-business", "daily"], minutes: 60, experiment: "대화를 원하는 지인 한 명에게 동네에서 번거로운 순간을 묻고, 개인정보 없이 문제 3개를 정리해 보세요.", question: "내 예상과 달랐던 불편은 무엇이었나요?" },
  { id: "accessibility-check", title: "안내문을 읽기 쉽게 바꾸기", description: "익숙한 안내를 더 쉽게 이해할 수 있도록 다듬어요.", tags: ["explain", "organize", "care"], needs: ["accessibility", "information"], minutes: 30, experiment: "직접 만든 안내문 하나의 긴 문장을 줄이고 순서를 나눠 본 뒤, 지인에게 이해하기 쉬운지 물어보세요.", question: "어떤 수정이 읽는 사람에게 실제로 도움이 됐나요?" },
  { id: "small-shop-card", title: "작은 가게 소개 카드 연습", description: "필요한 정보를 짧은 글과 배치로 전달해 봐요.", tags: ["express", "make", "organize"], needs: ["small-business", "information"], minutes: 40, experiment: "가상의 가게를 정해 이용 대상·특징·이용 방법이 들어간 소개 카드 한 장을 만들어 보세요.", question: "내가 좋아하는 표현과 사람들이 필요로 하는 정보는 어떻게 달랐나요?" },
  { id: "budget-template", title: "생활 기록 양식 만들기", description: "자주 놓치는 일을 기록하기 쉬운 양식으로 정리해요.", tags: ["organize", "tech", "make"], needs: ["daily", "information"], minutes: 30, experiment: "할 일이나 장보기 목록을 기록할 칸 3개짜리 양식을 만들고 실제 항목 5개로 써보세요.", question: "기록하는 수고보다 찾기 쉬워진 점이 더 컸나요?" },
  { id: "movement-break", title: "내게 맞는 짧은 산책 루틴", description: "부담 없는 움직임이 일상에 어떤 변화를 주는지 살펴봐요.", tags: ["move", "care"], needs: ["wellbeing", "daily"], minutes: 20, experiment: "편안한 속도로 익숙한 길을 잠깐 걷고, 전후의 느낌과 다음에 걷기 좋은 시간을 적어보세요.", question: "이 활동이 즐거웠나요, 아니면 마친 뒤의 느낌이 좋았나요?" },
  { id: "creative-mini", title: "작은 창작물 완성하기", description: "글·그림·손작업 중 하나를 골라 작은 결과물을 만들어요.", tags: ["express", "craft", "make"], needs: ["connection", "wellbeing"], minutes: 40, experiment: "새 준비물 없이 쓸 수 있는 재료로 엽서 한 장이나 짧은 글을 완성하고, 원하면 지인에게 보여주세요.", question: "다른 사람의 반응이 없어도 이 활동을 다시 하고 싶은가요?" },
];
export function makeInitialState(): IkigaiState {
  return { schema: 1, step: 0, view: "questions", goal: "unknown", time: "unknown", likes: [], strengths: [], needs: [], rewards: "unknown", notes: { likes: "", strengths: "", needs: "", rewards: "" }, experiments: {}, savedAt: null };
}
function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("저장 기록 형식을 확인할 수 없어요.");
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== "string" || value.length > 500) throw new Error("메모는 500자 이하여야 해요.");
  return value;
}
function choice<T extends string>(value: unknown, options: readonly Option<T>[]): T {
  if (typeof value !== "string" || !options.some(option => option.id === value)) throw new Error("저장된 선택 항목을 확인할 수 없어요.");
  return value as T;
}
function ids(value: unknown, options: readonly Option[]): string[] {
  if (!Array.isArray(value) || value.length > 100 || !value.every(id => typeof id === "string" && options.some(option => option.id === id))) throw new Error("저장된 활동 태그를 확인할 수 없어요.");
  return [...new Set(value as string[])];
}
/** Accept this version only; return a new snapshot without retaining caller-owned arrays or objects. */
export function normalizeState(raw: unknown): IkigaiState {
  const value = object(raw), notes = object(value.notes), rawExperiments = object(value.experiments);
  if (value.schema !== 1 || !Number.isInteger(value.step) || (value.step as number) < 0 || (value.step as number) > 5 || (value.view !== "questions" && value.view !== "results")) throw new Error("이 탐색의 올바른 저장 기록이 아니에요.");
  if (!(value.savedAt === null || (typeof value.savedAt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.savedAt) && Number.isFinite(Date.parse(value.savedAt)) && new Date(value.savedAt).toISOString() === value.savedAt))) throw new Error("저장 시간을 확인할 수 없어요.");
  const experiments: Record<string, ExperimentRecord> = {};
  for (const [id, rawRecord] of Object.entries(rawExperiments)) {
    if (!activities.some(activity => activity.id === id)) throw new Error("저장된 실험 항목을 확인할 수 없어요.");
    const record = object(rawRecord);
    if (typeof record.tried !== "boolean") throw new Error("실험 기록을 확인할 수 없어요.");
    experiments[id] = { tried: record.tried, enjoyed: choice(record.enjoyed, reflectionOptions), again: choice(record.again, reflectionOptions), helped: choice(record.helped, reflectionOptions), note: text(record.note) };
  }
  return { schema: 1, step: value.step as number, view: value.view, goal: choice(value.goal, goalOptions), time: choice(value.time, timeOptions), likes: ids(value.likes, activityTags), strengths: ids(value.strengths, activityTags), needs: ids(value.needs, needTags), rewards: choice(value.rewards, rewardOptions), notes: { likes: text(notes.likes), strengths: text(notes.strengths), needs: text(notes.needs), rewards: text(notes.rewards) }, experiments, savedAt: value.savedAt as string | null };
}

