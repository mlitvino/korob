import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/contexts/ThemeContext';
import type { FilterType } from '@/features/transaction-list/hooks/useFilteredTransactions';

type TransactionFilterBarProps = {
  filter: FilterType;
  onFilterChange: (nextFilter: FilterType) => void;
};

export function TransactionFilterBar({ filter, onFilterChange }: TransactionFilterBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.filterRow}>
      <Pressable
        style={[
          styles.filterButton,
          { borderColor: theme.separator },
          filter === 'all' && { backgroundColor: theme.elevated },
        ]}
        onPress={() => onFilterChange('all')}
      >
        <Text style={[styles.filterText, { color: theme.text }]}>{t('transaction.filterAll')}</Text>
      </Pressable>

      <Pressable
        style={[
          styles.filterButton,
          { borderColor: theme.separator },
          filter === 'income' && { backgroundColor: theme.income },
        ]}
        onPress={() => onFilterChange('income')}
      >
        <Text
          style={[
            styles.filterText,
            { color: filter === 'income' ? theme.contrastText : theme.text },
          ]}
        >
          {t('total.income')}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.filterButton,
          { borderColor: theme.separator },
          filter === 'expense' && { backgroundColor: theme.expense },
        ]}
        onPress={() => onFilterChange('expense')}
      >
        <Text
          style={[
            styles.filterText,
            { color: filter === 'expense' ? theme.contrastText : theme.text },
          ]}
        >
          {t('total.expense')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
