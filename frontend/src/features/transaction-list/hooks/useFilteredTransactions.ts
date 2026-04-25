import { useMemo } from 'react';

import type { Transaction, TransactionType } from '@/types/Transaction';

export type FilterType = 'all' | TransactionType;

export type VisibleTransaction = {
  transaction: Transaction;
  createdAt: Date;
  showDateSeparator: boolean;
};

export function useFilteredTransactions(transactions: Transaction[], filter: FilterType) {
  return useMemo(() => {
    const getTimestamp = (value: string | Date) => {
      const timestamp = new Date(value).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const sortedTransactions = transactions
      .filter((transaction) => filter === 'all' || transaction.type === filter)
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

    let previousDateKey = '';

    return sortedTransactions.map((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const dateKey = createdAt.toDateString();
      const showDateSeparator = dateKey !== previousDateKey;
      previousDateKey = dateKey;

      return {
        transaction,
        createdAt,
        showDateSeparator,
      } satisfies VisibleTransaction;
    });
  }, [filter, transactions]);
}
