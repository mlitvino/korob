import { desc, eq, inArray } from 'drizzle-orm';
import type { Transaction } from '../types/Transaction';
import {
  transactions,
  type SelectTransaction,
  type InsertTransaction,
} from './schema';
import { db } from './storage';

const toDomain = (row: SelectTransaction): Transaction => ({
  id: row.id,
  type: row.type,
  categoryId: row.categoryId,
  amountCents: row.amount,
  currency: row.currency,
  occurredAt: new Date(row.occurredAt),
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
  description: row.description ?? undefined,
});

/** Trimmed comment, or null when empty. */
const normalizeComment = (text: string | undefined) => text?.trim() || null;

const toDbInsert = (input: Transaction): InsertTransaction => ({
  id: input.id,
  type: input.type,
  categoryId: input.categoryId,
  amount: input.amountCents,
  currency: input.currency,
  occurredAt: input.occurredAt.getTime(),
  createdAt: input.createdAt.getTime(),
  updatedAt: input.updatedAt.getTime(),
  description: normalizeComment(input.description),
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

  async updateDescription(id: string, description: string | undefined): Promise<void> {
    await db
      .update(transactions)
      .set({ description: normalizeComment(description), updatedAt: Date.now() })
      .where(eq(transactions.id, id));
  },

  async deleteByIds(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    await db.delete(transactions).where(inArray(transactions.id, ids));
  },

  async deleteById(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  },

  async clear(): Promise<void> {
    await db.delete(transactions);
  },
};
