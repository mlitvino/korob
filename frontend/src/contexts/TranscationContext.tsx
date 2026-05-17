import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';

import type { Transaction } from '@/types/Transaction';
import { TransactionsRepo } from '@/db/transactions.repo';
import { initDb } from '@/db/storage';

type TransactionProviderProps = {
  children: ReactNode;
};

type TransactionAction =
  | { type: 'add'; transaction: Transaction }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'set'; transactions: Transaction[] };

type TransactionState = Transaction[];

const initialState: TransactionState = [];
const TransactionContext = createContext<TransactionState | undefined>(undefined);
const TransactionDispatchContext =
  createContext<Dispatch<TransactionAction> | undefined>(undefined);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, dispatch] = useReducer(transactionReducer, initialState);
  const transactionDispatch = useCallback((action: TransactionAction) => {
    if (action.type === 'add') {
      void TransactionsRepo.insert(action.transaction).catch((error) => {
        console.warn('Failed to persist transaction', error);
      });
    }
    if (action.type === 'remove') {
      void TransactionsRepo.deleteById(action.id).catch((error) => {
        console.warn('Failed to remove transaction', error);
      });
    }
    if (action.type === 'clear') {
      void TransactionsRepo.clear().catch((error) => {
        console.warn('Failed to clear transactions', error);
      });
    }

    dispatch(action);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadTransactions = async () => {
      try {
        await initDb();
        const items = await TransactionsRepo.list();
        if (isActive) {
          dispatch({ type: 'set', transactions: items });
        }
      } catch (error) {
        console.warn('Failed to load transactions', error);
      }
    };

    void loadTransactions();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <TransactionContext.Provider value={transactions}>
      <TransactionDispatchContext.Provider value={transactionDispatch}>
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
      return [
        action.transaction,
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
    case 'set': {
      return action.transactions;
    }
    default: {
      throw new Error('Error: transactionReducer unknown action');
    }
  }
}
