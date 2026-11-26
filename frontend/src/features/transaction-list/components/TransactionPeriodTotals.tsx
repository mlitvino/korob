import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { MissingRatesNote } from '@/components/MissingRatesNote';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import type { Totals } from '@/utils/period';

type TransactionPeriodTotalsProps = {
  /** Cents in the selected currency, other currencies converted. */
  totals: Totals;
};

export function TransactionPeriodTotals({ totals }: TransactionPeriodTotalsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const formatCurrency = useCurrencyFormatter();

  const columns = [
    { key: 'net', cents: totals.income - totals.expense, color: theme.text },
    { key: 'income', cents: totals.income, color: theme.income },
    { key: 'expense', cents: totals.expense, color: theme.expense },
  ] as const;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {columns.map(({ key, cents, color }) => (
          <View key={key} style={styles.column}>
            <Text
              numberOfLines={1}
              style={[typography.caption, styles.label, { color: theme.text }]}
            >
              {t(`total.${key}`)}
            </Text>
            <Text
              testID={`total-${key}`}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[typography.bodySm, styles.value, { color }]}
            >
              {totals.converted ? '≈ ' : ''}
              {formatCurrency(cents)}
            </Text>
          </View>
        ))}
      </View>
      <MissingRatesNote missing={totals.missing} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  label: {
    opacity: opacity.secondary,
  },
  value: {
    fontWeight: '700',
  },
});
