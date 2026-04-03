import { View, Text, StyleSheet } from 'react-native';

import type { Transaction } from '@/types/Transaction';
import { useTheme } from '@/contexts/ThemeContext';

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const theme = useTheme();

  return (
    <View style={[styles.transactionItem, { backgroundColor: theme.canvas }]}>
      <Text style={{ color: theme.text }}>
        {transaction.createdAt.toLocaleTimeString()} {transaction.type}: {transaction.amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    padding: 10,
    marginVertical: 5,
  },
});
