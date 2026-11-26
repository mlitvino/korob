import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { CategoriesRepo } from '@/db/categories.repo';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
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

const row = (props: Partial<Parameters<typeof TransactionItem>[0]> = {}) => (
  <TransactionItem
    transaction={transaction('expense-food')}
    onPress={jest.fn()}
    onLongPress={jest.fn()}
    {...props}
  />
);

describe('TransactionItem category name', () => {
  it('translates built-in categories', async () => {
    renderWithApp(row());
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
  });

  it('shows custom names as typed, even after archiving', async () => {
    const pets = await CategoriesRepo.create('expense', 'Pets');
    await CategoriesRepo.archive(pets.id);

    renderWithApp(row({ transaction: transaction(pets.id) }));
    await waitFor(() => expect(screen.getByText('Pets')).toBeOnTheScreen());
  });
});

describe('TransactionItem selection', () => {
  it('is a button with no checkbox outside selection mode', async () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    renderWithApp(row({ onPress, onLongPress }));
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());

    expect(screen.queryByTestId('transaction-checkbox')).not.toBeOnTheScreen();
    fireEvent.press(screen.getByText('Food'));
    fireEvent(screen.getByText('Food'), 'longPress');
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('shows a checked checkbox on the right when selected', async () => {
    renderWithApp(row({ selecting: true, selected: true }));
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());

    expect(screen.getByTestId('transaction-checkbox')).toBeOnTheScreen();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows an empty checkbox when not selected', async () => {
    renderWithApp(row({ selecting: true, selected: false }));
    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});

describe('TransactionItem amount', () => {
  it('keeps the entered amount while there is no rate', async () => {
    renderWithApp(row({ transaction: { ...transaction('expense-food'), currency: 'USD' } }));

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    expect(screen.getByText('−$12.00')).toBeOnTheScreen();
  });
});
