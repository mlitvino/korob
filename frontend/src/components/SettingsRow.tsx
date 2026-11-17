import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export type RowPosition = 'only' | 'first' | 'middle' | 'last';

type Props = {
  label: string;
  /** nav: chevron; value: current value + chevron; option: checkmark when selected. */
  variant: 'nav' | 'value' | 'option';
  /** Place in a grouped list; sets outer corners and the divider. */
  position?: RowPosition;
  value?: string;
  selected?: boolean;
  /** Node rendered before the label, e.g. a flag. */
  leading?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const MIN_HEIGHT = 56;

const CORNERS: Record<RowPosition, ViewStyle> = {
  only: { borderRadius: radius.md },
  first: { borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md },
  middle: {},
  last: { borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md },
};

/** Returns the grouped-list position of item `index` in a list of `count`. */
export function rowPosition(index: number, count: number): RowPosition {
  if (count === 1) return 'only';
  if (index === 0) return 'first';
  if (index === count - 1) return 'last';
  return 'middle';
}

export default function SettingsRow({
  label,
  variant,
  position = 'only',
  value,
  selected = false,
  leading,
  onPress,
  style,
}: Props) {
  const theme = useTheme();
  const hasDivider = position === 'first' || position === 'middle';
  const isOption = variant === 'option';

  return (
    <Pressable
      accessibilityRole={isOption ? 'radio' : 'button'}
      accessibilityState={isOption ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        CORNERS[position],
        { backgroundColor: theme.surface, opacity: pressed ? opacity.pressed : 1 },
        style,
      ]}
    >
      <View
        style={[
          styles.content,
          hasDivider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.separator,
          },
        ]}
      >
        {leading}
        <Text style={[typography.body, styles.label, { color: theme.text }]}>{label}</Text>
        {variant === 'value' && value ? (
          <Text style={[typography.bodySm, { color: theme.text, opacity: opacity.secondary }]}>
            {value}
          </Text>
        ) : null}
        {isOption ? (
          selected ? (
            <MaterialIcons
              testID="settings-row-check"
              name="check"
              size={24}
              color={theme.accent}
              style={styles.check}
            />
          ) : null
        ) : (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={theme.text}
            style={{ opacity: opacity.secondary }}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_HEIGHT,
    paddingLeft: spacing.lg,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    flex: 1,
    minWidth: 0,
  },
  check: {
    marginRight: spacing.sm,
  },
});
