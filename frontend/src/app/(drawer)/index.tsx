import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useBalance } from '@/contexts/BalanceContext';
import IconButton from '@/components/IconButton';
import Total from '@/components/Total';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

export default function Index() {
  const balance = useBalance();
  const theme = useTheme();
  const formatCurrency = useCurrencyFormatter();
  const { t } = useTranslation();

  const addIncome = () => {
    router.push('/transaction-modal?type=income');
  };

  const addExpense = () => {
    router.push('/transaction-modal?type=expense');
  };

  const viewIncomeTransactions = () => {
    router.push('/transactions?filter=income');
  };

  const viewExpenseTransactions = () => {
    router.push('/transactions?filter=expense');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>

      <View style={[styles.totalsBox, { backgroundColor: theme.surface }]}>
        <Pressable onPress={viewIncomeTransactions} style={{ flex: 1 }}>
          <Total type={'income'} />
        </Pressable>
        <View style={[styles.verticalSeparator, { backgroundColor: theme.separator }]} />
        <Pressable onPress={viewExpenseTransactions} style={{ flex: 1 }}>
          <Total type={'expense'} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.buttonGroupContainer, { backgroundColor: theme.surface }]}>
          <IconButton icon="add" onPress={addIncome} style={{ backgroundColor: theme.income }} />

          <View style={[styles.balanceGroupContainer, { backgroundColor: theme.inset }]} >
            <Text
              style={[styles.balanceTitle, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {t('home.balance')}:
            </Text>
            <Text
              style={[styles.balance, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {formatCurrency(balance)}
            </Text>
          </View>

          <IconButton icon="remove" onPress={addExpense} style={{ backgroundColor: theme.expense }} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  totalsBox: {
    width: 360,
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 60,
    justifyContent: 'flex-start',
    zIndex: 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  verticalSeparator: {
    width: 1,
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 400,
    height: 150,
    padding: 20,
    borderRadius: 12,
    gap: 10,
  },
  balanceGroupContainer: {
    width: 150,
    height: 100,
    alignItems: 'center',
    padding: 15,
  },
  balanceTitle: {
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'center',
  },
  balance: {
    fontSize: 30,
    flexShrink: 1,
    textAlign: 'center',
  },
});

