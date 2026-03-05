import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { setBackgroundColorAsync } from 'expo-system-ui';

import { AppProviders } from '@/contexts/AppProviders';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RootLayout() {
  const canvas = useThemeColor({}, 'canvas');

  useEffect(() => {
    setBackgroundColorAsync(canvas)
      .catch(err => console.error('Failed to change root background color:', err));
  }, [canvas]);

  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name={'(drawer)'} options={{ headerShown: false }}  />
        <Stack.Screen name={'transaction-modal'} options={{ presentation: 'modal' }}  />
      </Stack>
    </AppProviders>
  );
}
