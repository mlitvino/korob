import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import uuid from 'react-native-uuid';

import type { Transaction } from '@/types/Transaction';

type TransactionProviderProps = {
  children: ReactNode;
};

type TransactionAction =
  | { type: 'add'; transaction: Omit<Transaction, 'id' | 'createdAt'> }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

type TransactionState = Transaction[];

const initialState: TransactionState = [];
const TransactionContext = createContext<TransactionState | undefined>(undefined);
const TransactionDispatchContext =
  createContext<Dispatch<TransactionAction> | undefined>(undefined);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionContext.Provider value={transactions}>
      <TransactionDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionDispatchContext.Provider>
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionState {
  const ctx = useContext(TransactionContext);
  if (ctx === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return ctx;
}

export function useTransactionDispatch(): Dispatch<TransactionAction> {
  const ctx = useContext(TransactionDispatchContext);
  if (ctx === undefined) {
    throw new Error('useTransactionDispatch must be used within a TransactionProvider');
  }
  return ctx;
}

function transactionReducer(transactions: TransactionState, action: TransactionAction) {
  switch (action.type) {
    case 'add': {
      const newTransaction: Transaction = {
        ...action.transaction,
        id: uuid.v4(),
        createdAt: new Date(),
      };

      return [
        newTransaction,
        ...transactions,
      ];
    }
    case 'remove': {
      return (
        transactions.filter(t => t.id !== action.id)
      );
    }
    case 'clear': {
      return initialState;
    }
    default: {
      throw new Error('Error: transactionReducer unknown action');
    }
  }
}
