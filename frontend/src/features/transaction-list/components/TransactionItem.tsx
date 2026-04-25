import { View, Text, StyleSheet } from 'react-native';

import type { Transaction } from '@/types/Transaction';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const createdAt = new Date(transaction.createdAt);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const valuePrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <View style={[styles.transactionItem, { backgroundColor: theme.canvas }]}>
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: theme.text }]}>
          {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={[styles.metaText, { color: theme.text }]}>
          {transaction.type}
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
