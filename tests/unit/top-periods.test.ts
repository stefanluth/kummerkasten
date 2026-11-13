import { describe, expect, it } from 'vitest';

import { getTopPeriodStart, TOP_PERIOD_DAYS } from '@/utils/top-periods';

describe('getTopPeriodStart', () => {
  const now = new Date('2026-11-13T12:00:00.000Z');

  it.each([
    [1, 'day'],
    [7, 'week'],
    [30, 'month'],
    [365, 'year'],
  ] as const)('uses a rolling %i-day window for %s', (days, period) => {
    expect(getTopPeriodStart(period, now)?.getTime()).toBe(now.getTime() - days * 24 * 60 * 60 * 1000);
  });

  it('does not set a lower bound for all-time posts', () => {
    expect(getTopPeriodStart('all', now)).toBeNull();
    expect(TOP_PERIOD_DAYS.all).toBeNull();
  });
});
