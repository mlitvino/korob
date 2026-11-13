import { createTestDb } from '@/db/testing/createTestDb';

describe('migration 0004_add_categories', () => {
  it('links existing transactions to their built-in category', () => {
    const { sqlite, migrate } = createTestDb({ until: '0003_add_occurred_at' });
    const insert = sqlite.prepare(
      `INSERT INTO transactions (id, type, category, amount, createdAt)
       VALUES (?, ?, ?, 1, 1)`,
    );
    insert.run('salary', 'income', 'salary');
    insert.run('food', 'expense', 'food');
    insert.run('expense-other', 'expense', 'other');
    insert.run('income-other', 'income', 'other');
    insert.run('mismatched', 'expense', 'salary');

    migrate();

    const rows = sqlite.prepare('SELECT id, categoryId FROM transactions ORDER BY id').all();
    expect(rows).toEqual([
      { id: 'expense-other', categoryId: 'expense-other' },
      { id: 'food', categoryId: 'expense-food' },
      { id: 'income-other', categoryId: 'income-other' },
      { id: 'mismatched', categoryId: null },
      { id: 'salary', categoryId: 'income-salary' },
    ]);
  });

  it('seeds every built-in as active and unnamed', () => {
    const { sqlite } = createTestDb();
    const counts = sqlite.prepare(
      `SELECT count(*) AS total, sum(archivedAt IS NULL) AS active, sum(name IS NULL) AS unnamed
       FROM categories`,
    ).get();
    expect(counts).toEqual({ total: 12, active: 12, unnamed: 12 });
  });
});
