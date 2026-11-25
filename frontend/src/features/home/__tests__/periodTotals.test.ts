import { periodBounds, periodTotals } from '@/features/home/periodTotals';
import type { Transaction } from '@/types/Transaction';

// Wednesday 2026-11-25, 15:30 local time
const now = new Date(2026, 10, 25, 15, 30);

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

describe('periodBounds', () => {
  it('starts the week on Monday', () => {
    expect(periodBounds('week', now)).toEqual({
      start: new Date(2026, 10, 23),
      end: new Date(2026, 10, 30),
    });
  });

  it('treats Sunday as the last day of its week', () => {
    const sunday = new Date(2026, 10, 29, 9);
    expect(periodBounds('week', sunday).start).toEqual(new Date(2026, 10, 23));
  });

  it('rolls a week over a month boundary', () => {
    const friday = new Date(2026, 11, 4);
    expect(periodBounds('week', friday).start).toEqual(new Date(2026, 10, 30));
  });

  it('ends December at the start of January', () => {
    expect(periodBounds('month', new Date(2026, 11, 31)).end).toEqual(new Date(2027, 0, 1));
  });
});

describe('periodTotals', () => {
  it('is all zeros without transactions', () => {
    expect(periodTotals([], 'EUR', now)).toEqual({
      month: { income: 0, expense: 0 },
      week: { income: 0, expense: 0 },
      day: { income: 0, expense: 0 },
    });
  });

  it('counts a transaction in every period that contains it', () => {
    const totals = periodTotals(
      [
        tx('today', 'expense', 500, new Date(2026, 10, 25, 8)),
        tx('monday', 'income', 2000, new Date(2026, 10, 23)),
        tx('earlier-month', 'expense', 300, new Date(2026, 10, 2)),
      ],
      'EUR',
      now,
    );

    expect(totals.day).toEqual({ income: 0, expense: 500 });
    expect(totals.week).toEqual({ income: 2000, expense: 500 });
    expect(totals.month).toEqual({ income: 2000, expense: 800 });
  });

  it('leaves out the day before the period and days after it', () => {
    const totals = periodTotals(
      [
        tx('last-sunday', 'income', 100, new Date(2026, 10, 22, 23, 59)),
        tx('last-month', 'income', 200, new Date(2026, 9, 31, 23, 59)),
        tx('next-week', 'expense', 400, new Date(2026, 10, 30)),
        tx('next-month', 'expense', 600, new Date(2026, 11, 1)),
      ],
      'EUR',
      now,
    );

    expect(totals.week).toEqual({ income: 0, expense: 0 });
    expect(totals.month).toEqual({ income: 100, expense: 400 });
  });

  it('counts a transaction dated later today', () => {
    const totals = periodTotals(
      [tx('evening', 'income', 700, new Date(2026, 10, 25, 22))],
      'EUR',
      now,
    );
    expect(totals.day.income).toBe(700);
  });

  it('counts only the selected currency', () => {
    const totals = periodTotals(
      [
        tx('eur', 'income', 1000, now),
        tx('usd', 'income', 9000, now, 'USD'),
      ],
      'EUR',
      now,
    );

    expect(totals.day.income).toBe(1000);
  });
});
