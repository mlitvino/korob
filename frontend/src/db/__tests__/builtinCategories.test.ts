import fs from 'fs';
import path from 'path';

import {
  builtinCategoryId,
  builtinKeyFromId,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/db/builtinCategories';

const migration = fs.readFileSync(
  path.join(__dirname, '../migrations/0004_add_categories.sql'),
  'utf8',
);

const SEED_ROW = /\('([a-z]+-[a-z]+)', '(income|expense)', '([a-z]+)', (\d+)\)/g;

const seededRows = [...migration.matchAll(SEED_ROW)]
  .map(([, id, type, key, sortOrder]) => ({ id, type, key, sortOrder: Number(sortOrder) }));

describe('built-in categories', () => {
  it('builds ids from type and key', () => {
    expect(builtinCategoryId('expense', 'food')).toBe('expense-food');
    expect(builtinCategoryId('income', 'other')).toBe('income-other');
  });

  it('seeds exactly the categories the app offers, in order', () => {
    const expected = [
      ...INCOME_CATEGORIES.map((key, sortOrder) => ({ type: 'income', key, sortOrder })),
      ...EXPENSE_CATEGORIES.map((key, sortOrder) => ({ type: 'expense', key, sortOrder })),
    ].map((row) => ({ id: `${row.type}-${row.key}`, ...row }));

    expect(seededRows).toEqual(expected);
  });

  it('reads the built-in key back from an id', () => {
    expect(builtinKeyFromId('expense-food')).toBe('food');
    expect(builtinKeyFromId('income-other')).toBe('other');
    expect(builtinKeyFromId('income-food')).toBeNull();
    expect(builtinKeyFromId('3f2a6c1e-8b7d-4e5f-9a0b-1c2d3e4f5a6b')).toBeNull();
  });

});
