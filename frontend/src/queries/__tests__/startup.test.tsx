import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { useCategoriesLoading } from '@/queries/categories';
import { useStartupError } from '@/queries/startup';
import { useTransactionsLoading } from '@/queries/transactions';
import { createTestQueryClient } from '@/testing/createTestQueryClient';

let mockTestDb: TestDb;
const mockInitDb = jest.fn<Promise<void>, []>();

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => mockInitDb(),
}));

beforeEach(() => {
  mockTestDb = createTestDb();
  mockInitDb.mockReset();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

function useStartup() {
  const startup = useStartupError();
  const transactionsLoading = useTransactionsLoading();
  const categoriesLoading = useCategoriesLoading();
  return { ...startup, loading: transactionsLoading || categoriesLoading };
}

function setup() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...renderHook(useStartup, { wrapper }) };
}

describe('useStartupError', () => {
  it('has no error when the data loads', async () => {
    mockInitDb.mockResolvedValue(undefined);
    const { result } = setup();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('reports the failure once loading ends', async () => {
    mockInitDb.mockRejectedValue(new Error('migration failed'));
    const { result } = setup();
    await waitFor(() => expect(result.current.error?.message).toBe('migration failed'));
    expect(result.current.loading).toBe(false);
  });

  it('retry reloads and clears the error', async () => {
    mockInitDb.mockRejectedValueOnce(new Error('migration failed')).mockResolvedValue(undefined);
    const { result } = setup();
    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.retrying).toBe(false);
  });

  it('keeps the screen working when a refetch fails but data is already loaded', async () => {
    mockInitDb.mockResolvedValue(undefined);
    const { result, client } = setup();
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockInitDb.mockRejectedValue(new Error('later failure'));
    await act(async () => {
      await client.invalidateQueries();
    });
    expect(result.current.error).toBeNull();
  });
});
