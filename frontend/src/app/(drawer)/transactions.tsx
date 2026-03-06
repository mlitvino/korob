import { View, Text, StyleSheet } from 'react-native';

import { useTransactions } from '@/contexts/TranscationContext';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/contexts/ThemeContext';


export default function Transactions() {
  const theme = useTheme();
  const transactions = useTransactions();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>list</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
