import { useMemo } from 'react';

import type { Transaction, TransactionType } from '@/types/Transaction';
import { isWithin, type Bounds } from '@/utils/period';

export type FilterType = 'all' | TransactionType;

export type VisibleTransaction = {
  transaction: Transaction;
  occurredAt: Date;
  showDateSeparator: boolean;
};

export const isTypeFilter = (value: unknown): value is FilterType =>
  value === 'all' || value === 'income' || value === 'expense';

export function useFilteredTransactions(
  transactions: Transaction[],
  filter: FilterType,
  bounds: Bounds | null,
) {
  return useMemo(() => {
    const getTimestamp = (value: string | Date) => {
      const timestamp = new Date(value).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const sortedTransactions = transactions
      .filter((transaction) => filter === 'all' || transaction.type === filter)
      .filter((transaction) => isWithin(transaction, bounds))
      .sort((a, b) => getTimestamp(b.occurredAt) - getTimestamp(a.occurredAt));

    let previousDateKey = '';

    return sortedTransactions.map((transaction) => {
      const occurredAt = new Date(transaction.occurredAt);
      const dateKey = occurredAt.toDateString();
      const showDateSeparator = dateKey !== previousDateKey;
      previousDateKey = dateKey;

      return {
        transaction,
        occurredAt,
        showDateSeparator,
      } satisfies VisibleTransaction;
    });
  }, [bounds, filter, transactions]);
}
