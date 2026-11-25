import type { CurrencyCode } from '@/types/Currency';
import type { Transaction, TransactionType } from '@/types/Transaction';

export type Period = 'month' | 'week' | 'day';

export const PERIODS: readonly Period[] = ['month', 'week', 'day'];

export type PeriodTotals = Record<Period, Record<TransactionType, number>>;

/** Local-time bounds of the period containing `now`; the end is exclusive. Weeks start on Monday. */
export function periodBounds(period: Period, now: Date): { start: Date; end: Date } {
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  if (period === 'month') {
    return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) };
  }

  if (period === 'week') {
    const sinceMonday = (now.getDay() + 6) % 7;
    return {
      start: new Date(year, month, date - sinceMonday),
      end: new Date(year, month, date - sinceMonday + 7),
    };
  }

  return { start: new Date(year, month, date), end: new Date(year, month, date + 1) };
}

/** Sums income and expense cents per period for one currency, by `occurredAt`. */
export function periodTotals(
  transactions: Transaction[],
  currency: CurrencyCode,
  now: Date,
): PeriodTotals {
  const totals: PeriodTotals = {
    month: { income: 0, expense: 0 },
    week: { income: 0, expense: 0 },
    day: { income: 0, expense: 0 },
  };
  const bounds = PERIODS.map((period) => ({ period, ...periodBounds(period, now) }));

  for (const transaction of transactions) {
    if (transaction.currency !== currency) {
      continue;
    }

    for (const { period, start, end } of bounds) {
      if (transaction.occurredAt >= start && transaction.occurredAt < end) {
        totals[period][transaction.type] += transaction.amountCents;
      }
    }
  }

  return totals;
}
