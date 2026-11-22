import { Alert } from 'react-native';
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

afterEach(() => {
  jest.restoreAllMocks();
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
    expect(screen.queryByRole('radio', { name: /Health/ })).not.toBeOnTheScreen();
    expect(screen.queryByRole('radio', { name: /Salary/ })).not.toBeOnTheScreen();
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

  it('adds a category from the picker and selects it', async () => {
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Category: Food' }));
    fireEvent.press(screen.getByRole('button', { name: 'Add category' }));
    fireEvent.changeText(screen.getByLabelText('Name'), 'Pets');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => expect(
      screen.getByRole('button', { name: 'Category: Pets' }),
    ).toBeOnTheScreen());
  });

  it('still offers the add chip when no category is left', async () => {
    for (const id of EXPENSE_IDS) {
      await CategoriesRepo.archive(id);
    }

    const { client } = renderWithApp(
      <TransactionForm transactionType="expense" onSubmit={jest.fn()} />,
    );

    await waitFor(() => expect(client.isFetching()).toBe(0));
    fireEvent.press(screen.getByRole('button', { name: 'Category: No categories' }));
    expect(screen.getByRole('button', { name: 'Add category' })).toBeOnTheScreen();
  });

  it('deletes from the picker and moves off the deleted selection', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Category: Food' }));
    fireEvent.press(screen.getByRole('button', { name: 'Delete Food' }));

    await waitFor(() => expect(
      screen.getByRole('button', { name: 'Category: Transport' }),
    ).toBeOnTheScreen());
    expect(screen.queryByRole('button', { name: 'Delete Food' })).not.toBeOnTheScreen();
  });

  it('keeps a category when the delete is cancelled', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Category: Food' }));
    fireEvent.press(screen.getByRole('button', { name: 'Delete Food' }));

    expect(Alert.alert).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Category: Food' })).toBeOnTheScreen();
  });

  it('submits the comment with the transaction', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.changeText(screen.getByLabelText('Amount'), '12');
    fireEvent.changeText(screen.getByLabelText('Comment'), 'Lunch with Anna');
    fireEvent.press(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][3]).toBe('Lunch with Anna');
  });
});

describe('TransactionForm amount', () => {
  it('asks for an amount instead of submitting an empty one', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Done' }));

    expect(screen.getByText('Enter an amount')).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('asks for an amount when the input is not a number', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.changeText(screen.getByLabelText('Amount'), '.');
    fireEvent.press(screen.getByRole('button', { name: 'Done' }));

    expect(screen.getByText('Enter an amount')).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears the error once the amount is typed', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderWithApp(<TransactionForm transactionType="expense" onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
    fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    fireEvent.changeText(screen.getByLabelText('Amount'), '5');

    expect(screen.queryByText('Enter an amount')).not.toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
