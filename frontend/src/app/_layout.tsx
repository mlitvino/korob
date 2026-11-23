import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import '@/locales';
import { sqliteDb } from '@/db/storage';
import { AppProviders } from '@/contexts/AppProviders';
import { useTheme } from '@/contexts/ThemeContext';
import LoadingOverlay from '@/features/app-shell/components/LoadingOverlay';
import StartupErrorScreen from '@/features/app-shell/components/StartupErrorScreen';
import { useStartup } from '@/queries/startup';

// Wraps the whole root layout, so its fallback renders outside the providers.
export { default as ErrorBoundary } from '@/features/app-shell/components/RootErrorFallback';

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
  const startup = useStartup();
  const covered = startup.status !== 'ready';

  useEffect(() => {
    setBackgroundColorAsync(canvas).catch(console.error);
  }, [canvas]);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {/* While an overlay covers the screens, screen readers must not reach them either. */}
      <View
        style={styles.screens}
        importantForAccessibility={covered ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={covered}
      >
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="transaction-modal" options={{ presentation: 'modal' }} />
        </Stack>
      </View>
      {startup.status === 'loading' && <LoadingOverlay />}
      {startup.status === 'error' && (
        <StartupErrorScreen error={startup.error} onRetry={startup.retry} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screens: { flex: 1 },
});
