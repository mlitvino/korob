import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';

import '@/locales';
import { AppProviders } from '@/contexts/AppProviders';
import { useTheme } from '@/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <AppProviders>
      <Inner />
    </AppProviders>
  );
}

function Inner() {
  const { canvas, mode } = useTheme();

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
    </>
  );
}
