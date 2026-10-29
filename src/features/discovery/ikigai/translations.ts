import type { Language } from "@/lib/i18n";
import {
  activities, activityTags, goalOptions, needTags, reflectionOptions, rewardOptions, timeOptions,
  type Activity, type Option,
} from "./model";

export function ikigaiText(language: Language, ko: string, en: string): string {
  return language === "en" ? en : ko;
}

function translatedOptions<T extends string>(options: readonly Option<T>[], labels: Record<T, string>): readonly Option<T>[] {
  return options.map(option => ({
    ...option, label: labels[option.id],
    ...(option.description ? { description: "Your own experience across the activities you selected." } : {}),
  }));
}
const enOptions = {
  goalOptions: translatedOptions(goalOptions, { enjoy: "Find something to enjoy", strength: "Discover what I do well", work: "Explore work or a side project", unknown: "I'm not sure yet" }),
  timeOptions: translatedOptions(timeOptions, { short: "Up to 30 minutes", medium: "30–60 minutes", long: "An hour or more", unknown: "I'm not sure yet" }),
  activityTags: translatedOptions(activityTags, { explain: "Explaining", make: "Creating", organize: "Organizing", research: "Investigating", care: "Caring for others", express: "Expressing ideas", together: "Doing things together", move: "Moving", craft: "Working with my hands", game: "Playing games", tech: "Using technology", nature: "Observing nature" }),
  needTags: translatedOptions(needTags, { beginners: "Challenges for beginners", information: "Finding information or making choices", daily: "Everyday hassles", connection: "Few chances to connect", learning: "Difficulties with learning", accessibility: "Things that are hard to access or use", environment: "Waste of resources", wellbeing: "Not enough rest or energy", local: "Problems in my neighborhood", "small-business": "Helping small shops communicate or operate" }),
  rewardOptions: translatedOptions(rewardOptions, { experienced: "I've received payment or a reward", seen: "I've seen people pay for similar work", unknown: "I'm not sure yet", "not-interested": "I'm not interested in earning money from this" }),
  reflectionOptions: translatedOptions(reflectionOptions, { yes: "Yes", unsure: "Somewhat / unsure", no: "No", unknown: "I don't know yet" }),
};
export function getIkigaiOptions(language: Language = "ko") {
  return language === "en" ? enOptions : { activityTags, goalOptions, needTags, reflectionOptions, rewardOptions, timeOptions };
}

type ActivityText = Pick<Activity, "title" | "description" | "experiment" | "question">;
const enActivityText: Record<string, ActivityText> = {
  "game-guide": { title: "Make a beginner's game guide", description: "Explain a few things that can trip up someone who is just starting.", experiment: "Write five beginner tips for a game you know, then ask one interested person whether they are easy to understand.", question: "Which did you enjoy more: playing the game or explaining it?" },
  "room-system": { title: "Organize one small space", description: "Find a way to keep a desk or drawer easy to use.", experiment: "Organize one drawer and write down three rules that make it easier to find things again.", question: "Would you rather repeat the organizing process or enjoy the finished space?" },
  "nature-log": { title: "Keep a neighborhood nature log", description: "Notice and record small changes close to home.", experiment: "Observe three plants or views along a familiar route and briefly record what looks different.", question: "Would you like to observe the same place again next week?" },
  "digital-help": { title: "Help someone use a digital tool", description: "Explore one basic app feature with someone who wants your help.", experiment: "Ask someone which feature they want help with. Explain it in three steps they can follow themselves. Let them enter their own passwords.", question: "How did it feel to explain things at the other person's pace?" },
  "skill-note": { title: "Explain something on one page", description: "Turn something you recently learned into a guide another person can follow.", experiment: "Explain one concept you recently learned on a single page, with an example. Ask someone new to it whether it makes sense.", question: "Which part of your explanation did someone actually find helpful?" },
  "walk-map": { title: "Make a local walking guide", description: "Share the features of a route you have walked yourself.", experiment: "Walk a familiar, safe route. Note its distance, places to rest, and things to watch out for, then make a short guide.", question: "Who might find this walking guide useful?" },
  "care-checkin": { title: "Find one small way to help", description: "Ask someone close to you what they need and try one manageable task.", experiment: "Ask someone about one hassle they face this week. Only if they want help, agree on something you can do within 20 minutes.", question: "Was the help they wanted the same as the help you expected?" },
  "photo-story": { title: "Tell a short story with photos", description: "Choose everyday scenes and express your own perspective.", experiment: "Choose three photos that do not reveal private information. Write one sentence telling the story behind each scene.", question: "Which part did you enjoy most: taking photos, choosing them, or writing?" },
  "repair-start": { title: "Learn to care for everyday objects", description: "Learn basic upkeep that helps a small item last longer.", experiment: "Choose an item that requires no electrical work or sharp tools. Read its official care instructions and try simple cleaning or upkeep.", question: "Would you like to learn more about solving problems with your hands?" },
  "community-meet": { title: "Host a small hobby meetup", description: "Put together a short gathering with people who share an interest.", experiment: "Choose a topic with one or two friends who want to join. Talk for 30 minutes, with 15 minutes each for preparation and wrapping up.", question: "Which suited you better: taking part or organizing the gathering?" },
  "simple-tool": { title: "Make a small tool for a routine task", description: "Reduce one repeated task with a simple template or feature.", experiment: "Write down the steps in a repeated task. Use a template or function in a familiar tool to remove just one step. No new installation is needed.", question: "What did you notice: enjoyment in making it, time actually saved, or both?" },
  "choice-comparison": { title: "Create a comparison that helps a choice", description: "Check information and make the differences easy to understand.", experiment: "Find official information for three familiar tools or hobby options. Compare them using the same criteria and record the date you checked.", question: "Which did you prefer: finding information or explaining the differences?" },
  "reading-circle": { title: "Read and discuss a short piece", description: "Read something together and listen to each other's thoughts.", experiment: "Read one short, publicly available piece with a friend. Choose two questions you are curious about and discuss them.", question: "How did reading alone feel different from discussing it together?" },
  "recipe-card": { title: "Make a recipe instruction card", description: "Record a practical skill you have tried so someone can follow it.", experiment: "Make a familiar, simple dish. Note the ingredients and any confusing steps, then turn them into a single instruction card.", question: "Which would you like to keep doing: making it yourself or showing others how?" },
  "local-interview": { title: "Listen to a neighborhood problem", description: "Hear what people experience before deciding on a solution.", experiment: "Ask one willing acquaintance about frustrating moments in the neighborhood. Summarize three problems without personal information.", question: "Which problem was different from what you expected?" },
  "accessibility-check": { title: "Make instructions easier to read", description: "Revise familiar instructions so they are easier to understand.", experiment: "Take instructions you wrote yourself. Shorten long sentences, split the steps, and ask someone whether the result is easier to follow.", question: "Which change actually helped the reader?" },
  "small-shop-card": { title: "Practice making a small-shop info card", description: "Communicate useful information through a short text and layout.", experiment: "Invent a fictional shop. Make one card showing who it serves, what makes it useful, and how to use it.", question: "How did your preferred style differ from the information people needed?" },
  "budget-template": { title: "Create an everyday tracking template", description: "Make an easy way to record things you often forget.", experiment: "Create a three-field template for tasks or a shopping list. Try it with five real entries.", question: "Did finding things more easily outweigh the effort of keeping a record?" },
  "movement-break": { title: "Try a short walking routine", description: "Notice how comfortable movement affects your day.", experiment: "Take a short walk at a comfortable pace on a familiar route. Note how you feel before and after, and a good time for the next walk.", question: "Did you enjoy the activity itself or the way you felt afterward?" },
  "creative-mini": { title: "Finish a small creative piece", description: "Choose writing, drawing, or a craft and make something small.", experiment: "Use materials you already have to finish a postcard or a short piece of writing. Show someone if you want to.", question: "Would you want to do this again even without anyone else's reaction?" },
};
/** Preserve the catalog's IDs, matching data, durations, and tie-breaking order. */
export function getIkigaiActivities(language: Language = "ko"): readonly Activity[] {
  return language === "en" ? activities.map(activity => ({ ...activity, ...enActivityText[activity.id] })) : activities;
}

export function getIkigaiWizardCopy(language: Language = "ko") {
  return language === "en" ? {
    steps: ["Start", "What I enjoy", "What I've tried", "Problems to help with", "Rewards", "Review"],
    headings: ["What would you like to explore?", "What do you lose track of time doing?", "What have you tried or been asked to do?", "Whose difficulties catch your attention?", "Have your activities led to a reward?", "Shall we review your answers?"],
    help: ["Choose your current interest and the time you can try this week. You can change them later.", "Choose any activities you recently did by choice or would want to do again without being asked.", "Think of things you have completed yourself or received positive feedback about. This is not an ability assessment.", "Choose difficulties you would like to help with or understand better. It's fine if none come to mind yet.", "Have you received money or another reward? You can explore what you enjoy without trying to earn from it.", "Recommendations use the options you select. Anything you write stays as your own note and is not interpreted automatically."],
    categoryLabels: { try: "Build on experience", learn: "Explore an interest", explore: "Try something new" },
    domainNames: { likes: "What I enjoy", strengths: "What I've tried", needs: "Problems I want to help with", rewards: "Possibility of a reward" },
    signalLabel: { matched: "Linked to your choices", unconfirmed: "Not yet confirmed", "self-reported": "Your own report", "not-needed": "Not a condition this time" },
  } : {
    steps: ["시작", "좋아하는 것", "해본 일", "돕고 싶은 문제", "보상", "답변 확인"],
    headings: ["지금, 무엇을 찾아보고 싶나요?", "나도 모르게 시간을 쓰는 일은?", "직접 해봤거나 부탁받은 일은?", "누구의 어떤 불편이 눈에 들어오나요?", "보상으로 이어진 경험이 있나요?", "내 답변을 한번 살펴볼까요?"],
    help: ["지금의 관심사와 이번 주에 써볼 시간을 골라주세요. 나중에 바꿔도 괜찮아요.", "최근에 자발적으로 했거나, 누가 시키지 않아도 다시 하고 싶은 활동을 모두 골라보세요.", "칭찬받은 경험이나 직접 완성해 본 일을 떠올려보세요. 능력을 평가하는 질문은 아니에요.", "해결해 주고 싶은 어려움, 더 알아보고 싶은 문제를 골라보세요. 아직 없어도 괜찮아요.", "돈이나 대가를 받은 경험이 있나요? 수익화에 관심이 없어도 좋아하는 일을 찾아볼 수 있어요.", "추천에는 선택한 항목을 사용해요. 직접 적은 경험은 해석하지 않고 나만의 메모로 남겨요."],
    categoryLabels: { try: "경험을 이어보기", learn: "관심을 넓혀보기", explore: "새롭게 탐색하기" },
    domainNames: { likes: "좋아하는 것", strengths: "직접 해본 일", needs: "돕고 싶은 문제", rewards: "보상 가능성" },
    signalLabel: { matched: "선택과 연결", unconfirmed: "확인 전", "self-reported": "본인 답변", "not-needed": "이번 조건 아님" },
  };
}
