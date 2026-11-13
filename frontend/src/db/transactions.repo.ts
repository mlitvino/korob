import { eq, desc } from 'drizzle-orm';
import type { Transaction } from '../types/Transaction';
import {
  transactions,
  type SelectTransaction,
  type InsertTransaction,
} from './schema';
import { db } from './storage';
import { builtinCategoryId } from './builtinCategories';

const toDomain = (row: SelectTransaction): Transaction => ({
  id: row.id,
  type: row.type,
  category: row.category,
  amount: row.amount,
  currency: row.currency,
  occurredAt: new Date(row.occurredAt),
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
  description: row.description ?? undefined,
});

const toDbInsert = (input: Transaction): InsertTransaction => ({
  id: input.id,
  type: input.type,
  category: input.category,
  categoryId: builtinCategoryId(input.type, input.category),
  amount: input.amount,
  currency: input.currency,
  occurredAt: input.occurredAt.getTime(),
  createdAt: input.createdAt.getTime(),
  updatedAt: input.updatedAt.getTime(),
  description: input.description ?? null,
});

export const TransactionsRepo = {
  async list(): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.occurredAt));
    return rows.map(toDomain);
  },

  async getById(id: string): Promise<Transaction | null> {
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);
    return rows[0] ? toDomain(rows[0]) : null;
  },

  async insert(input: Transaction): Promise<void> {
    await db.insert(transactions).values(toDbInsert(input));
  },

  async deleteById(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  },

  async clear(): Promise<void> {
    await db.delete(transactions);
  },
};
