import { resources } from '@/locales';
import type { Category } from '@/types/Category';
import type { TransactionType } from '@/types/Transaction';

export type CategoryNameError = 'empty' | 'duplicate';

const normalize = (name: string) => name.trim().toLocaleLowerCase();

/** Every label a category is shown under: a custom name, or a built-in's name in each language. */
const labelsOf = (category: Category): string[] => {
  if (category.key === null) {
    return [category.name];
  }
  const key = category.key;
  return Object.values(resources).map((locale) => locale.translation.category[key]);
};

/**
 * Checks a new name for a category of `type`. Duplicates are compared without case
 * against active categories of the same type, skipping `excludeId` (the one being renamed).
 */
export function validateCategoryName(
  name: string,
  type: TransactionType,
  categories: Category[],
  excludeId?: string,
): CategoryNameError | null {
  const candidate = normalize(name);
  if (!candidate) {
    return 'empty';
  }

  const taken = categories
    .filter((c) => c.type === type && c.archivedAt === null && c.id !== excludeId)
    .flatMap(labelsOf)
    .map(normalize);

  return taken.includes(candidate) ? 'duplicate' : null;
}
