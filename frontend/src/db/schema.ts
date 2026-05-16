import { TransactionCategory, TransactionType } from '@/types/Transaction';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type').$type<TransactionType>().notNull(),
  category: text('category').$type<TransactionCategory>().notNull(),
  amount: integer('amount').notNull(),
  createdAt: integer('createdAt').notNull(),
  description: text('description'),
});

export type SelectTransaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

