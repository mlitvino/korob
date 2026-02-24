import { Text, View, StyleSheet } from 'react-native';

import Button from '@/components/Button';

export default function Index() {
  const money = 10;

  return (
    <View style={styles.screen}>
      <View style={styles.buttonGroupContainer}>
        <Button label={'minus'} onPress={() => console.log('Button 1')} />
        <View style={styles.balanceGroupContainer} >
          <Text style={styles.balanceTitle}>Balance:</Text>
          <Text style={styles.balance}>{money}</Text>
        </View>
        <Button label={'plus'} onPress={() => console.log('Button 2')} />
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
    padding: 3,
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

