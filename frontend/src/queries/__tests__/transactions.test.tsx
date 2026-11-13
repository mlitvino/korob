import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import { createQueryClient } from '@/queries/queryClient';
import {
  useAddTransaction,
  useBalance,
  useClearTransactions,
  useTransactions,
  useTransactionsLoading,
} from '@/queries/transactions';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => Promise.resolve(),
}));

beforeEach(() => {
  mockTestDb = createTestDb();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const at = new Date(2026, 10, 1);
const base = { occurredAt: at, createdAt: at, updatedAt: at, currency: 'EUR' } as const;
const income: Transaction = {
  ...base, id: 'income-1', type: 'income', category: 'salary', amount: 100,
};
const expense: Transaction = {
  ...base, id: 'expense-1', type: 'expense', category: 'food', amount: 30,
};
const usdIncome: Transaction = { ...income, id: 'income-usd', amount: 500, currency: 'USD' };

function useTransactionsApi() {
  return {
    transactions: useTransactions(),
    isLoading: useTransactionsLoading(),
    balance: useBalance('EUR'),
    add: useAddTransaction(),
    clear: useClearTransactions(),
  };
}

async function renderLoaded() {
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const view = renderHook(useTransactionsApi, { wrapper });
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
}

describe('transaction queries', () => {
  it('loads stored transactions', async () => {
    await TransactionsRepo.insert(income);

    const { result } = await renderLoaded();

    expect(result.current.transactions).toEqual([income]);
    expect(result.current.balance).toBe(100);
  });

  it('shows an added transaction once it is saved and nets the balance', async () => {
    const { result } = await renderLoaded();

    await act(() => result.current.add.mutateAsync(income));
    expect(result.current.transactions).toHaveLength(1);

    await act(() => result.current.add.mutateAsync(expense));
    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.balance).toBe(70);
  });

  it('only counts transactions in the requested currency', async () => {
    const { result } = await renderLoaded();

    await act(() => result.current.add.mutateAsync(income));
    await act(() => result.current.add.mutateAsync(usdIncome));

    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.balance).toBe(100);
  });

  it('does not show a transaction that failed to save', async () => {
    const { result } = await renderLoaded();
    jest.spyOn(TransactionsRepo, 'insert').mockRejectedValueOnce(new Error('disk full'));

    await act(async () => {
      await expect(result.current.add.mutateAsync(income)).rejects.toThrow('disk full');
    });

    expect(result.current.transactions).toEqual([]);
  });

  it('stops loading even if the database fails to load', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(TransactionsRepo, 'list').mockRejectedValueOnce(new Error('db down'));

    const { result } = await renderLoaded();

    expect(result.current.transactions).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith('Failed to load data', expect.any(Error));
  });

  it('clears all transactions', async () => {
    await TransactionsRepo.insert(income);
    const { result } = await renderLoaded();

    await act(() => result.current.clear.mutateAsync());

    expect(result.current.transactions).toEqual([]);
    expect(result.current.balance).toBe(0);
  });
});
