import type { CurrencyCode } from './Currency';

export type TransactionType = 'income' | 'expense';

/** Keys of the built-in categories; the label comes from the `category.<key>` translation. */
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
  /** Decides the sign: income adds to the balance, expense subtracts. */
  type: TransactionType;
  /** Id of a row in the categories table; built-ins are `<type>-<key>`. */
  categoryId: string;
  /** Always positive, in `currency` units; the sign comes from `type`. */
  amount: number;
  /** Currency the amount was entered in. Never converted. */
  currency: CurrencyCode;
  /** When the money moved; picked by the user. */
  occurredAt: Date;
  /** When the record was saved; set by the app. */
  createdAt: Date;
  /** Last change to the record; set by the app. */
  updatedAt: Date;
  /** Optional free-text note. Nothing in the UI sets it yet. */
  description?: string;
};
