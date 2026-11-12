import type { CurrencyCode } from './Currency';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'gift'
  | 'investment'
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'other';

export type Transaction = {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: CurrencyCode;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
};
