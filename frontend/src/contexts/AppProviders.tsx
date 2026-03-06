import { ReactNode } from 'react';

import { BalanceProvider } from './BalanceContext';
import { TransactionProvider } from './TranscationContext';
import { ThemeProvider } from './ThemeContext';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <BalanceProvider>
          {children}
        </BalanceProvider>
      </TransactionProvider>
    </ThemeProvider>
  );
}
