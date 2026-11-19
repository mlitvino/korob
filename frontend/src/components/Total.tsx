import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from '@/types/Transaction';
import { useTransactions } from '@/queries/transactions';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

type TotalProps = {
  /** Which all-time total to show. */
  type: TransactionType;
};

export default function Total({ type }: TotalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const transactions = useTransactions();
  const currency = useCurrency();

  const total = transactions
    .filter(t => t.type === type && t.currency === currency)
    .reduce((sum, t) => sum + t.amountCents, 0);

  const header = type === 'income' ? t('total.income') : t('total.expense');

  return (
    <View>
      <View style={[styles.header, { borderBottomColor: theme.separator}]}>
        <Text style={[typography.title, styles.headerText, { color: theme.text }]}>{header}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[typography.body, { color: theme.text }]}>
          {t('total.allTime')}
        </Text>
        <Text
          style={[typography.headline, styles.totalText, { color: theme.text }]}
          numberOfLines={1}
        >
          {formatCurrency(total)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    textTransform: 'capitalize',
  },
  body: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  totalText: {
    fontWeight: '600',
  },
});
