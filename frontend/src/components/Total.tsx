import { Text, View, StyleSheet } from 'react-native';

import type { TransactionType } from '@/types/Transaction';
import { useTransactions } from '@/contexts/TranscationContext';
import { useTheme } from '@/contexts/ThemeContext';

type TotalProps = {
  type: TransactionType;
};

export default function Total({ type }: TotalProps) {
  const theme = useTheme();
  const transactions = useTransactions();

  const total = transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.separator}]}>
        <Text style={[styles.headerText, { color: theme.text }]}>{type}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.categoryText, { color: theme.text }]}>all-time</Text>
        <Text style={[styles.totalText, { color: theme.text }]}>{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  body: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  totalText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
