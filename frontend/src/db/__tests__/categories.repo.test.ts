import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { CategoriesRepo } from '@/db/categories.repo';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
}));

beforeEach(() => {
  mockTestDb = createTestDb();
});

const addTransaction = (id: string, categoryId: string) => {
  mockTestDb.sqlite.prepare(
    `INSERT INTO transactions (id, type, categoryId, amount, createdAt, updatedAt)
     VALUES (?, 'expense', ?, 1, 1, 1)`,
  ).run(id, categoryId);
};

const transactionRow = (id: string) => mockTestDb.sqlite
  .prepare('SELECT categoryId, updatedAt FROM transactions WHERE id = ?')
  .get(id) as { categoryId: string; updatedAt: number };

const findCategory = async (id: string) =>
  (await CategoriesRepo.list()).find((category) => category.id === id);

describe('CategoriesRepo.list', () => {
  it('returns the seeded built-ins in order', async () => {
    const list = await CategoriesRepo.list();

    expect(list).toHaveLength(12);
    expect(list.filter((c) => c.type === 'expense').map((c) => c.key)).toEqual([
      'food', 'transport', 'housing', 'entertainment', 'shopping', 'health', 'other',
    ]);
    expect(list.every((c) => c.name === null && c.archivedAt === null)).toBe(true);
  });
});

describe('CategoriesRepo.create', () => {
  it('adds a trimmed custom category after the last one of its type', async () => {
    const created = await CategoriesRepo.create('expense', '  Pets  ');

    expect(created).toMatchObject({ type: 'expense', key: null, name: 'Pets', sortOrder: 7 });
    expect(await findCategory(created.id)).toEqual(created);
  });

  it('starts at 0 when the type has no categories', async () => {
    mockTestDb.sqlite.exec("DELETE FROM categories WHERE type = 'income'");
    expect((await CategoriesRepo.create('income', 'Bonus')).sortOrder).toBe(0);
  });

  it('rejects a blank name', async () => {
    await expect(CategoriesRepo.create('expense', '   ')).rejects.toThrow('must not be empty');
  });
});

describe('CategoriesRepo.rename', () => {
  it('renames a custom category in place', async () => {
    const pets = await CategoriesRepo.create('expense', 'Pets');
    addTransaction('t1', pets.id);

    const renamed = await CategoriesRepo.rename(pets.id, 'Animals');

    expect(renamed).toMatchObject({ id: pets.id, name: 'Animals' });
    expect(transactionRow('t1').categoryId).toBe(pets.id);
  });

  it('replaces a built-in and moves all its transactions to the new category', async () => {
    addTransaction('food-1', 'expense-food');
    addTransaction('food-2', 'expense-food');
    addTransaction('transport-1', 'expense-transport');

    const groceries = await CategoriesRepo.rename('expense-food', 'Groceries');

    expect(groceries).toMatchObject({
      type: 'expense', key: null, name: 'Groceries', sortOrder: 0, archivedAt: null,
    });
    expect(groceries.id).not.toBe('expense-food');
    expect((await findCategory('expense-food'))?.archivedAt).toBeInstanceOf(Date);

    for (const id of ['food-1', 'food-2']) {
      expect(transactionRow(id).categoryId).toBe(groceries.id);
      expect(transactionRow(id).updatedAt).toBeGreaterThan(1);
    }
    expect(transactionRow('transport-1')).toEqual({
      categoryId: 'expense-transport',
      updatedAt: 1,
    });
  });

  it('refuses to rename an archived category and changes nothing', async () => {
    await CategoriesRepo.archive('expense-food');
    addTransaction('food-1', 'expense-food');

    await expect(CategoriesRepo.rename('expense-food', 'Groceries')).rejects.toThrow('archived');
    expect(await CategoriesRepo.list()).toHaveLength(12);
    expect(transactionRow('food-1').categoryId).toBe('expense-food');
  });

  it('rejects a blank name before touching anything', async () => {
    await expect(CategoriesRepo.rename('expense-food', '')).rejects.toThrow('must not be empty');
    expect((await findCategory('expense-food'))?.archivedAt).toBeNull();
  });
});

describe('CategoriesRepo.archive', () => {
  it('archives without touching transactions', async () => {
    addTransaction('food-1', 'expense-food');

    await CategoriesRepo.archive('expense-food');

    expect((await findCategory('expense-food'))?.archivedAt).toBeInstanceOf(Date);
    expect(transactionRow('food-1').categoryId).toBe('expense-food');
  });

  it('keeps the original archive time when archived twice', async () => {
    await CategoriesRepo.archive('expense-food');
    const first = (await findCategory('expense-food'))?.archivedAt;

    jest.spyOn(Date, 'now').mockReturnValueOnce(Number(first) + 1000);
    await CategoriesRepo.archive('expense-food');

    expect((await findCategory('expense-food'))?.archivedAt).toEqual(first);
  });
});
