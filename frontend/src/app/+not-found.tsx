import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{
        title: 'Oops! Not Found!',
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { color: theme.text },
      }}/>
      <View style={[styles.container, { backgroundColor: theme.canvas}] }>
        <Link href="/" style={[styles.button, { color: theme.text }]}>
          Go back to Home screen
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
