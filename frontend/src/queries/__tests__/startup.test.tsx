import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { useStartup } from '@/queries/startup';
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

function setup() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...renderHook(useStartup, { wrapper }) };
}

describe('useStartup', () => {
  it('is loading, then ready when the data loads', async () => {
    mockInitDb.mockResolvedValue(undefined);
    const { result } = setup();
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('reports the failure once loading ends', async () => {
    mockInitDb.mockRejectedValue(new Error('migration failed'));
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe('error'));
    const startup = result.current;
    expect(startup.status === 'error' && startup.error.message).toBe('migration failed');
  });

  it('shows loading while retrying, then ready', async () => {
    // Both queries wait for the same migration, like the memoized initDb.
    let resolveRetry = () => {};
    const retried = new Promise<void>((resolve) => (resolveRetry = resolve));
    mockInitDb
      .mockRejectedValueOnce(new Error('migration failed'))
      .mockRejectedValueOnce(new Error('migration failed'))
      .mockReturnValue(retried);
    const { result } = setup();
    await waitFor(() => expect(result.current.status).toBe('error'));

    const startup = result.current;
    if (startup.status !== 'error') throw new Error('expected a startup error');
    act(() => startup.retry());
    await waitFor(() => expect(result.current.status).toBe('loading'));
    act(() => resolveRetry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('stays ready when a refetch fails but data is already loaded', async () => {
    mockInitDb.mockResolvedValue(undefined);
    const { result, client } = setup();
    await waitFor(() => expect(result.current.status).toBe('ready'));

    mockInitDb.mockRejectedValue(new Error('later failure'));
    await act(async () => {
      await client.invalidateQueries();
    });
    expect(result.current.status).toBe('ready');
  });
});
