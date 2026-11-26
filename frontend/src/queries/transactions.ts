import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCurrency } from '@/contexts/SettingsContext';
import { TransactionsRepo } from '@/db/transactions.repo';
import { useExchangeRates } from '@/queries/exchangeRates';
import { readAfterMigrations } from '@/queries/queryClient';
import type { CurrencyCode } from '@/types/Currency';
import type { Transaction } from '@/types/Transaction';
import { sumInBounds } from '@/utils/period';

export const transactionsKey = ['transactions'] as const;

const NO_TRANSACTIONS: Transaction[] = [];

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: readAfterMigrations(() => TransactionsRepo.list()),
  });
}

export function useTransactions(): Transaction[] {
  return useTransactionsQuery().data ?? NO_TRANSACTIONS;
}

/** All-time balance in the selected currency; others converted, or named when there is no rate. */
export function useBalance(): { cents: number; missing: CurrencyCode[] } {
  const transactions = useTransactions();
  const currency = useCurrency();
  const rates = useExchangeRates();

  return useMemo(() => {
    const { income, expense, missing } = sumInBounds(transactions, currency, null, rates);
    return { cents: income - expense, missing };
  }, [currency, rates, transactions]);
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaction: Transaction) => TransactionsRepo.insert(transaction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}

export function useUpdateTransactionComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      TransactionsRepo.updateDescription(id, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TransactionsRepo.deleteById(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}

export function useDeleteTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => TransactionsRepo.deleteByIds(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}

export function useClearTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => TransactionsRepo.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}
