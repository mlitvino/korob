import type { CurrencyCode, ExchangeRates } from '@/types/Currency';

/**
 * Cents of `from` in `to`, rounded to whole cents; `null` when there is no rate.
 * The rates must have `to` as their base.
 */
export function convertCents(
  cents: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRates | null,
): number | null {
  if (from === to) {
    return cents;
  }
  const rate = rates?.base === to ? rates.rates[from] : undefined;
  return rate ? Math.round(cents / rate) : null;
}
