import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/contexts/ThemeContext';
import HeaderLeft from '@/components/HeaderLeft';

export default function Layout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: [styles.container, { backgroundColor: theme.canvas }],
        drawerLabelStyle: { color: theme.text },
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { color: theme.text },
        headerShadowVisible: false,
        headerLeft: () => <HeaderLeft />,
      }}
    >
      <Drawer.Screen
        name={'index'}
        options={{
          title: t('nav.home'),
          drawerLabel: t('nav.home'),
        }}
      />
      <Drawer.Screen
        name={'transactions'}
        options={{
          title: t('nav.transactions'),
          drawerLabel: t('nav.transactions'),
        }}
      />
      <Drawer.Screen
        name={'(settings)'}
        options={{
          title: t('nav.settings'),
          drawerLabel: t('nav.settings'),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
  },
});
