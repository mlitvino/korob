import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { TransactionItem } from '@/features/transaction-list/components/TransactionItem';
import {
  TransactionDateSeparator,
} from '@/features/transaction-list/components/TransactionDateSeparator';
import { TransactionFilterBar } from '@/features/transaction-list/components/TransactionFilterBar';
import { useTransactions } from '@/contexts/TranscationContext';
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
        renderItem={({ item: { transaction, createdAt, showDateSeparator } }: {
          item: VisibleTransaction;
        }) => (
          <View>
            {showDateSeparator ? <TransactionDateSeparator createdAt={createdAt} /> : null}
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
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  transactionList: {
    width: '100%',
    alignSelf: 'stretch',
  },
  transactionListContent: {
    flexGrow: 1,
  },
});
