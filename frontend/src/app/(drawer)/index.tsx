import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { useBalance } from '@/contexts/BalanceContext';
import IconButton from '@/components/IconButton';
import Total from '@/components/Total';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const balance = useBalance();
  const theme = useTheme();

  const addIncome = () => {
    router.push('/transaction-modal?type=income');
  };

  const addExpense = () => {
    router.push('/transaction-modal?type=expense');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>

      <View style={[styles.totalsBox, { backgroundColor: theme.surface }]}>
        <Total type={'income'} />
        <View style={[styles.verticalSeparator, { backgroundColor: theme.separator }]} />
        <Total type={'expense'} />
      </View>

      <View style={styles.content}>
        <View style={[styles.buttonGroupContainer, { backgroundColor: theme.surface }]}>
          <IconButton icon="add" onPress={addIncome} style={{ backgroundColor: theme.income }} />

          <View style={[styles.balanceGroupContainer, { backgroundColor: theme.inset }]} >
            <Text style={[styles.balanceTitle, { color: theme.text }]}>Balance:</Text>
            <Text style={[styles.balance, { color: theme.text }]}>{balance}</Text>
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
    width: 360,
    height: 150,
    padding: 20,
    borderRadius: 12,
    gap: 10,
  },
  balanceGroupContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    padding: 15,
  },
  balanceTitle: {
    fontSize: 16,
  },
  balance: {
    fontSize: 40,
  },
});

