import { ReactNode } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';

import { usePaperTheme } from '@/hooks/usePaperTheme';
import { queryClient } from '@/queries/queryClient';
import { SettingsProvider } from './SettingsContext';
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
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </PaperThemeProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
