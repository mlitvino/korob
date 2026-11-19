import { createQueryClient } from '@/queries/queryClient';

/** The app's query client without garbage-collection timers, so Jest can exit after a test. */
export function createTestQueryClient() {
  const client = createQueryClient();
  const defaults = client.getDefaultOptions();
  client.setDefaultOptions({
    queries: { ...defaults.queries, gcTime: Infinity },
    mutations: { ...defaults.mutations, gcTime: Infinity },
  });
  return client;
}
