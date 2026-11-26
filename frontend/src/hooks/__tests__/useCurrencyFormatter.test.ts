import { formatCents } from '@/hooks/useCurrencyFormatter';

describe('formatCents', () => {
  it.each(
    [
      [1250, 'EUR', 'en-US', '€12.50'],
      [99, 'USD', 'en-US', '$0.99'],
      [123456789, 'EUR', 'en-US', '€1,234,567.89'],
      [0, 'EUR', 'en-US', '€0.00'],
    ] as const,
  )('formats %i cents of %s in %s', (cents, currency, locale, expected) => {
    expect(formatCents(cents, currency, locale)).toBe(expected);
  });
});
