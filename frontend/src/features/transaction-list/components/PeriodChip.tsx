import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { opacity, radius, spacing, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type PeriodChipProps = {
  label: string;
  /** Spoken name when the visible label is shortened. */
  accessibilityLabel?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PeriodChip(
  { label, accessibilityLabel, selected, onPress, style }: PeriodChipProps,
) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? theme.selection : theme.outline,
          backgroundColor: selected ? theme.selection : 'transparent',
          opacity: pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          typography.bodySm,
          styles.label,
          { color: selected ? theme.onActionPrimary : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget,
    minWidth: touchTarget,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
