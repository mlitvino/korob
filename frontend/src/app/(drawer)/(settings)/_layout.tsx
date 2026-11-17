import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import DrawerMenuButton from '@/components/DrawerMenuButton';
import { typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function Layout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        animation: 'none',
        contentStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { ...typography.title, color: theme.text },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t('settings.title'), headerLeft: () => <DrawerMenuButton /> }}
      />
      <Stack.Screen name="appearance" options={{ title: t('appearance.title') }} />
      <Stack.Screen name="currency" options={{ title: t('currency.title') }} />
      <Stack.Screen name="language" options={{ title: t('settings.language') }} />
    </Stack>
  );
}
