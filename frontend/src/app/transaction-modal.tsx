import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();

  return (
    <>
      <Stack.Screen options={{
        title: 'Modal screen',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}/>
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          <Text>Go back to Home screen from modal</Text>
        </Link>
      </View>

      {type === 'income' && (
        <View style={styles.container}>
          <Link href="/" style={styles.button}>
            <Text>Income screen. Go back</Text>
          </Link>
        </View>
      )}

      {type === 'expense' && (
        <View style={styles.container}>
          <Link href="/" style={styles.button}>
            <Text>Expense screen. Go back</Text>
          </Link>
        </View>
      )}
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
