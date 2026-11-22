import { useState, type ReactNode } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import Transactions from '@/app/(drawer)/transactions';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import { renderWithApp } from '@/testing/renderWithApp';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;
type Options = { title?: string; headerLeft?: () => ReactNode; headerRight?: () => ReactNode };
let mockSetOptions: (options: Options) => void = () => {};

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => Promise.resolve(),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual('react');
  // one stable object, like the real navigation prop
  const navigation = { setOptions: (options: object) => mockSetOptions(options) };
  return {
    useLocalSearchParams: () => ({}),
    useNavigation: () => navigation,
    useFocusEffect: (effect: () => void | (() => void)) => React.useEffect(effect, [effect]),
  };
});

jest.mock('@/components/DrawerMenuButton', () => () => null);

/** Renders the header the screen asks for, next to the screen itself. */
function WithHeader() {
  const [options, setOptions] = useState<Options>({});
  mockSetOptions = (next) => setOptions((current) => ({ ...current, ...next }));
  return (
    <>
      <View>
        {options.headerLeft?.()}
        <Text testID="header-title">{options.title}</Text>
        {options.headerRight?.()}
      </View>
      <Transactions />
    </>
  );
}

const day = new Date(Date.now() - 864e5);
const tx = (id: string, type: Transaction['type'], categoryId: string): Transaction => ({
  id, type, categoryId, amountCents: 1000, currency: 'EUR',
  occurredAt: day, createdAt: day, updatedAt: day,
});

let backHandler: () => boolean | null | undefined = () => false;

beforeEach(async () => {
  mockTestDb = createTestDb();
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_event, handler) => {
    backHandler = handler;
    return { remove: jest.fn() };
  });
  await TransactionsRepo.insert(tx('t1', 'expense', 'expense-food'));
  await TransactionsRepo.insert(tx('t2', 'expense', 'expense-transport'));
  await TransactionsRepo.insert(tx('t3', 'income', 'income-salary'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

const title = () => screen.getByTestId('header-title');
const ids = () => (mockTestDb.sqlite.prepare('SELECT id FROM transactions ORDER BY id')
  .all() as { id: string }[]).map((row) => row.id);
const confirmAlerts = () => jest.spyOn(Alert, 'alert').mockImplementation((_t, _m, buttons) => {
  buttons?.find((button) => button.style === 'destructive')?.onPress?.();
});

async function start() {
  renderWithApp(<WithHeader />);
  await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
}

describe('Transactions selection', () => {
  it('long-press enters selection, taps toggle, and the last unselect leaves it', async () => {
    await start();
    expect(title()).toHaveTextContent('Transactions');

    fireEvent(screen.getByText('Food'), 'longPress');
    expect(title()).toHaveTextContent('1 selected');
    fireEvent.press(screen.getByText('Transport'));
    expect(title()).toHaveTextContent('2 selected');

    // a tap in selection mode toggles; it does not open the details sheet
    expect(screen.queryByLabelText('Comment')).not.toBeOnTheScreen();
    fireEvent.press(screen.getByText('Transport'));
    fireEvent.press(screen.getByText('Food'));
    expect(title()).toHaveTextContent('Transactions');
  });

  it('selects and deselects all visible rows', async () => {
    await start();
    fireEvent(screen.getByText('Food'), 'longPress');

    fireEvent.press(screen.getByText('Select all'));
    expect(title()).toHaveTextContent('3 selected');
    fireEvent.press(screen.getByText('Deselect all'));
    expect(title()).toHaveTextContent('Transactions');
  });

  it('deletes the selected rows after one confirmation', async () => {
    const alert = confirmAlerts();
    await start();
    fireEvent(screen.getByText('Food'), 'longPress');
    fireEvent.press(screen.getByText('Salary'));

    fireEvent.press(screen.getByLabelText('Delete selected'));

    expect(alert).toHaveBeenCalledWith('Delete 2 selected?', expect.any(String), expect.any(Array));
    await waitFor(() => expect(ids()).toEqual(['t2']));
    await waitFor(() => expect(title()).toHaveTextContent('Transactions'));
  });

  it('never deletes rows hidden by the filter', async () => {
    confirmAlerts();
    await start();
    fireEvent(screen.getByText('Food'), 'longPress');
    fireEvent.press(screen.getByText('Select all'));

    fireEvent.press(screen.getByRole('button', { name: 'Income' }));
    await waitFor(() => expect(title()).toHaveTextContent('1 selected'));
    fireEvent.press(screen.getByLabelText('Delete selected'));

    await waitFor(() => expect(ids()).toEqual(['t1', 't2']));
  });

  it('Back and the close button leave selection mode', async () => {
    await start();
    fireEvent(screen.getByText('Food'), 'longPress');

    await waitFor(() => expect(backHandler()).toBe(true));
    await waitFor(() => expect(title()).toHaveTextContent('Transactions'));
    expect(backHandler()).toBe(false);

    fireEvent(screen.getByText('Food'), 'longPress');
    fireEvent.press(screen.getByLabelText('Cancel selection'));
    expect(title()).toHaveTextContent('Transactions');
  });

  it('a normal tap still opens the details sheet', async () => {
    await start();
    fireEvent.press(screen.getByText('Food'));
    expect(screen.getByLabelText('Comment')).toBeOnTheScreen();
  });
});
