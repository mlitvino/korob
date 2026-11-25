import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from '@/types/Transaction';
import { useBalance } from '@/queries/transactions';
import CircleButton from '@/components/CircleButton';
import PeriodTotalsCard from '@/features/home/components/PeriodTotalsCard';
import { gutter, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/SettingsContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

export default function Index() {
  const currency = useCurrency();
  const balance = useBalance(currency);
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const { t } = useTranslation();

  const addIncome = () => {
    router.push('/transaction-modal?type=income');
  };

  const addExpense = () => {
    router.push('/transaction-modal?type=expense');
  };

  const viewTransactions = (type: TransactionType) => {
    router.push(`/transactions?filter=${type}`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PeriodTotalsCard onSelectType={viewTransactions} />

      <View style={styles.content}>
        <View style={[styles.balancePanel, { backgroundColor: theme.surface }]}>
          <CircleButton
            kind="income"
            accessibilityLabel={t('transaction.addIncome')}
            onPress={addIncome}
          />

          <View style={[styles.balanceBlock, { backgroundColor: theme.inset }]}>
            <Text
              style={[typography.body, styles.centered, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {t('home.balance')}:
            </Text>
            <Text
              style={[typography.display, styles.centered, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {formatCurrency(balance)}
            </Text>
          </View>

          <CircleButton
            kind="expense"
            accessibilityLabel={t('transaction.addExpense')}
            onPress={addExpense}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: spacing.xxxxl,
    paddingHorizontal: gutter,
    paddingBottom: gutter,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  balancePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  balanceBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  centered: {
    textAlign: 'center',
  },
});
