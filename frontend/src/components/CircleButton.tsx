import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import type { TransactionType } from '@/types/Transaction';

type Props = {
  /** income: + on the income color; expense: − on the expense color. */
  kind: TransactionType;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BOX = 64;
const ICON = 32;

export default function CircleButton({
  kind,
  accessibilityLabel,
  onPress,
  disabled = false,
  style,
}: Props) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: BOX,
          height: BOX,
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
        size={ICON}
        color={theme.contrastText}
      />
    </Pressable>
  );
}
