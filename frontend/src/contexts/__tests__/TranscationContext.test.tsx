import React from 'react';
import { Text, Button } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import {
  TransactionProvider,
  useBalance,
  useTransactionDispatch,
  useTransactions,
} from '@/contexts/TranscationContext';
import type { Transaction } from '@/types/Transaction';

const income: Transaction = {
  id: 'income-1',
  type: 'income',
  category: 'salary',
  amount: 100,
  createdAt: new Date(),
};

const expense: Transaction = {
  id: 'expense-1',
  type: 'expense',
  category: 'food',
  amount: 30,
  createdAt: new Date(),
};

function Harness() {
  const balance = useBalance();
  const transactions = useTransactions();
  const transactionDispatch = useTransactionDispatch();

  return (
    <>
      <Text testID="balance">{balance}</Text>
      <Text testID="count">{transactions.length}</Text>
      <Button
        title="add-income"
        onPress={() => transactionDispatch({ type: 'add', transaction: income })}
      />
      <Button
        title="add-expense"
        onPress={() => transactionDispatch({ type: 'add', transaction: expense })}
      />
      <Button
        title="remove-income"
        onPress={() => transactionDispatch({ type: 'remove', id: income.id })}
      />
      <Button
        title="clear"
        onPress={() => transactionDispatch({ type: 'clear' })}
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

describe('TransactionProvider balance', () => {
  it('derives the balance from added and removed transactions', () => {
    renderHarness();
    expect(screen.getByTestId('balance')).toHaveTextContent('0');

    fireEvent.press(screen.getByText('add-income'));
    expect(screen.getByTestId('balance')).toHaveTextContent('100');
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    fireEvent.press(screen.getByText('remove-income'));
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('nets income against expenses and resets when cleared', () => {
    renderHarness();

    fireEvent.press(screen.getByText('add-income'));
    fireEvent.press(screen.getByText('add-expense'));
    expect(screen.getByTestId('balance')).toHaveTextContent('70');
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    fireEvent.press(screen.getByText('clear'));
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
