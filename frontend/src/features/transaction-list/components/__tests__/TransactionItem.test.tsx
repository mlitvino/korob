import { Alert, type AlertButton } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { CategoriesRepo } from '@/db/categories.repo';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import { TransactionItem } from '@/features/transaction-list/components/TransactionItem';
import { renderWithApp } from '@/testing/renderWithApp';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => Promise.resolve(),
}));

beforeEach(() => {
  mockTestDb = createTestDb();
});

const at = new Date(2026, 10, 1, 9, 30);
const transaction = (categoryId: string): Transaction => ({
  id: 't1',
  type: 'expense',
  categoryId,
  amount: 12,
  currency: 'EUR',
  occurredAt: at,
  createdAt: at,
  updatedAt: at,
});

describe('TransactionItem category name', () => {
  it('translates built-in categories', async () => {
    renderWithApp(<TransactionItem transaction={transaction('expense-food')} />);
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
  });

  it('shows custom names as typed, even after archiving', async () => {
    const pets = await CategoriesRepo.create('expense', 'Pets');
    await CategoriesRepo.archive(pets.id);

    renderWithApp(<TransactionItem transaction={transaction(pets.id)} />);
    await waitFor(() => expect(screen.getByText('Pets')).toBeOnTheScreen());
  });
});

describe('TransactionItem delete', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const answerAlertWith = (style: AlertButton['style']) =>
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === style)?.onPress?.();
    });

  const rowCount = () => mockTestDb.sqlite
    .prepare('SELECT count(*) AS n FROM transactions').get() as { n: number };

  it('deletes after a long press and confirmation', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    answerAlertWith('destructive');
    renderWithApp(<TransactionItem transaction={transaction('expense-food')} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent(screen.getByText('Food'), 'longPress');

    await waitFor(() => expect(rowCount()).toEqual({ n: 0 }));
  });

  it('keeps the transaction when cancelled', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    const alert = answerAlertWith('cancel');
    renderWithApp(<TransactionItem transaction={transaction('expense-food')} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent(screen.getByText('Food'), 'longPress');

    expect(alert).toHaveBeenCalled();
    expect(rowCount()).toEqual({ n: 1 });
  });
});
