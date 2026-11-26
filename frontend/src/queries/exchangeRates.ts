import { useQuery } from '@tanstack/react-query';

import { fetchExchangeRates, parseExchangeRates } from '@/api/exchangeRates';
import { useCurrency } from '@/contexts/SettingsContext';
import { loadJson, saveJson, STORAGE_KEYS } from '@/storage/persist';
import type { CurrencyCode, ExchangeRates } from '@/types/Currency';

type RatesCache = Partial<Record<CurrencyCode, ExchangeRates>>;

const STALE_MS = 12 * 60 * 60 * 1000;

const readCache = () => loadJson<RatesCache>(STORAGE_KEYS.exchangeRates).catch(() => null);

/** Fresh rates when online (kept for later); the last kept ones when offline. */
export async function loadExchangeRates(base: CurrencyCode): Promise<ExchangeRates> {
  try {
    const fresh = await fetchExchangeRates(base);
    const cache = (await readCache()) ?? {};
    await saveJson(STORAGE_KEYS.exchangeRates, { ...cache, [base]: fresh }).catch((error) => {
      console.warn('Failed to keep exchange rates', error);
    });
    return fresh;
  } catch (error) {
    const cached = (await readCache())?.[base];
    if (!cached) {
      throw error;
    }
    return parseExchangeRates(cached, base);
  }
}

/** Rates from the selected currency to the others; `null` until any are known. */
export function useExchangeRates(): ExchangeRates | null {
  const base = useCurrency();
  const query = useQuery({
    queryKey: ['exchangeRates', base],
    queryFn: () => loadExchangeRates(base),
    staleTime: STALE_MS,
  });
  return query.data ?? null;
}
