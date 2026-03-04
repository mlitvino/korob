import { View, Text, StyleSheet } from 'react-native';

import { useTransactions } from '@/contexts/TranscationContext';
import { TransactionItem } from '@/components/TransactionItem';


export default function Transactions() {
  const transactions = useTransactions();

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>list</Text>
      <View>
        {transactions.map(t =>
          <TransactionItem key={t.id} transaction={t}/>,
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2f2e33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
