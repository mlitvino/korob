import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

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
