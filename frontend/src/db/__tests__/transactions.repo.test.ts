import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
}));

beforeEach(() => {
  mockTestDb = createTestDb();
});

const at = new Date(2026, 10, 1);
const transaction = (id: string, categoryId: string): Transaction => ({
  id,
  type: 'expense',
  categoryId,
  amount: 12,
  currency: 'EUR',
  occurredAt: at,
  createdAt: at,
  updatedAt: at,
});

const storedCategory = (id: string) => mockTestDb.sqlite
  .prepare('SELECT category, categoryId FROM transactions WHERE id = ?')
  .get(id);

describe('TransactionsRepo', () => {
  it('stores a built-in category id and its key', async () => {
    await TransactionsRepo.insert(transaction('t1', 'expense-food'));

    expect(storedCategory('t1')).toEqual({ category: 'food', categoryId: 'expense-food' });
    expect((await TransactionsRepo.getById('t1'))?.categoryId).toBe('expense-food');
  });

  it('stores a custom category id with "other" in the old column', async () => {
    await TransactionsRepo.insert(transaction('t2', 'custom-uuid'));

    expect(storedCategory('t2')).toEqual({ category: 'other', categoryId: 'custom-uuid' });
    expect((await TransactionsRepo.getById('t2'))?.categoryId).toBe('custom-uuid');
  });

  it('reads rows without a category id as "other" of their type', async () => {
    mockTestDb.sqlite.prepare(
      `INSERT INTO transactions (id, type, category, amount, createdAt)
       VALUES ('legacy', 'income', 'food', 5, 1)`,
    ).run();

    expect((await TransactionsRepo.getById('legacy'))?.categoryId).toBe('income-other');
  });
});
