import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  ReactNode,
} from 'react';

import type { CurrencyCode } from '@/types/Currency';
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

type TransactionDispatch = (action: TransactionAction) => Promise<void>;

const initialState: TransactionState = [];
const TransactionContext = createContext<TransactionState | undefined>(undefined);
const TransactionDispatchContext = createContext<TransactionDispatch | undefined>(undefined);
const TransactionLoadingContext = createContext<boolean | undefined>(undefined);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, dispatch] = useReducer(transactionReducer, initialState);

  const [isLoading, setIsLoading] = useState(true);

  const transactionDispatch = useCallback<TransactionDispatch>(async (action) => {
    switch (action.type) {
      case 'add':
        await TransactionsRepo.insert(action.transaction);
        break;
      case 'remove':
        await TransactionsRepo.deleteById(action.id);
        break;
      case 'clear':
        await TransactionsRepo.clear();
        break;
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
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
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
        <TransactionLoadingContext.Provider value={isLoading}>
          {children}
        </TransactionLoadingContext.Provider>
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

export function useBalance(currency: CurrencyCode): number {
  const transactions = useTransactions();

  return useMemo(() => transactions
    .filter((t) => t.currency === currency)
    .reduce(
      (balance, t) => (t.type === 'income' ? balance + t.amount : balance - t.amount),
      0,
    ), [transactions, currency]);
}

export function useTransactionsLoading(): boolean {
  const ctx = useContext(TransactionLoadingContext);
  if (ctx === undefined) {
    throw new Error('useTransactionsLoading must be used within a TransactionProvider');
  }
  return ctx;
}

export function useTransactionDispatch(): TransactionDispatch {
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
