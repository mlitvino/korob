import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '@/types/Transaction';
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
  const createdAt = new Date(transaction.createdAt);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const valuePrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <View style={[styles.transactionItem, { backgroundColor: theme.canvas }]}>
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: theme.text }]}>
          {formatTimeInput(createdAt, uses12HourClock(i18n.language))}
        </Text>
        <Text style={[styles.metaText, { color: theme.text }]}>
          {t(`category.${transaction.category}`)}
        </Text>
      </View>

      <Text style={[styles.valueText, { color: valueColor }]}>
        {valuePrefix}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderRadius: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    textTransform: 'capitalize',
    opacity: 0.85,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
