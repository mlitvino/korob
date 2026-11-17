import { CategoriesRepo } from '@/db/categories.repo';
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
  amountCents: 1200,
  currency: 'EUR',
  occurredAt: at,
  createdAt: at,
  updatedAt: at,
});

describe('TransactionsRepo', () => {
  it('round-trips built-in and custom category ids', async () => {
    const pets = await CategoriesRepo.create('expense', 'Pets');
    await TransactionsRepo.insert(transaction('t1', 'expense-food'));
    await TransactionsRepo.insert(transaction('t2', pets.id));

    expect((await TransactionsRepo.getById('t1'))?.categoryId).toBe('expense-food');
    expect((await TransactionsRepo.getById('t2'))?.categoryId).toBe(pets.id);
  });

  it('refuses a category id that does not exist', async () => {
    await expect(TransactionsRepo.insert(transaction('t3', 'no-such-category'))).rejects.toThrow();
    expect(await TransactionsRepo.getById('t3')).toBeNull();
  });
});
