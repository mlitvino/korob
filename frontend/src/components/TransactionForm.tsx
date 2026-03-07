import { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import IconButton from '@/components/IconButton';
import { useThemeColor } from '@/contexts/ThemeContext';

type Props = {
  onSubmit: (amount: number) => void;
};

export default function TransactionForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const textColor = useThemeColor('text');

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      onSubmit(value);
      setAmount('');
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={[styles.input, { backgroundColor: textColor }]}
        placeholder="Enter amount"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <IconButton icon={'check'} onPress={handleSubmit} style={{ backgroundColor: textColor }} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
    width: 300,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
  },
});
