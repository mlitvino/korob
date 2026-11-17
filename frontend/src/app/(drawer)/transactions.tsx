import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { TransactionItem } from '@/features/transaction-list/components/TransactionItem';
import {
  TransactionDateSeparator,
} from '@/features/transaction-list/components/TransactionDateSeparator';
import { TransactionFilterBar } from '@/features/transaction-list/components/TransactionFilterBar';
import { useTransactions } from '@/queries/transactions';
import { gutter, spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useFilteredTransactions, type FilterType, type VisibleTransaction,
} from '@/features/transaction-list/hooks/useFilteredTransactions';

export default function Transactions() {
  const theme = useTheme();
  const transactions = useTransactions();
  const { filter: filterParam } = useLocalSearchParams<{ filter?: FilterType }>();
  const [filter, setFilter] = useState<FilterType>(() => filterParam ?? 'all');
  const visibleTransactions = useFilteredTransactions(transactions, filter);

  useEffect(() => {
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [filterParam]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <TransactionFilterBar filter={filter} onFilterChange={setFilter} />

      <FlatList
        style={styles.transactionList}
        contentContainerStyle={styles.transactionListContent}
        showsVerticalScrollIndicator={false}
        data={visibleTransactions}
        keyExtractor={({ transaction }) => transaction.id}
        renderItem={({ item: { transaction, occurredAt, showDateSeparator } }: {
          item: VisibleTransaction;
        }) => (
          <View style={styles.listItem}>
            {showDateSeparator ? <TransactionDateSeparator occurredAt={occurredAt} /> : null}
            <TransactionItem transaction={transaction} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: gutter,
  },
  transactionList: {
    alignSelf: 'stretch',
  },
  transactionListContent: {
    flexGrow: 1,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  listItem: {
    gap: spacing.sm,
  },
});
