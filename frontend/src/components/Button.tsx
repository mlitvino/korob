import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Variant = 'primary' | 'secondary';
type Size = 'lg' | 'md';

type Props = {
  label: string;
  variant?: Variant;
  size?: Size;
  /** MaterialIcons name shown before the label; omit for none. */
  icon?: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HEIGHTS: Record<Size, number> = { lg: 56, md: 48 };

export default function Button({
  label,
  variant = 'primary',
  size = 'lg',
  icon,
  onPress,
  disabled = false,
  style,
}: Props) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? theme.onActionPrimary : theme.onActionSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          minHeight: HEIGHTS[size],
          paddingHorizontal: spacing.lg,
          borderRadius: radius.sm,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          backgroundColor: isPrimary ? theme.actionPrimary : theme.actionSecondary,
          opacity: disabled ? opacity.disabled : pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      {icon ? <MaterialIcons name={icon} size={24} color={fg} /> : null}
      <Text style={[typography.body, { fontWeight: '600', color: fg }]}>{label}</Text>
    </Pressable>
  );
}
