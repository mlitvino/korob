import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/contexts/ThemeContext';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function IconButton({ icon, onPress, style, disabled = false }: Props) {
  const bgColor = useThemeColor('elevated');
  const iconCOlor = useThemeColor('contrastText');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor },
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialIcons name={icon} size={38} color={iconCOlor} />
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
  pressed: {
    opacity: 0.7,
  },
});
