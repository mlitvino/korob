import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import { createTestQueryClient } from '@/testing/createTestQueryClient';
import {
  useAddTransaction,
  useBalance,
  useClearTransactions,
  useTransactions,
  useTransactionsQuery,
} from '@/queries/transactions';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => Promise.resolve(),
}));

beforeEach(async () => {
  // rates kept by one test must not reach the next
  await AsyncStorage.clear();
  mockTestDb = createTestDb();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const at = new Date(2026, 10, 1);
const base = { occurredAt: at, createdAt: at, updatedAt: at, currency: 'EUR' } as const;
const income: Transaction = {
  ...base,
  id: 'income-1',
  type: 'income',
  categoryId: 'income-salary',
  amountCents: 10000,
};
const expense: Transaction = {
  ...base,
  id: 'expense-1',
  type: 'expense',
  categoryId: 'expense-food',
  amountCents: 3000,
};
const usdIncome: Transaction = { ...income, id: 'income-usd', amountCents: 50000, currency: 'USD' };

function useTransactionsApi() {
  return {
    transactions: useTransactions(),
    isLoading: useTransactionsQuery().isPending,
    balance: useBalance(),
    add: useAddTransaction(),
    clear: useClearTransactions(),
  };
}

async function renderLoaded() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </SettingsProvider>
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
    expect(result.current.balance.cents).toBe(10000);
  });

  it('shows an added transaction once it is saved and nets the balance', async () => {
    const { result } = await renderLoaded();

    // React receives the refreshed query data on a later tick than the mutation promise.
    await act(() => result.current.add.mutateAsync(income));
    await waitFor(() => expect(result.current.transactions).toHaveLength(1));

    await act(() => result.current.add.mutateAsync(expense));
    await waitFor(() => expect(result.current.transactions).toHaveLength(2));
    expect(result.current.balance.cents).toBe(7000);
  });

  it('converts another currency into the balance', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ base: 'EUR', date: '2026-11-25', rates: { USD: 1.25 } }),
    });
    await TransactionsRepo.insert(income);
    await TransactionsRepo.insert(usdIncome);

    const { result } = await renderLoaded();

    // 100.00 EUR + 500.00 USD / 1.25
    await waitFor(() => expect(result.current.balance.cents).toBe(50000));
    expect(result.current.balance.missing).toEqual([]);
  });

  it('leaves a currency without a rate out of the balance and names it', async () => {
    await TransactionsRepo.insert(income);
    await TransactionsRepo.insert(usdIncome);

    const { result } = await renderLoaded();

    expect(result.current.balance).toEqual({ cents: 10000, missing: ['USD'] });
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

    await waitFor(() => expect(result.current.transactions).toEqual([]));
    expect(result.current.balance.cents).toBe(0);
  });
});
