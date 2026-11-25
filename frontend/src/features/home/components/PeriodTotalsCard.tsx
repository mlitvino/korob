import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from '@/types/Transaction';
import { PERIODS, periodTotals, type Period } from '@/features/home/periodTotals';
import { useTransactions } from '@/queries/transactions';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

const PERIOD_LABELS = {
  month: 'total.month',
  week: 'total.week',
  day: 'total.day',
} as const satisfies Record<Period, string>;

const TYPES: readonly TransactionType[] = ['income', 'expense'];

type PeriodTotalsCardProps = {
  /** Called when an income or expense amount is tapped. */
  onSelectType: (type: TransactionType) => void;
};

export default function PeriodTotalsCard({ onSelectType }: PeriodTotalsCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const transactions = useTransactions();
  const currency = useCurrency();

  const totals = periodTotals(transactions, currency, new Date());

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={[styles.row, styles.headerRow, { borderBottomColor: theme.separator }]}>
        <View style={styles.labelCell} />
        {TYPES.map((type) => (
          <Text
            key={type}
            style={[typography.body, styles.amountCell, styles.headerText, { color: theme.text }]}
            numberOfLines={1}
          >
            {t(`total.${type}`)}
          </Text>
        ))}
      </View>

      {PERIODS.map((period, index) => (
        <View
          key={period}
          style={[
            styles.row,
            index > 0 &&
            { borderTopColor: theme.separator, borderTopWidth: StyleSheet.hairlineWidth },
          ]}
        >
          <Text
            style={[typography.body, styles.labelCell, { color: theme.text }]}
            numberOfLines={1}
          >
            {t(PERIOD_LABELS[period])}
          </Text>
          {TYPES.map((type) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityLabel={`${t(PERIOD_LABELS[period])}, ${t(`total.${type}`)}`}
              onPress={() => onSelectType(type)}
              style={({ pressed }) => [styles.amountCell, pressed && styles.pressed]}
            >
              <Text
                style={[typography.body, styles.amountText, { color: theme.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatCurrency(totals[period][type])}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  labelCell: {
    flex: 0.7,
    minWidth: 0,
  },
  amountCell: {
    flex: 1,
    minWidth: 0,
  },
  amountText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
