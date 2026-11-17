import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '@/types/Transaction';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
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
  const formatCurrency = useCurrencyFormatter();
  const occurredAt = new Date(transaction.occurredAt);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const valuePrefix = transaction.type === 'income' ? '+' : '\u2212';

  return (
    <View style={[styles.transactionItem, { backgroundColor: theme.canvas }]}>
      <View style={styles.metaRow}>
        <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
          {formatTimeInput(occurredAt, uses12HourClock(i18n.language))}
        </Text>
        <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
          {t(`category.${transaction.category}`)}
        </Text>
      </View>

      <Text style={[typography.title, styles.valueText, { color: valueColor }]}>
        {valuePrefix}{formatCurrency(transaction.amount, transaction.currency)}
      </Text>
    </View>
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
