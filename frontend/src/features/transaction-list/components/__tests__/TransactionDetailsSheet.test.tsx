import { Alert } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import {
  TransactionDetailsSheet,
} from '@/features/transaction-list/components/TransactionDetailsSheet';
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

const openSheet = async (tx: Transaction, onClose = jest.fn()) => {
  renderWithApp(<TransactionDetailsSheet transaction={tx} visible onClose={onClose} />);
  await waitFor(() => expect(screen.getByRole('header')).toHaveTextContent(/Food/));
  return onClose;
};

describe('TransactionDetailsSheet', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const rowCount = () =>
    mockTestDb.sqlite
      .prepare('SELECT count(*) AS n FROM transactions').get() as { n: number };

  it('is titled with the amount and category', async () => {
    await openSheet(transaction('expense-food'));

    expect(screen.getByRole('header')).toHaveTextContent('\u2212€12.00 \u00b7 Food');
    expect(screen.getByText('Delete')).toBeOnTheScreen();
  });

  it('deletes after confirmation and closes', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
    const onClose = await openSheet(transaction('expense-food'));

    fireEvent.press(screen.getByText('Delete'));

    await waitFor(() => expect(rowCount()).toEqual({ n: 0 }));
    expect(onClose).toHaveBeenCalled();
  });

  it('keeps the transaction when the confirmation is cancelled', async () => {
    await TransactionsRepo.insert(transaction('expense-food'));
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await openSheet(transaction('expense-food'));

    fireEvent.press(screen.getByText('Delete'));

    expect(Alert.alert).toHaveBeenCalled();
    expect(rowCount()).toEqual({ n: 1 });
    expect(screen.getByRole('header')).toBeOnTheScreen();
  });

  it('edits the comment and saves it', async () => {
    const noted = { ...transaction('expense-food'), description: 'old note' };
    await TransactionsRepo.insert(noted);
    const onClose = await openSheet(noted);

    expect(screen.getByLabelText('Comment')).toHaveDisplayValue('old note');
    fireEvent.changeText(screen.getByLabelText('Comment'), 'paid for both');
    fireEvent.press(screen.getByText('Save'));

    const saved = mockTestDb.sqlite.prepare("SELECT description FROM transactions WHERE id = 't1'");
    await waitFor(() => expect(saved.get()).toEqual({ description: 'paid for both' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('keeps Save disabled until the comment really changes', async () => {
    await openSheet({ ...transaction('expense-food'), description: 'old note' });

    const save = () => screen.getByRole('button', { name: 'Save' });
    expect(save()).toBeDisabled();
    fireEvent.changeText(screen.getByLabelText('Comment'), '  old note  ');
    expect(save()).toBeDisabled();
    fireEvent.changeText(screen.getByLabelText('Comment'), 'new note');
    expect(save()).toBeEnabled();
  });
});
