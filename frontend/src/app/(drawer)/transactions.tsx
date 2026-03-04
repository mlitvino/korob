import { View, Text, StyleSheet } from 'react-native';

export default function Transactions() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>tydysh</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2f2e33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
