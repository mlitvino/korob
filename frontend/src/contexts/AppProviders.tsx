import { ReactNode } from 'react';
import { BalanceProvider } from './BalanceContext';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BalanceProvider>
      {children}
    </BalanceProvider>
  );
}
