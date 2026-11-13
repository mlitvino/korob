import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CategoriesRepo } from '@/db/categories.repo';
import { readAfterMigrations } from '@/queries/queryClient';
import { transactionsKey } from '@/queries/transactions';
import type { Category } from '@/types/Category';
import type { TransactionType } from '@/types/Transaction';

export const categoriesKey = ['categories'] as const;

const NO_CATEGORIES: Category[] = [];

export function useCategories(): Category[] {
  const { data } = useQuery({
    queryKey: categoriesKey,
    queryFn: readAfterMigrations(() => CategoriesRepo.list()),
  });
  return data ?? NO_CATEGORIES;
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
