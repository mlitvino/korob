import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { TransactionType } from '@/types/Transaction';
import { useTransactions } from '@/contexts/TranscationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

type TotalProps = {
  type: TransactionType;
};

export default function Total({ type }: TotalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const transactions = useTransactions();

  const total = transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);

  const header = type === 'income' ? t('total.income') : t('total.expense');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.separator}]}>
        <Text style={[styles.headerText, { color: theme.text }]}>{header}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.categoryText, { color: theme.text }]}>
          {t('total.allTime')}
        </Text>
        <Text style={[styles.totalText, { color: theme.text }]}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  body: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  totalText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
