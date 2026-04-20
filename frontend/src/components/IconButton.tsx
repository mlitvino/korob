import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/contexts/ThemeContext';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: 'circle' | 'wide';
  label?: string;
  iconSize?: number;
};

export default function IconButton({
  icon,
  onPress,
  style,
  disabled = false,
  variant = 'circle',
  label,
  iconSize,
}: Props) {
  const bgColor = useThemeColor('elevated');
  const iconColor = useThemeColor('contrastText');
  const isWide = variant === 'wide';
  const resolvedIconSize = iconSize ?? (isWide ? 24 : 38);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isWide ? styles.wideButton : styles.circleButton,
        { backgroundColor: bgColor },
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialIcons name={icon} size={resolvedIconSize} color={iconColor} />
      {label ? <Text style={[styles.label, { color: iconColor }]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  wideButton: {
    width: '100%',
    minHeight: 56,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
