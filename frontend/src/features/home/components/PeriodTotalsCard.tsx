import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from '@/types/Transaction';
import { PERIODS, periodTotals, type Period } from '@/features/home/periodTotals';
import { useTransactions } from '@/queries/transactions';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { MissingRatesNote } from '@/components/MissingRatesNote';
import { useExchangeRates } from '@/queries/exchangeRates';

const PERIOD_LABELS = {
  month: 'total.month',
  week: 'total.week',
  day: 'total.day',
} as const satisfies Record<Period, string>;

const TYPES: readonly TransactionType[] = ['income', 'expense'];

/** Up to the row edges; sideways only half the gap, so neighbouring cells never share a tap. */
const HIT_SLOP = {
  top: spacing.md,
  bottom: spacing.md,
  left: spacing.sm / 2,
  right: spacing.sm / 2,
};

type PeriodTotalsCardProps = {
  /** Called on a tap in a row: an amount gives its type, the period name gives `all`. */
  onSelect: (type: TransactionType | 'all', period: Period) => void;
};

export default function PeriodTotalsCard({ onSelect }: PeriodTotalsCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const transactions = useTransactions();
  const currency = useCurrency();

  const rates = useExchangeRates();
  const totals = periodTotals(transactions, currency, new Date(), rates);
  const missing = [...new Set(PERIODS.flatMap((period) => totals[period].missing))];

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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(PERIOD_LABELS[period])}
            onPress={() => onSelect('all', period)}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.labelCell, pressed && styles.pressed]}
          >
            <Text style={[typography.body, { color: theme.text }]} numberOfLines={1}>
              {t(PERIOD_LABELS[period])}
            </Text>
          </Pressable>
          {TYPES.map((type) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityLabel={`${t(PERIOD_LABELS[period])}, ${t(`total.${type}`)}`}
              onPress={() => onSelect(type, period)}
              hitSlop={HIT_SLOP}
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
      {missing.length > 0
        ? (
          <View style={styles.note}>
            <MissingRatesNote missing={missing} />
          </View>
        )
        : null}
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
  note: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
