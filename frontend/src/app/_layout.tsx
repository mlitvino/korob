import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import '@/locales';
import { sqliteDb } from '@/db/storage';
import { AppProviders } from '@/contexts/AppProviders';
import { useTheme } from '@/contexts/ThemeContext';
import { useCategoriesLoading } from '@/queries/categories';
import { useTransactionsLoading } from '@/queries/transactions';
import LoadingOverlay from '@/components/LoadingOverlay';
import StartupErrorScreen from '@/components/StartupErrorScreen';
import { useStartupError } from '@/queries/startup';

export default function RootLayout() {
  useDrizzleStudio(sqliteDb);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Inner />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

function Inner() {
  const { canvas, mode } = useTheme();
  const transactionsLoading = useTransactionsLoading();
  const categoriesLoading = useCategoriesLoading();
  const isLoading = transactionsLoading || categoriesLoading;
  const { error, retrying, retry } = useStartupError();

  useEffect(() => {
    setBackgroundColorAsync(canvas).catch(console.error);
  }, [canvas]);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="transaction-modal" options={{ presentation: 'modal' }} />
      </Stack>
      {isLoading || retrying
        ? <LoadingOverlay />
        : error
        ? <StartupErrorScreen error={error} onRetry={retry} />
        : null}
    </>
  );
}
