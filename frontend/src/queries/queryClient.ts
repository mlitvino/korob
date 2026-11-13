import { QueryCache, QueryClient } from '@tanstack/react-query';

import { initDb } from '@/db/storage';

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => console.warn('Failed to load data', error),
    }),
    defaultOptions: {
      queries: { staleTime: Infinity, retry: false, networkMode: 'always' },
      mutations: { retry: false, networkMode: 'always' },
    },
  });
}

export const queryClient = createQueryClient();

export function readAfterMigrations<T>(read: () => Promise<T>) {
  return async () => {
    await initDb();
    return read();
  };
}
