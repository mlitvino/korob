import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/contexts/ThemeContext';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({ label, onPress, style, disabled = false }: Props) {
  const bgColor = useThemeColor('text');

  return (
    <Pressable
      style={() => [styles.button, { backgroundColor: bgColor }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
