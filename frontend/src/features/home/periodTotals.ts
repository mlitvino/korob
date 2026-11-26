import type { CurrencyCode, ExchangeRates } from '@/types/Currency';
import type { Transaction } from '@/types/Transaction';
import { periodBounds, sumInBounds, type CalendarPeriod, type Totals } from '@/utils/period';

/** Periods the Home card shows, each one a link to the list. */
export type Period = Exclude<CalendarPeriod, 'year'>;

export const PERIODS: readonly Period[] = ['month', 'week', 'day'];

export type PeriodTotals = Record<Period, Totals>;

/** Income and expense per period in `currency`, by `occurredAt`; others converted with `rates`. */
export function periodTotals(
  transactions: Transaction[],
  currency: CurrencyCode,
  now: Date,
  rates: ExchangeRates | null = null,
): PeriodTotals {
  const sum = (period: Period) =>
    sumInBounds(transactions, currency, periodBounds(period, now), rates);
  return { month: sum('month'), week: sum('week'), day: sum('day') };
}
