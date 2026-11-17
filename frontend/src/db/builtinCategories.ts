import type { TransactionCategory, TransactionType } from '@/types/Transaction';

/** Built-in income keys in seed order (migration 0004_add_categories). */
export const INCOME_CATEGORIES = [
  'salary',
  'freelance',
  'gift',
  'investment',
  'other',
] as const satisfies readonly TransactionCategory[];

/** Built-in expense keys in seed order (migration 0004_add_categories). */
export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'shopping',
  'health',
  'other',
] as const satisfies readonly TransactionCategory[];

// Id of a built-in category row, as seeded by migration 0004_add_categories.
export function builtinCategoryId(type: TransactionType, key: TransactionCategory) {
  return `${type}-${key}`;
}
