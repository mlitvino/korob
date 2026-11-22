import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TransactionsRepo } from '@/db/transactions.repo';
import { readAfterMigrations } from '@/queries/queryClient';
import type { CurrencyCode } from '@/types/Currency';
import type { Transaction } from '@/types/Transaction';

export const transactionsKey = ['transactions'] as const;

const NO_TRANSACTIONS: Transaction[] = [];

function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: readAfterMigrations(() => TransactionsRepo.list()),
  });
}

export function useTransactions(): Transaction[] {
  return useTransactionsQuery().data ?? NO_TRANSACTIONS;
}

export function useTransactionsLoading(): boolean {
  return useTransactionsQuery().isPending;
}

export function useBalance(currency: CurrencyCode): number {
  const transactions = useTransactions();

  return useMemo(() => transactions
    .filter((t) => t.currency === currency)
    .reduce(
      (balance, t) => (t.type === 'income' ? balance + t.amountCents : balance - t.amountCents),
      0,
    ), [transactions, currency]);
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

export function useClearTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => TransactionsRepo.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsKey }),
  });
}
