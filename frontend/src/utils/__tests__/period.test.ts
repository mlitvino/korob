import type { Transaction } from '@/types/Transaction';
import {
  formatPeriodTitle,
  isCalendarPeriod,
  periodBounds,
  rangeBounds,
  shiftDate,
  sumInBounds,
} from '@/utils/period';

// Wednesday 2026-11-25, 15:30 local time
const now = new Date(2026, 10, 25, 15, 30);

describe('periodBounds', () => {
  it('covers one day', () => {
    expect(periodBounds('day', now)).toEqual({
      start: new Date(2026, 10, 25),
      end: new Date(2026, 10, 26),
    });
  });

  it('starts the week on Monday', () => {
    expect(periodBounds('week', now)).toEqual({
      start: new Date(2026, 10, 23),
      end: new Date(2026, 10, 30),
    });
  });

  it('treats Sunday as the last day of its week', () => {
    expect(periodBounds('week', new Date(2026, 10, 29, 9)).start).toEqual(new Date(2026, 10, 23));
  });

  it('rolls a week over a month boundary', () => {
    expect(periodBounds('week', new Date(2026, 11, 4)).start).toEqual(new Date(2026, 10, 30));
  });

  it('ends December at the start of January', () => {
    expect(periodBounds('month', new Date(2026, 11, 31)).end).toEqual(new Date(2027, 0, 1));
  });

  it('covers a calendar year', () => {
    expect(periodBounds('year', now)).toEqual({
      start: new Date(2026, 0, 1),
      end: new Date(2027, 0, 1),
    });
  });
});

describe('rangeBounds', () => {
  it('includes the whole last day', () => {
    expect(rangeBounds(new Date(2026, 10, 1, 18), new Date(2026, 10, 15, 3))).toEqual({
      start: new Date(2026, 10, 1),
      end: new Date(2026, 10, 16),
    });
  });
});

describe('shiftDate', () => {
  it('steps days and weeks across a month end', () => {
    expect(shiftDate('day', new Date(2026, 10, 30), 1)).toEqual(new Date(2026, 11, 1));
    expect(shiftDate('week', new Date(2026, 11, 3), -1)).toEqual(new Date(2026, 10, 26));
  });

  it('does not skip a short month', () => {
    expect(shiftDate('month', new Date(2027, 0, 31), 1)).toEqual(new Date(2027, 1, 28));
  });

  it('steps months across a year end', () => {
    expect(shiftDate('month', new Date(2026, 0, 15), -1)).toEqual(new Date(2025, 11, 15));
  });

  it('keeps a leap day inside February when stepping years', () => {
    expect(shiftDate('year', new Date(2028, 1, 29), 1)).toEqual(new Date(2029, 1, 28));
  });
});

describe('formatPeriodTitle', () => {
  const title = (...args: Parameters<typeof formatPeriodTitle>) =>
    // Intl uses narrow and non-breaking spaces around the dash and numbers
    formatPeriodTitle(...args).replace(/\s/g, ' ');

  it('names a day with its weekday', () => {
    expect(title('day', periodBounds('day', now), 'en-US')).toBe('Wed, Nov 25, 2026');
  });

  it('leaves the year out of a week in the current year', () => {
    expect(title('week', periodBounds('week', now), 'en-US', now)).toBe('Nov 23 – Nov 29');
  });

  it('names the year of a week from another year', () => {
    const then = new Date(2024, 10, 25);
    expect(title('week', periodBounds('week', then), 'en-US', now)).toBe('Nov 25 – Dec 1, 2024');
  });

  it('shows both years when a range crosses New Year', () => {
    const bounds = rangeBounds(new Date(2026, 11, 28), new Date(2027, 0, 3));
    expect(title('range', bounds, 'en-US', now)).toBe('Dec 28, 2026 – Jan 3, 2027');
  });

  it('names a month and a year', () => {
    expect(title('month', periodBounds('month', now), 'en-US')).toBe('November 2026');
    expect(title('year', periodBounds('year', now), 'en-US')).toBe('2026');
  });

  it('capitalizes a Russian month name', () => {
    expect(title('month', periodBounds('month', now), 'ru-RU')).toMatch(/^Ноябрь 2026/);
  });
});

describe('sumInBounds', () => {
  const tx = (
    id: string,
    type: Transaction['type'],
    amountCents: number,
    occurredAt: Date,
    currency: Transaction['currency'] = 'EUR',
  ): Transaction => ({
    id,
    type,
    categoryId: `${type}-other`,
    amountCents,
    currency,
    occurredAt,
    createdAt: occurredAt,
    updatedAt: occurredAt,
  });
  const day = periodBounds('day', now);
  const transactions = [
    tx('in', 'income', 1000, now),
    tx('out', 'expense', 300, now),
    tx('usd', 'expense', 999, now, 'USD'),
    tx('yesterday', 'expense', 50, new Date(2026, 10, 24, 23, 59)),
    tx('midnight', 'expense', 70, day.end),
  ];

  it('sums inside the bounds, the end excluded, and lists a currency without a rate', () => {
    expect(sumInBounds(transactions, 'EUR', day)).toEqual({
      income: 1000,
      expense: 300,
      missing: ['USD'],
    });
  });

  it('sums all time without bounds', () => {
    expect(sumInBounds(transactions, 'EUR', null)).toMatchObject({ income: 1000, expense: 420 });
  });

  it('converts other currencies to whole cents with rates based on the target', () => {
    const rates = { base: 'EUR' as const, date: '2026-11-25', rates: { USD: 1.1 } };
    // 999 / 1.1 = 908.18… → 908
    expect(sumInBounds(transactions, 'EUR', day, rates)).toEqual({
      income: 1000,
      expense: 1208,
      missing: [],
    });
  });

  it('does not use rates of another base', () => {
    const rates = { base: 'USD' as const, date: '2026-11-25', rates: { EUR: 0.9 } };
    expect(sumInBounds(transactions, 'EUR', day, rates).missing).toEqual(['USD']);
  });
});

describe('isCalendarPeriod', () => {
  it('accepts only the calendar periods', () => {
    expect(['day', 'week', 'month', 'year'].every(isCalendarPeriod)).toBe(true);
    expect(isCalendarPeriod('all')).toBe(false);
    expect(isCalendarPeriod(undefined)).toBe(false);
  });
});
