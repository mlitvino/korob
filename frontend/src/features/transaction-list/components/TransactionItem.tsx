import { Alert, Pressable, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '@/types/Transaction';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useCategoryById } from '@/queries/categories';
import { useDeleteTransaction } from '@/queries/transactions';
import {
  formatTimeInput,
  uses12HourClock,
} from '@/features/transaction-form/utils/dateTimeHelpers';

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const deleteTransaction = useDeleteTransaction();
  const categoryById = useCategoryById();
  const nameOf = useCategoryName();
  const category = categoryById(transaction.categoryId);
  const formatCurrency = useCurrencyFormatter();
  const occurredAt = new Date(transaction.occurredAt);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const valuePrefix = transaction.type === 'income' ? '+' : '\u2212';

  const confirmDelete = () => {
    Alert.alert(t('transaction.deleteTitle'), t('transaction.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('transaction.delete'),
        style: 'destructive',
        onPress: () => {
          deleteTransaction.mutate(transaction.id, {
            onError: (error) => {
              console.warn('Failed to delete transaction', error);
              Alert.alert(t('transaction.deleteFailed'));
            },
          });
        },
      },
    ]);
  };

  return (
    <Pressable
      onLongPress={confirmDelete}
      accessibilityHint={t('transaction.deleteHint')}
      accessibilityActions={[{ name: 'delete', label: t('transaction.delete') }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'delete') {
          confirmDelete();
        }
      }}
      style={({ pressed }) => [
        styles.transactionItem,
        { backgroundColor: theme.canvas, opacity: pressed ? opacity.pressed : 1 },
      ]}
    >
      <View style={styles.metaRow}>
        <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
          {formatTimeInput(occurredAt, uses12HourClock(i18n.language))}
        </Text>
        <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
          {category ? nameOf(category) : ''}
        </Text>
      </View>

      <Text style={[typography.title, styles.valueText, { color: valueColor }]}>
        {valuePrefix}{formatCurrency(transaction.amount, transaction.currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    textTransform: 'capitalize',
    opacity: opacity.secondary,
  },
  valueText: {
    fontWeight: '700',
  },
});
