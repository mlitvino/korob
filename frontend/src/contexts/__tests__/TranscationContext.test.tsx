import React from 'react';
import { Text, Button } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

import { BalanceProvider, useBalance, useBalanceDispatch } from '@/contexts/BalanceContext';
import {
  TransactionProvider,
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
  const balanceDispatch = useBalanceDispatch();
  const transactions = useTransactions();
  const transactionDispatch = useTransactionDispatch();

  return (
    <>
      <Text testID="balance">{balance}</Text>
      <Text testID="count">{transactions.length}</Text>
      <Button
        title="add-income"
        onPress={() => {
          balanceDispatch({ type: 'income', amount: income.amount });
          transactionDispatch({ type: 'add', transaction: income });
        }}
      />
      <Button
        title="add-expense"
        onPress={() => {
          balanceDispatch({ type: 'expense', amount: expense.amount });
          transactionDispatch({ type: 'add', transaction: expense });
        }}
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
    <BalanceProvider>
      <TransactionProvider>
        <Harness />
      </TransactionProvider>
    </BalanceProvider>,
  );
}

describe('TransactionProvider balance adjustments', () => {
  it('reverses the balance when a transaction is removed', async () => {
    renderHarness();
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('0'));

    fireEvent.press(screen.getByText('add-income'));
    expect(screen.getByTestId('balance')).toHaveTextContent('100');
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    fireEvent.press(screen.getByText('remove-income'));
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('resets the balance to zero when all transactions are cleared', async () => {
    renderHarness();
    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('0'));

    fireEvent.press(screen.getByText('add-income'));
    fireEvent.press(screen.getByText('add-expense'));
    expect(screen.getByTestId('balance')).toHaveTextContent('70');
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    fireEvent.press(screen.getByText('clear'));
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
