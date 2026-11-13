import type { TransactionCategory, TransactionType } from './Transaction';

type CategoryBase = {
  /** `<type>-<key>` for built-ins (e.g. `expense-food`), a UUID for custom categories. */
  id: string;
  /** Which transactions can use it: income or expense. */
  type: TransactionType;
  /** Position in the picker within its `type`, ascending. */
  sortOrder: number;
  /** Set when the user deletes it: hidden from pickers, still shown on its transactions. */
  archivedAt: Date | null;
};

export type Category = CategoryBase & (
  /** Built-in: label comes from the `category.<key>` translation. */
  | { key: TransactionCategory; name: null }
  /** Custom: label is the name the user typed, in every language. */
  | { key: null; name: string }
);
