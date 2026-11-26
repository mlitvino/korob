import { useState, type ReactNode } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import Transactions from '@/app/(drawer)/transactions';
import { Themes } from '@/constants/theme';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { TransactionsRepo } from '@/db/transactions.repo';
import { renderWithApp } from '@/testing/renderWithApp';
import type { Transaction } from '@/types/Transaction';

let mockTestDb: TestDb;
let mockParams: { filter?: string; period?: string } = {};
const mockSetParams = jest.fn();
/** What the stand-in calendar confirms. */
let mockRange: { date?: Date; startDate?: Date; endDate?: Date } = {};
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
    useLocalSearchParams: () => mockParams,
    router: { setParams: (params: object) => mockSetParams(params) },
    useNavigation: () => navigation,
    useFocusEffect: (effect: () => void | (() => void)) => React.useEffect(effect, [effect]),
  };
});

jest.mock('@/components/DrawerMenuButton', () => () => null);

// the calendar itself is the library's; stand in for its two ways out
jest.mock('react-native-paper-dates', () => {
  const React = jest.requireActual('react');
  const { Pressable, Text } = jest.requireActual('react-native');
  const button = (label: string, onPress: () => void) =>
    React.createElement(Pressable, { onPress }, React.createElement(Text, null, label));
  return {
    ...jest.requireActual('react-native-paper-dates'),
    DatePickerModal: (props: {
      visible: boolean;
      onDismiss: () => void;
      onConfirm: (value: object) => void;
    }) =>
      props.visible
        ? React.createElement(
          React.Fragment,
          null,
          button('calendar-ok', () => props.onConfirm(mockRange)),
          button('calendar-cancel', props.onDismiss),
        )
        : null,
  };
});

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
  id,
  type,
  categoryId,
  amountCents: 1000,
  currency: 'EUR',
  occurredAt: day,
  createdAt: day,
  updatedAt: day,
});

let backHandler: () => boolean | null | undefined = () => false;

beforeEach(async () => {
  mockTestDb = createTestDb();
  mockParams = {};
  mockSetParams.mockClear();
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
const ids = () =>
  (mockTestDb.sqlite.prepare('SELECT id FROM transactions ORDER BY id')
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

describe('Transactions period', () => {
  const now = new Date();
  const old = new Date(2020, 0, 15, 12);
  const at = (date: Date, base: Transaction): Transaction => ({
    ...base,
    occurredAt: date,
    amountCents: 2500,
  });
  const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));
  const periodTitle = () => screen.getByTestId('period-title');
  const mode = () => screen.getByTestId('period-mode');
  const selected = (name: string) => screen.queryByRole('button', { name, selected: true });
  /** Picks an entry of the period dropdown. */
  const choose = async (value: string) => {
    press('Period type');
    fireEvent.press(await screen.findByTestId(`period-option-${value}`));
  };

  beforeEach(async () => {
    await AsyncStorage.clear();
    await TransactionsRepo.insert(at(now, tx('now', 'expense', 'expense-health')));
    await TransactionsRepo.insert(at(old, tx('old', 'expense', 'expense-shopping')));
  });

  it('starts at all time, without a title row', async () => {
    await start();

    expect(mode()).toHaveTextContent('All time');
    expect(screen.getByText('Shopping')).toBeOnTheScreen();
    expect(screen.queryByTestId('period-title')).not.toBeOnTheScreen();
  });

  it('shows only the chosen day and its totals', async () => {
    await start();
    await choose('day');

    expect(screen.getByText('Health')).toBeOnTheScreen();
    expect(screen.queryByText('Food')).not.toBeOnTheScreen();
    expect(screen.queryByText('Shopping')).not.toBeOnTheScreen();
    expect(screen.getByTestId('total-income')).toHaveTextContent('€0.00');
    expect(screen.getByTestId('total-expense')).toHaveTextContent('€25.00');
  });

  it('shows income minus expense as the total, in coloured figures', async () => {
    await TransactionsRepo.insert({
      ...at(now, tx('pay', 'income', 'income-gift')),
      amountCents: 10000,
    });
    await start();
    await choose('day');

    expect(screen.getByTestId('total-net')).toHaveTextContent('€75.00');
    expect(screen.getByTestId('total-income')).toHaveStyle({ color: Themes.light.income });
    expect(screen.getByTestId('total-expense')).toHaveStyle({ color: Themes.light.expense });
  });

  it('shows a negative total when more was spent', async () => {
    await start();
    await choose('day');

    expect(screen.getByTestId('total-net')).toHaveTextContent('-€25.00');
  });

  it('steps with the arrows and says when a period is empty', async () => {
    await start();
    await choose('day');

    press('Previous period');
    expect(screen.getByText('Food')).toBeOnTheScreen();
    expect(screen.queryByText('Health')).not.toBeOnTheScreen();

    press('Next period');
    press('Next period');
    expect(screen.getByText('No transactions')).toBeOnTheScreen();
  });

  it('converts another currency into the totals, marked as approximate', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ base: 'EUR', date: '2026-11-25', rates: { USD: 1.25 } }),
    });
    await TransactionsRepo.insert({
      ...at(now, tx('usd', 'expense', 'expense-entertainment')),
      currency: 'USD',
    });
    await start();
    await choose('day');

    // 25.00 EUR + 25.00 USD / 1.25
    await waitFor(() => expect(screen.getByTestId('total-expense')).toHaveTextContent('≈ €45.00'));
    expect(screen.queryByTestId('missing-rates')).not.toBeOnTheScreen();
  });

  it('names a currency it cannot convert while there is no rate', async () => {
    await TransactionsRepo.insert({
      ...at(now, tx('usd', 'expense', 'expense-entertainment')),
      currency: 'USD',
    });
    await start();
    await choose('day');

    expect(await screen.findByTestId('missing-rates'))
      .toHaveTextContent('USD not counted: no exchange rate yet');
    expect(screen.getByTestId('total-expense')).toHaveTextContent('€25.00');
  });

  it('keeps both totals while the type filter narrows the list', async () => {
    await start();
    await choose('day');
    press('Income');

    expect(screen.queryByText('Health')).not.toBeOnTheScreen();
    expect(screen.getByTestId('total-expense')).toHaveTextContent('€25.00');
  });

  it('picks a month of another year from the sheet', async () => {
    await start();
    await choose('month');
    press('Change date');
    press('Previous year');
    press('January');

    expect(periodTitle()).toHaveTextContent(`January ${now.getFullYear() - 1}`);
    expect(screen.queryByText('Health')).not.toBeOnTheScreen();
  });

  it('shows the current year without opening a picker', async () => {
    await start();
    await choose('year');

    expect(periodTitle()).toHaveTextContent(String(now.getFullYear()));
    expect(screen.queryByLabelText('Previous years')).not.toBeOnTheScreen();
  });

  it('picks a year from the grid behind the title', async () => {
    await start();
    await choose('year');
    press('Change date');
    press('2020');

    expect(periodTitle()).toHaveTextContent('2020');
    expect(screen.getByText('Shopping')).toBeOnTheScreen();
    expect(screen.queryByText('Health')).not.toBeOnTheScreen();
  });

  it('pages back to older years, with or without transactions', async () => {
    await start();
    await choose('year');
    press('Change date');
    press('Previous years');
    press(String(now.getFullYear() - 12));

    expect(periodTitle()).toHaveTextContent(String(now.getFullYear() - 12));
    expect(screen.getByText('No transactions')).toBeOnTheScreen();
  });

  it('takes a range from the calendar, last day included', async () => {
    await start();
    mockRange = { startDate: new Date(2020, 0, 1), endDate: new Date(2020, 0, 15) };
    await choose('range');
    fireEvent.press(screen.getByText('calendar-ok'));

    expect(mode()).toHaveTextContent('Period');
    expect(screen.getByText('Shopping')).toBeOnTheScreen();
    expect(screen.queryByText('Health')).not.toBeOnTheScreen();
    expect(screen.queryByLabelText('Previous period')).not.toBeOnTheScreen();
  });

  it('takes the week of the day picked in the calendar', async () => {
    await start();
    mockRange = { date: new Date(2020, 0, 17) };
    await choose('week');
    press('Change date');
    fireEvent.press(screen.getByText('calendar-ok'));

    expect(periodTitle()).toHaveTextContent(/Jan 13 – Jan 19, 2020/);
    expect(screen.getByText('Shopping')).toBeOnTheScreen();
  });

  it('keeps the previous mode when the range calendar is cancelled', async () => {
    await start();
    await choose('range');
    fireEvent.press(screen.getByText('calendar-cancel'));

    expect(mode()).toHaveTextContent('All time');
  });

  it('applies the period from Home each time it arrives', async () => {
    mockParams = { filter: 'expense', period: 'week' };
    const view = renderWithApp(<WithHeader />);
    await waitFor(() => expect(screen.getByText('Health')).toBeOnTheScreen());
    expect(mode()).toHaveTextContent('Week');
    expect(selected('Expense')).toBeOnTheScreen();
    expect(mockSetParams).toHaveBeenCalledWith({ filter: undefined, period: undefined });

    mockParams = {};
    view.rerender(<WithHeader />);
    await choose('all');
    mockParams = { filter: 'expense', period: 'week' };
    view.rerender(<WithHeader />);

    expect(mode()).toHaveTextContent('Week');
  });

  it('ignores an unknown period from a link', async () => {
    mockParams = { period: 'banana' };
    await start();

    expect(mode()).toHaveTextContent('All time');
  });
});
