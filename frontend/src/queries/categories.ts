import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CategoriesRepo } from '@/db/categories.repo';
import { readAfterMigrations } from '@/queries/queryClient';
import { transactionsKey } from '@/queries/transactions';
import type { Category } from '@/types/Category';
import type { TransactionType } from '@/types/Transaction';

export const categoriesKey = ['categories'] as const;

const NO_CATEGORIES: Category[] = [];

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: readAfterMigrations(() => CategoriesRepo.list()),
  });
}

/** All categories, archived ones included, ordered by type then `sortOrder`. */
export function useCategories(): Category[] {
  return useCategoriesQuery().data ?? NO_CATEGORIES;
}

export function useCategoriesLoading(): boolean {
  return useCategoriesQuery().isPending;
}

/** Categories that can be picked for a new transaction of `type`. */
export function useActiveCategories(type: TransactionType): Category[] {
  const categories = useCategories();
  return useMemo(
    () => categories.filter((c) => c.type === type && c.archivedAt === null),
    [categories, type],
  );
}

/** Lookup by id across all categories, so archived ones still resolve. */
export function useCategoryById(): (id: string) => Category | undefined {
  const categories = useCategories();
  return useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]));
    return (id: string) => byId.get(id);
  }, [categories]);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, name }: { type: TransactionType; name: string }) =>
      CategoriesRepo.create(type, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoriesKey }),
  });
}

export function useRenameCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => CategoriesRepo.rename(id, name),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: categoriesKey }),
      queryClient.invalidateQueries({ queryKey: transactionsKey }),
    ]),
  });
}

export function useArchiveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoriesRepo.archive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoriesKey }),
  });
}
