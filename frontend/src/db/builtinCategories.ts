import type { TransactionCategory, TransactionType } from '@/types/Transaction';

// Id of a built-in category row, as seeded by migration 0004_add_categories.
export function builtinCategoryId(type: TransactionType, key: TransactionCategory) {
  return `${type}-${key}`;
}
