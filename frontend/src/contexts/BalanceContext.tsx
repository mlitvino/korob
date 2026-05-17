import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';

import { loadJson, saveJson, STORAGE_KEYS } from '@/storage/persist';

type BalanceProviderProps = {
  children: ReactNode;
};

type BalanceAction =
  | { type: 'income'; amount: number }
  | { type: 'expense'; amount: number }
  | { type: 'set'; value: number };

const initialBalance = 0;
const BalanceContext = createContext<number | undefined>(undefined);
const BalanceDispatchContext = createContext<Dispatch<BalanceAction> | undefined>(undefined);

export function BalanceProvider({ children }: BalanceProviderProps) {
  const [balance, dispatch] = useReducer(balanceReducer, initialBalance);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const storedBalance = await loadJson<number>(STORAGE_KEYS.balance);
      if (isActive && typeof storedBalance === 'number') {
        dispatch({ type: 'set', value: storedBalance });
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    void saveJson(STORAGE_KEYS.balance, balance);
  }, [balance]);

  return (
    <BalanceContext value={balance}>
      <BalanceDispatchContext value={dispatch}>
        {children}
      </BalanceDispatchContext>
    </BalanceContext>
  );
};

export function useBalance() {
  const ctx = useContext(BalanceContext);
  if (ctx === undefined) {
    throw new Error('Error in BalanceContext.tsx: BalanceContext is undefined');
  }
  return ctx;
}

export function useBalanceDispatch() {
  const ctx = useContext(BalanceDispatchContext);
  if (ctx === undefined) {
    throw new Error('Error in BalanceContext.tsx: BalanceDispatchContext is undefined');
  }
  return ctx;
}

function balanceReducer(balance: number, action: BalanceAction) {
  switch (action.type) {
    case 'income': {
      return balance + action.amount;
    };
    case 'expense': {
      return balance - action.amount;
    };
    case 'set': {
      return action.value;
    };
    default: {
      throw new Error('Error in BalanceContext.tsx: balanceReducer unknwon action.type');
    }
  }
}
