import type { ExchangeRates } from '@/types/Currency';
import { convertCents } from '@/utils/currency';

const eurRates: ExchangeRates = { base: 'EUR', date: '2026-11-25', rates: { USD: 1.0935 } };

describe('convertCents', () => {
  it('keeps the same currency as it is, even without rates', () => {
    expect(convertCents(1234, 'EUR', 'EUR', null)).toBe(1234);
  });

  it('divides by the rate of the base and rounds to whole cents', () => {
    // 1000 / 1.0935 = 914.49… → 914
    expect(convertCents(1000, 'USD', 'EUR', eurRates)).toBe(914);
  });

  it('gives null without a rate or with rates of another base', () => {
    expect(convertCents(1000, 'USD', 'EUR', null)).toBeNull();
    expect(convertCents(1000, 'EUR', 'USD', eurRates)).toBeNull();
  });
});
