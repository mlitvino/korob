import type { CurrencyCode, ExchangeRates } from '@/types/Currency';
import { convertCents } from '@/utils/currency';
import type { Transaction, TransactionType } from '@/types/Transaction';

export const CALENDAR_PERIODS = ['day', 'week', 'month', 'year'] as const;

/** A period that contains one date. */
export type CalendarPeriod = (typeof CALENDAR_PERIODS)[number];

/** How the transaction list is limited by date. */
export type PeriodMode = CalendarPeriod | 'range' | 'all';

/** Local-time limits; the end is exclusive. */
export type Bounds = { start: Date; end: Date };

export const isCalendarPeriod = (value: unknown): value is CalendarPeriod =>
  CALENDAR_PERIODS.includes(value as CalendarPeriod);

/** Whether the transaction happened inside the bounds; `null` bounds are all time. */
export const isWithin = ({ occurredAt }: Transaction, bounds: Bounds | null) =>
  !bounds || (occurredAt >= bounds.start && occurredAt < bounds.end);

/** Income and expense in one currency, in cents. */
export type Totals = Record<TransactionType, number> & {
  /** Some amounts were converted from another currency at the latest rate. */
  converted: boolean;
  /** Currencies left out because there is no rate for them yet. */
  missing: CurrencyCode[];
};

/**
 * Income and expense inside the bounds (`null` is all time), in `currency`; other currencies
 * are converted with `rates` (based on `currency`) or, without a rate, listed as missing.
 */
export function sumInBounds(
  transactions: Transaction[],
  currency: CurrencyCode,
  bounds: Bounds | null,
  rates: ExchangeRates | null = null,
): Totals {
  const totals: Totals = { income: 0, expense: 0, converted: false, missing: [] };
  for (const transaction of transactions) {
    if (!isWithin(transaction, bounds)) {
      continue;
    }
    const cents = convertCents(transaction.amountCents, transaction.currency, currency, rates);
    if (cents === null) {
      if (!totals.missing.includes(transaction.currency)) {
        totals.missing.push(transaction.currency);
      }
      continue;
    }
    totals[transaction.type] += cents;
    totals.converted ||= transaction.currency !== currency;
  }
  return totals;
}

const DAY_MONTH: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
const FULL_DAY: Intl.DateTimeFormatOptions = { ...DAY_MONTH, year: 'numeric' };

/** Bounds of the period containing `date`. Weeks start on Monday. */
export function periodBounds(period: CalendarPeriod, date: Date): Bounds {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if (period === 'year') {
    return { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
  }

  if (period === 'month') {
    return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) };
  }

  if (period === 'week') {
    const sinceMonday = (date.getDay() + 6) % 7;
    return {
      start: new Date(year, month, day - sinceMonday),
      end: new Date(year, month, day - sinceMonday + 7),
    };
  }

  return { start: new Date(year, month, day), end: new Date(year, month, day + 1) };
}

/** Bounds from the first day through the whole last day. */
export function rangeBounds(first: Date, last: Date): Bounds {
  return { start: periodBounds('day', first).start, end: periodBounds('day', last).end };
}

/** Moves a date by whole periods; a day that the target month lacks becomes its last day. */
export function shiftDate(period: CalendarPeriod, date: Date, steps: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if (period === 'day' || period === 'week') {
    return new Date(year, month, day + steps * (period === 'week' ? 7 : 1));
  }

  const targetYear = period === 'year' ? year + steps : year;
  const targetMonth = period === 'month' ? month + steps : month;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();

  return new Date(targetYear, targetMonth, Math.min(day, lastDay));
}

/** `month` → `Month`: Finnish and Russian write month names in lower case. */
export function capitalize(text: string) {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function formatPeriodTitle(
  mode: Exclude<PeriodMode, 'all'>,
  { start, end }: Bounds,
  locale: string,
  today = new Date(),
): string {
  if (mode === 'year') {
    return String(start.getFullYear());
  }

  if (mode === 'month') {
    return capitalize(start.toLocaleDateString(locale, { month: 'long', year: 'numeric' }));
  }

  if (mode === 'day') {
    return capitalize(start.toLocaleDateString(locale, { ...FULL_DAY, weekday: 'short' }));
  }

  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1);
  const sameYear = start.getFullYear() === last.getFullYear();
  // the current year goes without saying, which keeps the title short
  const thisYear = sameYear && last.getFullYear() === today.getFullYear();
  const first = start.toLocaleDateString(locale, sameYear ? DAY_MONTH : FULL_DAY);

  return `${first} – ${last.toLocaleDateString(locale, thisYear ? DAY_MONTH : FULL_DAY)}`;
}
