import { useCategoriesQuery } from '@/queries/categories';
import { useTransactionsQuery } from '@/queries/transactions';

export type Startup =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'ready' };

/**
 * State of the first load (migrations and the first read). A retry shows as loading.
 * A failed refetch while data is already shown is not a startup error.
 */
export function useStartup(): Startup {
  const queries = [useTransactionsQuery(), useCategoriesQuery()];
  const failed = queries.filter((query) => query.isError && query.data === undefined);

  if (queries.some((query) => query.isPending) || failed.some((query) => query.isFetching)) {
    return { status: 'loading' };
  }
  const first = failed[0];
  if (first) {
    return {
      status: 'error',
      error: first.error,
      retry: () => failed.forEach((query) => void query.refetch()),
    };
  }
  return { status: 'ready' };
}
