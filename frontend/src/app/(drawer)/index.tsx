import { Text, View, StyleSheet } from 'react-native';

import { router } from 'expo-router';

import Button from '@/components/Button';
import { useBalance } from '@/contexts/BalanceContext';

export default function Index() {
  const balance = useBalance();

  const addIncome = () => {
    router.push('/transaction-modal?type=income');
  };

  const addExpense = () => {
    router.push('/transaction-modal?type=expense');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.buttonGroupContainer}>
        <Button label={'minus'} onPress={addExpense} />
        <View style={styles.balanceGroupContainer} >
          <Text style={styles.balanceTitle}>Balance:</Text>
          <Text style={styles.balance}>{balance}</Text>
        </View>
        <Button label={'plus'} onPress={addIncome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2f2e33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroupContainer: {
    backgroundColor: '#262236',
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
    backgroundColor: '#3a3257',
    width: 100,
    height: 100,
    alignItems: 'center',
    padding: 15,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 16,
  },
  balance: {
    color: '#fff',
    fontSize: 40,
  },
});

