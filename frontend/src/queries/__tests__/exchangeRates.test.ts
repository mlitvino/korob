import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadExchangeRates } from '@/queries/exchangeRates';

const rates = { base: 'EUR', date: '2026-11-25', rates: { USD: 1.0935 } };
const online = () =>
  (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => rates });

describe('loadExchangeRates', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps fresh rates and uses them when offline later', async () => {
    online();
    await expect(loadExchangeRates('EUR')).resolves.toEqual(rates);

    // the default mock is offline
    await expect(loadExchangeRates('EUR')).resolves.toEqual(rates);
  });

  it('fails offline when nothing was kept for that base', async () => {
    online();
    await loadExchangeRates('EUR');

    await expect(loadExchangeRates('USD')).rejects.toThrow('Network is off');
  });
});
