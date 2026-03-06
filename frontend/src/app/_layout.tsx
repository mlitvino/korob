import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { setBackgroundColorAsync } from 'expo-system-ui';

import { AppProviders } from '@/contexts/AppProviders';
import { useThemeColor } from '@/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <AppProviders>
      <Inner />
    </AppProviders>
  );
}

function Inner() {
  const canvas = useThemeColor('canvas');

  useEffect(() => {
    setBackgroundColorAsync(canvas).catch(console.error);
  }, [canvas]);

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="transaction-modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
