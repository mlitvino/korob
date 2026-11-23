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

    migrate('0004_add_categories');

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

    migrate('0005_amounts_to_cents');

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

describe('migration 0006 (drop old category column, add FK)', () => {
  const seed = () => {
    const { sqlite, migrate } = createTestDb({ until: '0005_amounts_to_cents' });
    sqlite.prepare(
      `INSERT INTO transactions
         (id, type, category, categoryId, amount, currency,
          occurredAt, createdAt, updatedAt, description)
       VALUES
         ('linked', 'expense', 'food', 'expense-food', 1250, 'USD', 10, 20, 30, 'lunch'),
         ('unlinked', 'income', 'food', NULL, 700, 'EUR', 1, 2, 3, NULL)`,
    ).run();
    migrate();
    return sqlite;
  };

  it('moves rows without a category to "other" of their type and keeps every value', () => {
    const sqlite = seed();
    expect(sqlite.prepare('SELECT * FROM transactions ORDER BY id').all()).toEqual([
      {
        id: 'linked',
        type: 'expense',
        categoryId: 'expense-food',
        amount: 1250,
        currency: 'USD',
        occurredAt: 10,
        createdAt: 20,
        updatedAt: 30,
        description: 'lunch',
      },
      {
        id: 'unlinked',
        type: 'income',
        categoryId: 'income-other',
        amount: 700,
        currency: 'EUR',
        occurredAt: 1,
        createdAt: 2,
        updatedAt: 3,
        description: null,
      },
    ]);
  });

  it('rejects transactions that point to a missing category', () => {
    const sqlite = seed();
    const insert = sqlite.prepare(
      `INSERT INTO transactions (id, type, categoryId, amount, createdAt)
       VALUES ('bad', 'expense', 'no-such-category', 1, 1)`,
    );
    expect(() => insert.run()).toThrow(/FOREIGN KEY/);
  });
});

describe('migration 0006 on a database whose built-in categories are missing', () => {
  // A device that applied an early draft of 0004: categories table without the seeded built-ins.
  const seedBrokenDevice = () => {
    const { sqlite, migrate } = createTestDb({ until: '0005_amounts_to_cents' });
    sqlite.exec(`
      DELETE FROM categories;
      INSERT INTO categories (id, type, name, sortOrder, archivedAt) VALUES
        ('custom-active', 'income', 'Bonus', 0, NULL),
        ('custom-archived', 'income', 'Old', 1, 5);
      INSERT INTO transactions (id, type, category, categoryId, amount, createdAt) VALUES
        ('food', 'expense', 'food', 'expense-food', 100, 1),
        ('salary', 'income', 'salary', 'income-salary', 200, 2),
        ('bonus', 'income', 'other', 'custom-active', 300, 3),
        ('unknown', 'expense', 'food', 'gone-category', 400, 4),
        ('unlinked', 'expense', 'health', NULL, 500, 5);
    `);
    migrate();
    return sqlite;
  };

  it('restores the built-ins and keeps custom categories', () => {
    const sqlite = seedBrokenDevice();
    const categories = sqlite.prepare(
      'SELECT id, archivedAt FROM categories ORDER BY id',
    ).all() as { id: string; archivedAt: number | null }[];

    expect(categories).toHaveLength(14);
    expect(categories).toContainEqual({ id: 'expense-food', archivedAt: null });
    expect(categories).toContainEqual({ id: 'custom-active', archivedAt: null });
    expect(categories).toContainEqual({ id: 'custom-archived', archivedAt: 5 });
  });

  it('keeps every transaction, pointing unknown categories to "other"', () => {
    const sqlite = seedBrokenDevice();
    expect(sqlite.prepare('SELECT id, categoryId, amount FROM transactions ORDER BY id').all())
      .toEqual([
        { id: 'bonus', categoryId: 'custom-active', amount: 300 },
        { id: 'food', categoryId: 'expense-food', amount: 100 },
        { id: 'salary', categoryId: 'income-salary', amount: 200 },
        { id: 'unknown', categoryId: 'expense-other', amount: 400 },
        { id: 'unlinked', categoryId: 'expense-health', amount: 500 },
      ]);
    expect(sqlite.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
  });
});
