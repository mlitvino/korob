import { View, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Transaction } from '@/types/Transaction';
import { useBalanceDispatch } from '@/contexts/BalanceContext';
import { useTransactionDispatch } from '@/contexts/TranscationContext';
import { useTheme } from '@/contexts/ThemeContext';
import TransactionForm from '@/components/TransactionForm';
import HeaderLeft from '@/components/HeaderLeft';

export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
  const balanceDispatch = useBalanceDispatch();
  const transactionDispatch = useTransactionDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

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
        title: type === 'income'
          ? t('transaction.addIncome')
          : t('transaction.addExpense'),
        headerStyle: { backgroundColor: theme.elevated },
        headerTitleStyle: { color: theme.text },
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={styles.headerLeftOffset}>
            <HeaderLeft
              icon={'keyboard-arrow-left'}
              onPress={() => router.push('/(drawer)')}
              style={{ marginLeft: 0 }}
            />
          </View>
        ),
      }}/>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {type === 'income'
            ? t('total.income')
            : t('total.expense')
          }
        </Text>
        <TransactionForm
          onSubmit={handleSubmit}
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
  headerLeftOffset: {
    marginLeft: -10,
  },
});
