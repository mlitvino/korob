import { periodTotals } from '@/features/home/periodTotals';
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

describe('periodTotals', () => {
  it('is all zeros without transactions', () => {
    expect(periodTotals([], 'EUR', now)).toEqual({
      month: { income: 0, expense: 0, converted: false, missing: [] },
      week: { income: 0, expense: 0, converted: false, missing: [] },
      day: { income: 0, expense: 0, converted: false, missing: [] },
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

    expect(totals.day).toMatchObject({ income: 0, expense: 500 });
    expect(totals.week).toMatchObject({ income: 2000, expense: 500 });
    expect(totals.month).toMatchObject({ income: 2000, expense: 800 });
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

    expect(totals.week).toMatchObject({ income: 0, expense: 0 });
    expect(totals.month).toMatchObject({ income: 100, expense: 400 });
  });

  it('counts a transaction dated later today', () => {
    const totals = periodTotals(
      [tx('evening', 'income', 700, new Date(2026, 10, 25, 22))],
      'EUR',
      now,
    );
    expect(totals.day.income).toBe(700);
  });

  it('leaves out another currency while there is no rate, and says so', () => {
    const totals = periodTotals(
      [
        tx('eur', 'income', 1000, now),
        tx('usd', 'income', 9000, now, 'USD'),
      ],
      'EUR',
      now,
    );

    expect(totals.day.income).toBe(1000);
    expect(totals.day.missing).toEqual(['USD']);
    expect(totals.day.converted).toBe(false);
  });

  it('converts another currency with the rates', () => {
    const totals = periodTotals(
      [
        tx('eur', 'income', 1000, now),
        tx('usd', 'income', 2000, now, 'USD'),
      ],
      'EUR',
      now,
      { base: 'EUR', date: '2026-11-25', rates: { USD: 1.25 } },
    );

    expect(totals.day).toEqual({ income: 2600, expense: 0, converted: true, missing: [] });
  });
});
