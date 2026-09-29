import { StyleSheet, useWindowDimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@/contexts/ThemeContext';
import HeaderLeft from '@/components/HeaderLeft';

const SWIPE_EDGE_WIDTH_RATIO = 0.2;

function DrawerMenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, object>>>();
  return (
    <HeaderLeft
      icon={'menu'}
      onPress={() => navigation.toggleDrawer()}
    />
  );
}

export default function Layout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: [styles.container, { backgroundColor: theme.canvas }],
        drawerLabelStyle: { color: theme.text },
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { color: theme.text },
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
        }}
      />
      {__DEV__ && (
        <Drawer.Screen
          name={'debug'}
          options={{
            title: 'Debug',
            drawerLabel: 'Debug',
          }}
        />
      )}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
  },
});
