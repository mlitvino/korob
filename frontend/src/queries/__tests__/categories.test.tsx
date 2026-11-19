import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import {
  useArchiveCategory,
  useCategories,
  useCreateCategory,
  useRenameCategory,
} from '@/queries/categories';
import { createTestQueryClient } from '@/testing/createTestQueryClient';
import { useTransactions } from '@/queries/transactions';
import type { Category } from '@/types/Category';

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

function useCategoriesApi() {
  return {
    categories: useCategories(),
    transactions: useTransactions(),
    create: useCreateCategory(),
    rename: useRenameCategory(),
    archive: useArchiveCategory(),
  };
}

async function renderLoaded() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const view = renderHook(useCategoriesApi, { wrapper });
  await waitFor(() => expect(view.result.current.categories).toHaveLength(12));
  return view;
}

const byId = (categories: Category[], id: string) =>
  categories.find((category) => category.id === id);

describe('category queries', () => {
  it('lists the built-in categories', async () => {
    const { result } = await renderLoaded();
    expect(result.current.categories.map((c) => c.id)).toContain('expense-food');
  });

  it('shows a created category', async () => {
    const { result } = await renderLoaded();

    const pets = await act(() =>
      result.current.create.mutateAsync({ type: 'expense', name: 'Pets' }));

    // React receives the refreshed query data on a later tick than the mutation promise.
    await waitFor(() => {
      expect(byId(result.current.categories, pets.id)).toMatchObject({ name: 'Pets' });
    });
  });

  it('re-reads transactions as well as categories after a rename', async () => {
    const { result } = await renderLoaded();
    const listTransactions = jest.spyOn(TransactionsRepo, 'list');

    const groceries = await act(() =>
      result.current.rename.mutateAsync({ id: 'expense-food', name: 'Groceries' }));

    await waitFor(() => {
      expect(byId(result.current.categories, groceries.id)).toMatchObject({ name: 'Groceries' });
      expect(byId(result.current.categories, 'expense-food')?.archivedAt).toBeInstanceOf(Date);
    });
    expect(listTransactions).toHaveBeenCalledTimes(1);
  });

  it('shows an archived category as archived', async () => {
    const { result } = await renderLoaded();

    await act(() => result.current.archive.mutateAsync('expense-food'));

    await waitFor(() => {
      expect(byId(result.current.categories, 'expense-food')?.archivedAt).toBeInstanceOf(Date);
    });
  });
});
