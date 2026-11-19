import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import type { TransactionType } from '@/types/Transaction';

type Size = 'lg' | 'md';

type Props = {
  /** income: + on the income color; expense: − on the expense color. */
  kind: TransactionType;
  size?: Size;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZES: Record<Size, { box: number; icon: number }> = {
  lg: { box: 80, icon: 40 },
  md: { box: 64, icon: 32 },
};

export default function CircleButton({
  kind,
  size = 'lg',
  accessibilityLabel,
  onPress,
  disabled = false,
  style,
}: Props) {
  const theme = useTheme();
  const { box, icon } = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: box,
          height: box,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme[kind],
          opacity: disabled ? opacity.disabled : pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      <MaterialIcons
        name={kind === 'income' ? 'add' : 'remove'}
        size={icon}
        color={theme.contrastText}
      />
    </Pressable>
  );
}
