const labels = {
  ko: {
    schedule: "일정 안내", upcoming: "시작 예정", ended: "공지 기간 종료",
    start: "시작일 · 시각 미공지", end: "종료일 · 시각 미공지", active: "공지 일정 진행 중",
  },
  en: {
    schedule: "Event schedule", upcoming: "Upcoming", ended: "Announced period ended",
    start: "Start date · exact time not announced", end: "End date · exact time not announced", active: "Within announced dates",
  },
};

export function periodStatus(today: string, startsOn: string, endsOn: string, language: "ko" | "en" = "ko") {
  const text = labels[language];
  if (!today) return { label: text.schedule, tone: "neutral" } as const;
  if (today < startsOn) return { label: text.upcoming, tone: "neutral" } as const;
  if (today > endsOn) return { label: text.ended, tone: "ended" } as const;
  if (today === startsOn) return { label: text.start, tone: "neutral" } as const;
  if (today === endsOn) return { label: text.end, tone: "neutral" } as const;
  return { label: text.active, tone: "live" } as const;
}
