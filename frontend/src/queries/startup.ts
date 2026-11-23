import { useCategoriesQuery } from '@/queries/categories';
import { useTransactionsQuery } from '@/queries/transactions';

/**
 * The failure of the first load (migrations or the first read), with a retry.
 * A failed refetch while data is already shown is not a startup error.
 */
export function useStartupError() {
  const queries = [useTransactionsQuery(), useCategoriesQuery()];
  const failed = queries.filter((query) => query.isError && query.data === undefined);

  return {
    error: failed[0]?.error ?? null,
    retrying: failed.some((query) => query.isFetching),
    retry: () => failed.forEach((query) => void query.refetch()),
  };
}
