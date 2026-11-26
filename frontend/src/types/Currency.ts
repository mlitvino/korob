/** Currencies the app offers. */
export const CURRENCIES = ['EUR', 'USD'] as const;

/** ISO 4217 code, as accepted by `Intl.NumberFormat`. */
export type CurrencyCode = (typeof CURRENCIES)[number];

/** Latest rates for one base currency: 1 `base` buys `rates[code]` of `code`. */
export type ExchangeRates = {
  base: CurrencyCode;
  /** Day the rates were published, `YYYY-MM-DD`. */
  date: string;
  rates: Partial<Record<CurrencyCode, number>>;
};
