import { View, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { Transaction } from '@/types/Transaction';
import { useBalanceDispatch } from '@/contexts/BalanceContext';
import { useTransactionDispatch } from '@/contexts/TranscationContext';
import TransactionForm from '@/components/TransactionForm';


export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
  const balanceDispatch = useBalanceDispatch();
  const transactionDispatch = useTransactionDispatch();

  if (type !== 'income' && type !== 'expense') {
    throw new Error('Error in transaction-modal.tsx: type is invalid');
  }

  const handleSubmit = (amount: number) => {
    const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
      type,
      amount,
    };

    balanceDispatch({ type, amount });
    transactionDispatch({ type: 'add',  transaction});
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{
        title: type === 'income' ? 'Add Income' : 'Add Expense',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}/>

      <View style={styles.container}>
        <Text style={styles.title}>
          {type === 'income' ? 'Income' : 'Expense'}
        </Text>
        <TransactionForm
          onSubmit={handleSubmit}
          buttonLabel={type === 'income' ? 'Add Income' : 'Add Expense'}
        />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#413d46',
  },
  headerTitle: {
    color: '#fff',
  },
});
