import { fetchExchangeRates, parseExchangeRates } from '@/api/exchangeRates';

const reply = (body: unknown, ok = true) =>
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 503,
    json: async () => body,
  });

describe('fetchExchangeRates', () => {
  it('asks for the other currencies against the base', async () => {
    reply({ amount: 1, base: 'EUR', date: '2026-11-25', rates: { USD: 1.0935 } });

    await expect(fetchExchangeRates('EUR')).resolves.toEqual({
      base: 'EUR',
      date: '2026-11-25',
      rates: { USD: 1.0935 },
    });
    expect(global.fetch).toHaveBeenLastCalledWith(
      'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD',
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it('fails on an error status', async () => {
    reply({}, false);
    await expect(fetchExchangeRates('EUR')).rejects.toThrow('503');
  });
});

describe('parseExchangeRates', () => {
  it('drops unknown currencies and rates that are not positive numbers', () => {
    const body = { base: 'USD', date: '2026-11-25', rates: { EUR: 0, GBP: 0.8, USD: 1 } };
    expect(parseExchangeRates(body, 'USD').rates).toEqual({});
    expect(parseExchangeRates({ ...body, rates: { EUR: '0.9' } }, 'USD').rates).toEqual({});
  });

  it('refuses a reply for another base or without a date', () => {
    expect(() => parseExchangeRates({ base: 'USD', date: 'x', rates: {} }, 'EUR')).toThrow();
    expect(() => parseExchangeRates({ base: 'EUR', rates: {} }, 'EUR')).toThrow();
    expect(() => parseExchangeRates(null, 'EUR')).toThrow();
  });
});
