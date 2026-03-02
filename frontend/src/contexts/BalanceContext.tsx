import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';

type BalanceProviderProps = {
  children: ReactNode;
};

type BalanceAction =
  | { type: 'income'; amount: number }
  | { type: 'expense'; amount: number }

const initialBalance = 0;
const BalanceContext = createContext<number | undefined>(undefined);
const BalanceDispatchContext = createContext<Dispatch<BalanceAction> | undefined>(undefined);

export function BalanceProvider({ children }: BalanceProviderProps) {
  const [balance, dispatch] = useReducer(balanceReducer, initialBalance);

  return (
    <BalanceContext value={balance}>
      <BalanceDispatchContext value={dispatch}>
        {children}
      </BalanceDispatchContext>
    </BalanceContext>
  );
};

export function useBalance() {
  return useContext(BalanceContext);
}

export function useBalanceDispatch() {
  return useContext(BalanceDispatchContext);
}

function balanceReducer(balance: number, action: BalanceAction) {
  switch (action.type) {
    case 'income': {
      return balance + action.amount;
    };
    case 'expense': {
      return balance - action.amount;
    };
    default: {
      console.warn('WARN: balanceReducer unknwon action.type');
      return balance;
    }
  }
}
