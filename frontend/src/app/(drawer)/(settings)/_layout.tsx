import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/use-theme-color';

export default function Layout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="appearance" />
    </Stack>
  );
}
