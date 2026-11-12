import { View, StyleSheet, Text, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid';

import { Transaction, TransactionCategory } from '@/types/Transaction';
import { useTransactionDispatch } from '@/contexts/TranscationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import TransactionForm from '@/features/transaction-form/components/TransactionForm';
import HeaderLeft from '@/components/HeaderLeft';

export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
  const transactionDispatch = useTransactionDispatch();
  const theme = useTheme();
  const currency = useCurrency();
  const { t } = useTranslation();

  if (type !== 'income' && type !== 'expense') {
    throw new Error('Error in transaction-modal.tsx: type is invalid');
  }

  const handleSubmit = async (
    amount: number,
    occurredAt: Date,
    category: TransactionCategory,
  ) => {
    const now = new Date();
    const transaction: Transaction = {
      id: String(uuid.v4()),
      type,
      category,
      amount,
      currency,
      occurredAt,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await transactionDispatch({ type: 'add', transaction });
      router.back();
    } catch (error) {
      console.warn('Failed to persist transaction', error);
      Alert.alert(t('transaction.saveFailed'));
    }
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
          transactionType={type}
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
