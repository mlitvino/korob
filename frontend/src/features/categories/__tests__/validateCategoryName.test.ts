import { validateCategoryName } from '@/features/categories/validateCategoryName';
import type { Category } from '@/types/Category';

const builtin = (id: string, key: 'food' | 'salary', type: 'income' | 'expense'): Category => ({
  id, type, key, name: null, sortOrder: 0, archivedAt: null,
});
const custom = (id: string, name: string, archived = false): Category => ({
  id, type: 'expense', key: null, name, sortOrder: 1, archivedAt: archived ? new Date() : null,
});

const categories: Category[] = [
  builtin('expense-food', 'food', 'expense'),
  builtin('income-salary', 'salary', 'income'),
  custom('pets', 'Pets'),
  custom('old', 'Old stuff', true),
];

describe('validateCategoryName', () => {
  it('rejects empty names', () => {
    expect(validateCategoryName('   ', 'expense', categories)).toBe('empty');
  });

  it('rejects a custom name of the same type, ignoring case and spaces', () => {
    expect(validateCategoryName('  pets ', 'expense', categories)).toBe('duplicate');
  });

  it('rejects built-in names in every language', () => {
    expect(validateCategoryName('Food', 'expense', categories)).toBe('duplicate');
    expect(validateCategoryName('ruoka', 'expense', categories)).toBe('duplicate');
    expect(validateCategoryName('Еда', 'expense', categories)).toBe('duplicate');
  });

  it('allows names used by the other type or by archived categories', () => {
    expect(validateCategoryName('Salary', 'expense', categories)).toBeNull();
    expect(validateCategoryName('Old stuff', 'expense', categories)).toBeNull();
  });

  it('ignores the category being renamed', () => {
    expect(validateCategoryName('PETS', 'expense', categories, 'pets')).toBeNull();
    expect(validateCategoryName('Fresh food', 'expense', categories, 'expense-food')).toBeNull();
  });
});
