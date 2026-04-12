import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useTransactions } from '@/contexts/TranscationContext';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/contexts/ThemeContext';
import type { TransactionType } from '@/types/Transaction';

type FilterType = 'all' | TransactionType;


export default function Transactions() {
  const theme = useTheme();
  const transactions = useTransactions();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === filter);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterButton,
            { borderColor: theme.separator },
            filter === 'all' && { backgroundColor: theme.elevated },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, { color: theme.text }]}>All</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            { borderColor: theme.separator },
            filter === 'income' && { backgroundColor: theme.income },
          ]}
          onPress={() => setFilter('income')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'income' ? theme.contrastText : theme.text },
            ]}
          >
            Income
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            { borderColor: theme.separator },
            filter === 'expense' && { backgroundColor: theme.expense },
          ]}
          onPress={() => setFilter('expense')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'expense' ? theme.contrastText : theme.text },
            ]}
          >
            Expense
          </Text>
        </Pressable>
      </View>

      <View style={styles.transactionList}>
        {filteredTransactions.map(t =>
          <TransactionItem key={t.id} transaction={t} />,
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  filterRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  transactionList: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
