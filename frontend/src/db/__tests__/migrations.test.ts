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

describe('migration 0005_amounts_to_cents', () => {
  it('converts amounts to whole cents, rounding to the nearest cent', () => {
    const { sqlite, migrate } = createTestDb({ until: '0004_add_categories' });
    const insert = sqlite.prepare(
      `INSERT INTO transactions (id, type, category, amount, createdAt)
       VALUES (?, 'expense', 'food', ?, 1)`,
    );
    insert.run('whole', 7);
    insert.run('half', 12.5);
    insert.run('cents', 0.99);
    insert.run('three-decimals', 12.345);
    insert.run('float-noise', 0.1 + 0.2);

    migrate();

    const rows = sqlite.prepare(
      'SELECT id, amount, typeof(amount) AS kind FROM transactions ORDER BY id',
    ).all();
    expect(rows).toEqual([
      { id: 'cents', amount: 99, kind: 'integer' },
      { id: 'float-noise', amount: 30, kind: 'integer' },
      { id: 'half', amount: 1250, kind: 'integer' },
      { id: 'three-decimals', amount: 1235, kind: 'integer' },
      { id: 'whole', amount: 700, kind: 'integer' },
    ]);
  });
});
