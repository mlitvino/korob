import { ReactNode } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PaperProvider } from 'react-native-paper';

import { usePaperTheme } from '@/hooks/usePaperTheme';
import { BalanceProvider } from './BalanceContext';
import { SettingsProvider } from './SettingsContext';
import { TransactionProvider } from './TranscationContext';
import { ThemeProvider } from './ThemeContext';

type AppProvidersProps = {
  children: ReactNode;
};

type PaperIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const paperSettings = {
  icon: ({ name, color, size }: { name: string; color?: string; size?: number }) => (
    <MaterialCommunityIcons name={name as PaperIconName} color={color} size={size} />
  ),
};

function PaperThemeProvider({ children }: AppProvidersProps) {
  const paperTheme = usePaperTheme();

  return (
    <PaperProvider theme={paperTheme} settings={paperSettings}>
      {children}
    </PaperProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <PaperThemeProvider>
          <BalanceProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </BalanceProvider>
        </PaperThemeProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
