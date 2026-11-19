import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { CategoriesRepo } from '@/db/categories.repo';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import TransactionForm from '@/features/transaction-form/components/TransactionForm';
import { renderWithApp } from '@/testing/renderWithApp';

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

const EXPENSE_IDS = [
  'expense-food', 'expense-transport', 'expense-housing', 'expense-entertainment',
  'expense-shopping', 'expense-health', 'expense-other',
];

describe('TransactionForm categories', () => {
  it('offers active categories of its type, custom ones included', async () => {
    await CategoriesRepo.create('expense', 'Pets');
    await CategoriesRepo.archive('expense-health');

    renderWithApp(<TransactionForm transactionType="expense" onSubmit={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Category: Food' }));

    expect(screen.getByRole('radio', { name: /Pets/ })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: /Transport/ })).toBeOnTheScreen();
    expect(screen.queryByRole('radio', { name: /Health/ })).toBeNull();
    expect(screen.queryByRole('radio', { name: /Salary/ })).toBeNull();
  });

  it('submits the chosen category id', async () => {
    const pets = await CategoriesRepo.create('expense', 'Pets');
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    renderWithApp(<TransactionForm transactionType="expense" onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.changeText(screen.getByLabelText('Amount'), '12');
    fireEvent.press(screen.getByRole('button', { name: 'Category: Food' }));
    fireEvent.press(screen.getByRole('radio', { name: /Pets/ }));
    fireEvent.press(screen.getAllByText('Done')[0]);
    fireEvent.press(screen.getAllByText('Done')[0]);

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][2]).toBe(pets.id);
  });

  it('explains and blocks saving when no category is left', async () => {
    for (const id of EXPENSE_IDS) {
      await CategoriesRepo.archive(id);
    }

    const { client } = renderWithApp(
      <TransactionForm transactionType="expense" onSubmit={jest.fn()} />,
    );

    await waitFor(() => expect(client.isFetching()).toBe(0));
    expect(screen.getByText('No categories')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled();
  });
});
