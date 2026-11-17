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

const BUILTIN_KEYS: Record<TransactionType, readonly TransactionCategory[]> = {
  income: INCOME_CATEGORIES,
  expense: EXPENSE_CATEGORIES,
};

// Id of a built-in category row, as seeded by migration 0004_add_categories.
export function builtinCategoryId(type: TransactionType, key: TransactionCategory) {
  return `${type}-${key}`;
}

/** The built-in key for a built-in id (`expense-food` → `food`); null for custom ids. */
export function builtinKeyFromId(id: string): TransactionCategory | null {
  for (const type of ['income', 'expense'] as const) {
    const prefix = `${type}-`;
    if (id.startsWith(prefix)) {
      const key = id.slice(prefix.length) as TransactionCategory;
      if (BUILTIN_KEYS[type].includes(key)) {
        return key;
      }
    }
  }
  return null;
}
