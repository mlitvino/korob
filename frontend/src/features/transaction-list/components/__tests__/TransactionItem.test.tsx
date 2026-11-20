import { Alert } from 'react-native';
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
  amountCents: 1200,
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

describe('TransactionItem details sheet', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const rowCount = () => mockTestDb.sqlite
    .prepare('SELECT count(*) AS n FROM transactions').get() as { n: number };

  const openDetails = async () => {
    renderWithApp(<TransactionItem transaction={transaction('expense-food')} />);
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByText('Food'));
  };

  it('opens on tap, titled with the amount and category', async () => {
    await openDetails();

    expect(screen.getByRole('header')).toHaveTextContent('\u2212€12.00 \u00b7 Food');
    expect(screen.getByText('Delete')).toBeOnTheScreen();
  });

  it('deletes through the sheet after confirmation', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
    await openDetails();

    fireEvent.press(screen.getByText('Delete'));

    await waitFor(() => expect(rowCount()).toEqual({ n: 0 }));
  });

  it('keeps the transaction when the confirmation is cancelled', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await openDetails();

    fireEvent.press(screen.getByText('Delete'));

    expect(Alert.alert).toHaveBeenCalled();
    expect(rowCount()).toEqual({ n: 1 });
    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
