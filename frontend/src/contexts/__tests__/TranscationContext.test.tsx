import React from 'react';
import { Text, Button } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

import {
  TransactionProvider,
  useBalance,
  useTransactionDispatch,
  useTransactions,
  useTransactionsLoading,
} from '@/contexts/TranscationContext';
import { TransactionsRepo } from '@/db/transactions.repo';
import type { Transaction } from '@/types/Transaction';

jest.mock('@/db/storage', () => ({ initDb: jest.fn().mockResolvedValue(undefined) }));
jest.mock('@/db/transactions.repo', () => ({
  TransactionsRepo: {
    list: jest.fn(),
    insert: jest.fn(),
    deleteById: jest.fn(),
    clear: jest.fn(),
  },
}));

const repo = jest.mocked(TransactionsRepo);

beforeEach(() => {
  jest.clearAllMocks();
  repo.list.mockResolvedValue([]);
  repo.insert.mockResolvedValue(undefined);
  repo.deleteById.mockResolvedValue(undefined);
  repo.clear.mockResolvedValue(undefined);
});

const income: Transaction = {
  id: 'income-1',
  type: 'income',
  category: 'salary',
  amount: 100,
  currency: 'EUR',
  occurredAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const expense: Transaction = {
  id: 'expense-1',
  type: 'expense',
  category: 'food',
  amount: 30,
  currency: 'EUR',
  occurredAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const usdIncome: Transaction = { ...income, id: 'income-usd', amount: 500, currency: 'USD' };

function Harness() {
  const balance = useBalance('EUR');
  const transactions = useTransactions();
  const transactionDispatch = useTransactionDispatch();
  const isLoading = useTransactionsLoading();
  const dispatch = (action: Parameters<typeof transactionDispatch>[0]) => {
    transactionDispatch(action).catch(() => {});
  };

  return (
    <>
      <Text testID="loading">{String(isLoading)}</Text>
      <Text testID="balance">{balance}</Text>
      <Text testID="count">{transactions.length}</Text>
      <Button
        title="add-income"
        onPress={() => dispatch({ type: 'add', transaction: income })}
      />
      <Button
        title="add-expense"
        onPress={() => dispatch({ type: 'add', transaction: expense })}
      />
      <Button
        title="add-usd-income"
        onPress={() => dispatch({ type: 'add', transaction: usdIncome })}
      />
      <Button
        title="remove-income"
        onPress={() => dispatch({ type: 'remove', id: income.id })}
      />
      <Button
        title="clear"
        onPress={() => dispatch({ type: 'clear' })}
      />
    </>
  );
}

function renderHarness() {
  return render(
    <TransactionProvider>
      <Harness />
    </TransactionProvider>,
  );
}

async function renderLoaded() {
  renderHarness();
  await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
}

describe('TransactionProvider balance', () => {
  it('derives the balance from added and removed transactions', async () => {
    await renderLoaded();
    expect(screen.getByTestId('balance')).toHaveTextContent('0');

    fireEvent.press(screen.getByText('add-income'));
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('100'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    fireEvent.press(screen.getByText('remove-income'));
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('0'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('nets income against expenses and resets when cleared', async () => {
    await renderLoaded();

    fireEvent.press(screen.getByText('add-income'));
    fireEvent.press(screen.getByText('add-expense'));
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('70'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    fireEvent.press(screen.getByText('clear'));
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('0'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('only counts transactions in the requested currency', async () => {
    await renderLoaded();

    fireEvent.press(screen.getByText('add-income'));
    fireEvent.press(screen.getByText('add-usd-income'));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));
    expect(screen.getByTestId('balance')).toHaveTextContent('100');
  });
});

describe('TransactionProvider persistence', () => {
  it('reports loading until stored transactions arrive', async () => {
    repo.list.mockResolvedValue([income]);
    renderHarness();
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('stops loading even if the database fails to load', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    repo.list.mockRejectedValue(new Error('db down'));
    await renderLoaded();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('does not show a transaction that failed to save', async () => {
    await renderLoaded();
    repo.insert.mockRejectedValue(new Error('disk full'));

    fireEvent.press(screen.getByText('add-income'));
    await waitFor(() => expect(repo.insert).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
  });
});
