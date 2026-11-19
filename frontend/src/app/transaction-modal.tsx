import { View, StyleSheet, Text, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid';

import type { Transaction } from '@/types/Transaction';
import { useAddTransaction } from '@/queries/transactions';
import { gutter, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import TransactionForm from '@/features/transaction-form/components/TransactionForm';
import HeaderLeft from '@/components/HeaderLeft';

export default function TransactionModal() {
  const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
  const addTransaction = useAddTransaction();
  const theme = useTheme();
  const currency = useCurrency();
  const { t } = useTranslation();

  if (type !== 'income' && type !== 'expense') {
    throw new Error('Error in transaction-modal.tsx: type is invalid');
  }

  /** Back to where the modal was opened; Home if it was opened without history. */
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)');
    }
  };

  const handleSubmit = async (
    amountCents: number,
    occurredAt: Date,
    categoryId: string,
  ) => {
    const now = new Date();
    const transaction: Transaction = {
      id: String(uuid.v4()),
      type,
      categoryId,
      amountCents,
      currency,
      occurredAt,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await addTransaction.mutateAsync(transaction);
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
        headerTitleStyle: { ...typography.title, color: theme.text },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerLeft: () => (
          <HeaderLeft
            icon={'arrow-back'}
            accessibilityLabel={t('nav.back')}
            onPress={goBack}
            style={styles.headerLeft}
          />
        ),
      }}/>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[typography.headline, styles.title, { color: theme.text }]}>
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
    paddingVertical: spacing.xxl,
    paddingHorizontal: gutter,
    gap: spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  headerLeft: {
    marginLeft: -spacing.md,
  },
});
