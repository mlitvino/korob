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
  let previousDateKey = '';

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
        {transactions.map((t) => {
          if (filter !== 'all' && t.type !== filter) {
            return null;
          }

          const createdAt = new Date(t.createdAt);
          const dateKey = createdAt.toDateString();
          const showDateSeparator = dateKey !== previousDateKey;
          previousDateKey = dateKey;

          return (
            <View key={t.id}>
              {showDateSeparator && (
                <View style={styles.dateSeparatorWrap}>
                  <View style={[styles.dateLine, { backgroundColor: theme.separator }]} />
                  <Text style={[styles.dateSeparatorText, { color: theme.text }]}>
                    {createdAt.toLocaleDateString(undefined, {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                  <View style={[styles.dateLine, { backgroundColor: theme.separator }]} />
                </View>
              )}

              <TransactionItem transaction={t} />
            </View>
          );
        })}
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
  dateSeparatorWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    textTransform: 'uppercase',
  },
});
