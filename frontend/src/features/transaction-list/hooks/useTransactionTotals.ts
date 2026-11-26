import { useMemo } from 'react';

import { useExchangeRates } from '@/queries/exchangeRates';
import type { CurrencyCode } from '@/types/Currency';
import type { Transaction } from '@/types/Transaction';
import { sumInBounds, type Bounds } from '@/utils/period';

/** Income and expense inside the bounds (`null` is all time), converted into `currency`. */
export function useTransactionTotals(
  transactions: Transaction[],
  currency: CurrencyCode,
  bounds: Bounds | null,
) {
  const rates = useExchangeRates();
  return useMemo(
    () => sumInBounds(transactions, currency, bounds, rates),
    [bounds, currency, rates, transactions],
  );
}
