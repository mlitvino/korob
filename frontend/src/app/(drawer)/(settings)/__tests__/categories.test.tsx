import { Alert } from 'react-native';
import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import Categories from '@/app/(drawer)/(settings)/categories';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
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

const expenseGroup = () => within(screen.getByTestId('categories-expense'));

async function openAdd() {
  renderWithApp(<Categories />);
  await waitFor(() => expect(expenseGroup().getByText('Food')).toBeOnTheScreen());
  fireEvent.press(expenseGroup().getByText('Add category'));
}

describe('Categories settings', () => {
  it('adds a custom expense category', async () => {
    await openAdd();
    fireEvent.changeText(screen.getByLabelText('Name'), 'Pets');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => expect(expenseGroup().getByText('Pets')).toBeOnTheScreen());
  });

  it('refuses a duplicate of a built-in name', async () => {
    await openAdd();
    fireEvent.changeText(screen.getByLabelText('Name'), 'food');
    fireEvent.press(screen.getByText('Save'));

    expect(screen.getByText('A category with this name already exists')).toBeOnTheScreen();
  });

  it('renames a category', async () => {
    renderWithApp(<Categories />);
    await waitFor(() => expect(expenseGroup().getByText('Food')).toBeOnTheScreen());

    fireEvent.press(expenseGroup().getByText('Food'));
    fireEvent.changeText(screen.getByLabelText('Name'), 'Groceries');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => expect(expenseGroup().getByText('Groceries')).toBeOnTheScreen());
    expect(expenseGroup().queryByText('Food')).not.toBeOnTheScreen();
  });

  it('archives a category after confirmation', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
    renderWithApp(<Categories />);
    await waitFor(() => expect(expenseGroup().getByText('Food')).toBeOnTheScreen());

    fireEvent.press(expenseGroup().getByText('Food'));
    fireEvent.press(screen.getByText('Archive'));

    expect(Alert.alert).toHaveBeenCalled();
    const food = mockTestDb.sqlite.prepare(
      "SELECT archivedAt FROM categories WHERE id = 'expense-food'",
    );
    await waitFor(() => expect(food.get()).not.toEqual({ archivedAt: null }));
    await waitFor(() => expect(expenseGroup().queryByText('Food')).not.toBeOnTheScreen());
  });

  it('archives from the chip × after confirmation', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
    renderWithApp(<Categories />);
    await waitFor(() => expect(expenseGroup().getByText('Food')).toBeOnTheScreen());

    fireEvent.press(expenseGroup().getByLabelText('Archive Food'));

    await waitFor(() => expect(expenseGroup().queryByText('Food')).not.toBeOnTheScreen());
  });
});
