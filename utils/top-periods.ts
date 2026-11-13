const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const TOP_PERIOD_DAYS = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
  all: null,
} as const;

export type TopPeriod = keyof typeof TOP_PERIOD_DAYS;

export function getTopPeriodStart(period: TopPeriod, now = new Date()): Date | null {
  const days = TOP_PERIOD_DAYS[period];

  return days == null ? null : new Date(now.getTime() - days * DAY_IN_MS);
}
