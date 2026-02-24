import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

type ButtonSize = 'small' | 'medium' | 'large';

type Props = {
  label: string;
  size?: ButtonSize;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({
  label,
  size = 'medium',
  onPress,
  style,
  disabled = false,
}: Props) {

  const sizeStyles = {
    small: styles.buttonSmall,
    medium: styles.buttonMedium,
    large: styles.buttonLarge,
  };

  const textSizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };

  return (
    <Pressable
      style={() => [
        styles.buttonBase,
        sizeStyles[size],
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.textBase,
          textSizeStyles[size],
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Base styles
  buttonBase: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textBase: {
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },

  // Size variants (fixed dimensions for perfect circles)
  buttonSmall: {
    width: 60,
    height: 60,
  },
  buttonMedium: {
    width: 80,
    height: 80,
  },
  buttonLarge: {
    width: 100,
    height: 100,
  },

  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },

});
