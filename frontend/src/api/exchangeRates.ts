import { CURRENCIES, type CurrencyCode, type ExchangeRates } from '@/types/Currency';

/** Frankfurter: free, no key; rates from central banks, updated during the day. */
const RATES_URL = 'https://api.frankfurter.dev/v1/latest';
const TIMEOUT_MS = 10_000;

/** Latest rates from `base` to every other currency the app offers. */
export async function fetchExchangeRates(base: CurrencyCode): Promise<ExchangeRates> {
  const symbols = CURRENCIES.filter((code) => code !== base).join(',');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${RATES_URL}?base=${base}&symbols=${symbols}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Exchange rates request failed with ${response.status}`);
    }
    return parseExchangeRates(await response.json(), base);
  } finally {
    clearTimeout(timer);
  }
}

/** Checks a reply (or a cached copy); keeps only known currencies with a positive rate. */
export function parseExchangeRates(body: unknown, base: CurrencyCode): ExchangeRates {
  const reply = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
  const { date, rates } = reply;

  if (reply.base !== base || typeof date !== 'string' || typeof rates !== 'object' || !rates) {
    throw new Error('Exchange rates reply has an unexpected shape');
  }

  const valid: ExchangeRates['rates'] = {};
  for (const code of CURRENCIES) {
    const rate = (rates as Record<string, unknown>)[code];
    if (code !== base && typeof rate === 'number' && Number.isFinite(rate) && rate > 0) {
      valid[code] = rate;
    }
  }
  return { base, date, rates: valid };
}
