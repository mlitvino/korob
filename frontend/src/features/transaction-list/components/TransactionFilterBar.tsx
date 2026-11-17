import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { opacity, radius, spacing, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import type { FilterType } from '@/features/transaction-list/hooks/useFilteredTransactions';

type TransactionFilterBarProps = {
  filter: FilterType;
  onFilterChange: (nextFilter: FilterType) => void;
};

type FilterLabelKey = 'transaction.filterAll' | 'total.income' | 'total.expense';

const FILTERS: { value: FilterType; labelKey: FilterLabelKey }[] = [
  { value: 'all', labelKey: 'transaction.filterAll' },
  { value: 'income', labelKey: 'total.income' },
  { value: 'expense', labelKey: 'total.expense' },
];

export function TransactionFilterBar({ filter, onFilterChange }: TransactionFilterBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.filterRow}>
      {FILTERS.map(({ value, labelKey }) => {
        const isSelected = filter === value;
        const fill = value === 'all' ? theme.elevated : theme[value];
        const textColor = isSelected && value !== 'all' ? theme.contrastText : theme.text;

        return (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.filterButton,
              {
                borderColor: isSelected ? fill : theme.separator,
                backgroundColor: isSelected ? fill : 'transparent',
                opacity: pressed ? opacity.pressed : 1,
              },
            ]}
            onPress={() => onFilterChange(value)}
          >
            <Text style={[typography.body, styles.filterText, { color: textColor }]}>
              {t(labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    minHeight: touchTarget,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontWeight: '600',
  },
});
