import { fireEvent, screen } from '@testing-library/react-native';

import PeriodTotalsCard from '@/features/home/components/PeriodTotalsCard';
import { renderWithApp } from '@/testing/renderWithApp';
import type { Transaction } from '@/types/Transaction';

const now = new Date();
const tx = (id: string, type: Transaction['type'], amountCents: number): Transaction => ({
  id,
  type,
  categoryId: `${type}-other`,
  amountCents,
  currency: 'EUR',
  occurredAt: now,
  createdAt: now,
  updatedAt: now,
});

let mockTransactions: Transaction[] = [];

jest.mock('@/queries/transactions', () => ({
  useTransactions: () => mockTransactions,
}));

describe('PeriodTotalsCard', () => {
  beforeEach(() => {
    mockTransactions = [tx('a', 'income', 12345), tx('b', 'expense', 500)];
  });

  it('shows the month, week and day rows with their totals', () => {
    renderWithApp(<PeriodTotalsCard onSelect={jest.fn()} />);

    expect(screen.getByText('Month')).toBeOnTheScreen();
    expect(screen.getByText('Week')).toBeOnTheScreen();
    expect(screen.getByText('Day')).toBeOnTheScreen();
    expect(screen.getAllByText('€123.45')).toHaveLength(3);
    expect(screen.getAllByText('€5.00')).toHaveLength(3);
  });

  it('reports which type and period were tapped', () => {
    const onSelect = jest.fn();
    renderWithApp(<PeriodTotalsCard onSelect={onSelect} />);

    fireEvent.press(screen.getByLabelText('Day, Expense'));
    fireEvent.press(screen.getByLabelText('Week, Income'));

    expect(onSelect).toHaveBeenNthCalledWith(1, 'expense', 'day');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'income', 'week');
  });

  it('asks for every type when a period name is tapped', () => {
    const onSelect = jest.fn();
    renderWithApp(<PeriodTotalsCard onSelect={onSelect} />);

    fireEvent.press(screen.getByRole('button', { name: 'Month' }));
    fireEvent.press(screen.getByRole('button', { name: 'Day' }));

    expect(onSelect).toHaveBeenNthCalledWith(1, 'all', 'month');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'all', 'day');
  });
});
