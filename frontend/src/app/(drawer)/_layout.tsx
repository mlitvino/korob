import { useWindowDimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

import { radius, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import DrawerMenuButton from '@/components/DrawerMenuButton';

const SWIPE_EDGE_WIDTH_RATIO = 0.2;
const DRAWER_WIDTH = 280;

export default function Layout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { width: DRAWER_WIDTH, backgroundColor: theme.canvas },
        drawerItemStyle: { minHeight: touchTarget, borderRadius: radius.full },
        drawerLabelStyle: { ...typography.body, fontWeight: '600' },
        drawerActiveBackgroundColor: theme.inset,
        drawerActiveTintColor: theme.text,
        drawerInactiveTintColor: theme.text,
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { ...typography.title, color: theme.text },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerLeft: () => <DrawerMenuButton />,
        swipeEdgeWidth: width * SWIPE_EDGE_WIDTH_RATIO,
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
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={'debug'}
        options={{
          title: 'Debug',
          drawerLabel: 'Debug',
          drawerItemStyle: __DEV__
            ? { minHeight: touchTarget, borderRadius: radius.full }
            : { display: 'none' },
        }}
      />
    </Drawer>
  );
}
