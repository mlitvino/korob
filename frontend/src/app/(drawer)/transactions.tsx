import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

import DrawerMenuButton from '@/components/DrawerMenuButton';
import HeaderLeft from '@/components/HeaderLeft';
import { TransactionItem } from '@/features/transaction-list/components/TransactionItem';
import {
  TransactionDateSeparator,
} from '@/features/transaction-list/components/TransactionDateSeparator';
import {
  TransactionDetailsSheet,
} from '@/features/transaction-list/components/TransactionDetailsSheet';
import { TransactionFilterBar } from '@/features/transaction-list/components/TransactionFilterBar';
import { useTransactionSelection } from '@/features/transaction-list/hooks/useTransactionSelection';
import { useDeleteTransactions, useTransactions } from '@/queries/transactions';
import { gutter, opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useFilteredTransactions,
  type FilterType,
  type VisibleTransaction,
} from '@/features/transaction-list/hooks/useFilteredTransactions';
import type { Transaction } from '@/types/Transaction';

export default function Transactions() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const transactions = useTransactions();
  const { filter: filterParam } = useLocalSearchParams<{ filter?: FilterType }>();
  const [filter, setFilter] = useState<FilterType>(() => filterParam ?? 'all');
  const visibleTransactions = useFilteredTransactions(transactions, filter);
  const visibleIds = useMemo(
    () => visibleTransactions.map(({ transaction }) => transaction.id),
    [visibleTransactions],
  );
  const selection = useTransactionSelection(visibleIds);
  // mutate is stable; the mutation result object is not, so the header effect must not depend on it
  const { mutate: deleteMany, isPending: deleting } = useDeleteTransactions();
  const [details, setDetails] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [filterParam]);

  const confirmDeleteSelected = useCallback(() => {
    const ids = [...selection.selectedIds];
    Alert.alert(
      t('transaction.deleteSelectedTitle', { count: ids.length }),
      t('transaction.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('transaction.delete'),
          style: 'destructive',
          onPress: () => {
            deleteMany(ids, {
              onSuccess: selection.clear,
              onError: (error) => {
                console.warn('Failed to delete transactions', error);
                Alert.alert(t('transaction.deleteFailed'));
              },
            });
          },
        },
      ],
    );
  }, [deleteMany, selection.clear, selection.selectedIds, t]);

  // Selection mode replaces the header and keeps the drawer from opening by swipe.
  useLayoutEffect(() => {
    if (!selection.selecting) {
      navigation.setOptions({
        title: t('nav.transactions'),
        headerLeft: () => <DrawerMenuButton />,
        headerRight: undefined,
        swipeEnabled: true,
      });
      return;
    }
    navigation.setOptions({
      title: t('transaction.selectedCount', { count: selection.selectedIds.size }),
      headerLeft: () => (
        <HeaderLeft
          icon="close"
          accessibilityLabel={t('transaction.cancelSelection')}
          onPress={selection.clear}
          style={styles.headerLeft}
        />
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            onPress={selection.allSelected ? selection.clear : selection.selectAll}
            style={({ pressed }) => [styles.textButton, { opacity: pressed ? opacity.pressed : 1 }]}
          >
            <Text style={[typography.bodySm, styles.textButtonLabel, { color: theme.text }]}>
              {t(selection.allSelected ? 'transaction.deselectAll' : 'transaction.selectAll')}
            </Text>
          </Pressable>
          <HeaderLeft
            icon="delete"
            accessibilityLabel={t('transaction.deleteSelected')}
            onPress={deleting ? () => {} : confirmDeleteSelected}
          />
        </View>
      ),
      swipeEnabled: false,
    });
  }, [
    confirmDeleteSelected,
    deleting,
    navigation,
    selection,
    t,
    theme.text,
  ]);

  // Back leaves selection mode; leaving the screen ends it too.
  const selectingRef = useRef(selection.selecting);
  selectingRef.current = selection.selecting;
  const clearSelection = selection.clear;
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!selectingRef.current) {
        return false;
      }
      clearSelection();
      return true;
    });
    return () => {
      subscription.remove();
      clearSelection();
    };
  }, [clearSelection]));

  const openDetails = (transaction: Transaction) => {
    setDetails(transaction);
    setDetailsOpen(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <TransactionFilterBar filter={filter} onFilterChange={setFilter} />

      <FlatList
        style={styles.transactionList}
        contentContainerStyle={styles.transactionListContent}
        showsVerticalScrollIndicator={false}
        data={visibleTransactions}
        extraData={selection.selectedIds}
        keyExtractor={({ transaction }) => transaction.id}
        renderItem={({ item: { transaction, occurredAt, showDateSeparator } }: {
          item: VisibleTransaction;
        }) => (
          <View style={styles.listItem}>
            {showDateSeparator ? <TransactionDateSeparator occurredAt={occurredAt} /> : null}
            <TransactionItem
              transaction={transaction}
              selecting={selection.selecting}
              selected={selection.selectedIds.has(transaction.id)}
              onPress={() => (selection.selecting
                ? selection.toggle(transaction.id)
                : openDetails(transaction))}
              onLongPress={() => selection.toggle(transaction.id)}
            />
          </View>
        )}
      />

      {details
        ? (
          <TransactionDetailsSheet
            transaction={details}
            visible={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          />
        )
        : null}
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
  headerLeft: {
    marginLeft: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  textButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  textButtonLabel: {
    fontWeight: '600',
  },
});
