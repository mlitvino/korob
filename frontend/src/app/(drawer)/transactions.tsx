import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TransactionItem } from '@/features/transaction-list/components/TransactionItem';
import {
  TransactionDateSeparator,
} from '@/features/transaction-list/components/TransactionDateSeparator';
import {
  TransactionDetailsSheet,
} from '@/features/transaction-list/components/TransactionDetailsSheet';
import { TransactionFilterBar } from '@/features/transaction-list/components/TransactionFilterBar';
import { PeriodPicker } from '@/features/transaction-list/components/PeriodPicker';
import { TransactionPeriodBar } from '@/features/transaction-list/components/TransactionPeriodBar';
import {
  TransactionPeriodTotals,
} from '@/features/transaction-list/components/TransactionPeriodTotals';
import {
  useFilteredTransactions,
  type VisibleTransaction,
} from '@/features/transaction-list/hooks/useFilteredTransactions';
import { useListFilters } from '@/features/transaction-list/hooks/useListFilters';
import { useSelectionMode } from '@/features/transaction-list/hooks/useSelectionMode';
import { useTransactionTotals } from '@/features/transaction-list/hooks/useTransactionTotals';
import { useTransactions } from '@/queries/transactions';
import { gutter, opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import type { Transaction } from '@/types/Transaction';
import type { PeriodMode } from '@/utils/period';

export default function Transactions() {
  const theme = useTheme();
  const { t } = useTranslation();
  const transactions = useTransactions();
  const { filter, setFilter, period } = useListFilters();
  const [picker, setPicker] = useState<Exclude<PeriodMode, 'all'> | null>(null);
  const currency = useCurrency();
  const totals = useTransactionTotals(transactions, currency, period.bounds);
  const visibleTransactions = useFilteredTransactions(transactions, filter, period.bounds);
  const visibleIds = useMemo(
    () => visibleTransactions.map(({ transaction }) => transaction.id),
    [visibleTransactions],
  );
  const selection = useSelectionMode(visibleIds);
  const [details, setDetails] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const pressMode = (mode: PeriodMode) => {
    // a range has no default, so the mode changes only once the calendar is confirmed
    if (mode === 'range') {
      setPicker('range');
      return;
    }
    period.select(mode);
  };

  const openDetails = (transaction: Transaction) => {
    setDetails(transaction);
    setDetailsOpen(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <TransactionPeriodBar
        mode={period.mode}
        bounds={period.bounds}
        onModePress={pressMode}
        onStep={period.step}
        onTitlePress={() => setPicker(period.mode === 'all' ? null : period.mode)}
      />
      <TransactionFilterBar filter={filter} onFilterChange={setFilter} />
      <TransactionPeriodTotals totals={totals} />

      <FlatList
        style={styles.transactionList}
        contentContainerStyle={styles.transactionListContent}
        showsVerticalScrollIndicator={false}
        data={visibleTransactions}
        extraData={selection.selectedIds}
        keyExtractor={({ transaction }) => transaction.id}
        ListEmptyComponent={
          <Text style={[typography.body, styles.empty, { color: theme.text }]}>
            {t('transaction.empty')}
          </Text>
        }
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

      <PeriodPicker
        open={picker}
        anchor={period.anchor}
        range={period.mode === 'range' ? period.bounds : null}
        onPickDate={period.pickDate}
        onPickRange={period.pickRange}
        onClose={() => setPicker(null)}
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
    paddingTop: spacing.sm,
    paddingHorizontal: gutter,
  },
  transactionList: {
    alignSelf: 'stretch',
  },
  transactionListContent: {
    flexGrow: 1,
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  listItem: {
    gap: spacing.xs,
  },
  empty: {
    paddingTop: spacing.xl,
    textAlign: 'center',
    opacity: opacity.secondary,
  },
});
