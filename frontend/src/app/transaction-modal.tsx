import { View, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { Transaction } from '@/types/Transaction';
import { useBalanceDispatch } from '@/contexts/BalanceContext';
import { useTransactionDispatch } from '@/contexts/TranscationContext';
import { useTheme } from '@/contexts/ThemeContext';
import TransactionForm from '@/components/TransactionForm';


export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
  const balanceDispatch = useBalanceDispatch();
  const transactionDispatch = useTransactionDispatch();
  const theme = useTheme();

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
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { color: theme.text },
      }}/>

      <View style={[styles.container, { backgroundColor: theme.canvas }]}>
        <Text style={[styles.title, { color: theme.text }]}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
