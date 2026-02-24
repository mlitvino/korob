import { StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: styles.container
      }}
    >
      <Drawer.Screen
        name={'index'}
        options={{
          title: 'overview',
          drawerLabel: 'Home',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: '#222025'
  },
  header: {
    backgroundColor: '#413d46'
  },
  headerTitle: {
    color: '#fff',
  },
})
