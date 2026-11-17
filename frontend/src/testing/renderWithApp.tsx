// Test-only: renders UI with the app's providers and a fresh query client.
import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/locales';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { createQueryClient } from '@/queries/queryClient';

const NO_INSETS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function renderWithApp(ui: ReactElement) {
  const client = createQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <SafeAreaProvider initialMetrics={NO_INSETS}>
      <SettingsProvider>
        <ThemeProvider>
          <PaperProvider>
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
          </PaperProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
  return { client, ...render(ui, { wrapper: Wrapper }) };
}
