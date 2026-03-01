import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{
        title: 'Oops! Not Found!',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}/>
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222025',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  header: {
    backgroundColor: '#413d46',
  },
  headerTitle: {
    color: '#fff',
  },
});
