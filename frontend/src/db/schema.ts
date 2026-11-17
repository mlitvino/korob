import type { CurrencyCode } from '@/types/Currency';
import type { TransactionCategory, TransactionType } from '@/types/Transaction';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  type: text('type').$type<TransactionType>().notNull(),
  key: text('key').$type<TransactionCategory>(),
  name: text('name'),
  sortOrder: integer('sortOrder').notNull().default(0),
  archivedAt: integer('archivedAt'),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type').$type<TransactionType>().notNull(),
  categoryId: text('categoryId').notNull().references(() => categories.id),
  /** Whole cents (since migration 0005). */
  amount: integer('amount').notNull(),
  currency: text('currency').$type<CurrencyCode>().notNull().default('EUR'),
  occurredAt: integer('occurredAt').notNull().default(0),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull().default(0),
  description: text('description'),
});

export type SelectTransaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
