import { View, Text, StyleSheet } from 'react-native';

import type { Transaction } from '@/types/Transaction';

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <View style={styles.transactionItem}>
      <Text style={styles.text}>
        {transaction.type}: {transaction.amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#413d46',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
  },
});
