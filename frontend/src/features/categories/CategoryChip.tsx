import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius, spacing, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  label: string;
  /** category: a pickable name; add: dashed "+ label" chip. */
  variant?: 'category' | 'add';
  /** Shows the selected look; only a pickable chip (when set) announces a radio state. */
  selected?: boolean;
  /** Announce as a radio (picking one) instead of a plain button (e.g. tap to edit). */
  pickable?: boolean;
  onPress?: () => void;
  /** Shows a × button when given. */
  onRemove?: () => void;
  /** Screen-reader label for the × button. */
  removeLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const REMOVE_BOX = 40;
const BORDER_WIDTH = 2;

/** Pill that fits its label up to the row width; wraps in a flex-wrap row. */
export default function CategoryChip({
  label,
  variant = 'category',
  selected = false,
  pickable = false,
  onPress,
  onRemove,
  removeLabel,
  style,
}: Props) {
  const theme = useTheme();
  const isAdd = variant === 'add';
  const isSelected = !isAdd && selected;
  const showRemove = !isAdd && onRemove !== undefined;
  const fg = isSelected ? theme.onActionPrimary : theme.text;

  return (
    <View
      testID="category-chip"
      style={[
        styles.chip,
        {
          paddingRight: showRemove ? spacing.xs : spacing.lg,
          borderStyle: isAdd ? 'dashed' : 'solid',
          borderColor: isSelected ? theme.selection : theme.outline,
          backgroundColor: isSelected ? theme.selection : 'transparent',
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole={isAdd || !pickable ? 'button' : 'radio'}
        accessibilityState={isAdd || !pickable ? undefined : { selected: isSelected }}
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.main, { opacity: pressed ? opacity.pressed : 1 }]}
      >
        {isAdd ? <MaterialIcons name="add" size={20} color={fg} style={styles.addIcon} /> : null}
        <Text numberOfLines={1} style={[typography.body, styles.label, { color: fg }]}>
          {label}
        </Text>
      </Pressable>
      {showRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={removeLabel}
          onPress={onRemove}
          hitSlop={spacing.xs}
          style={({ pressed }) => [styles.remove, { opacity: pressed ? opacity.pressed : 1 }]}
        >
          <MaterialIcons name="close" size={18} color={fg} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    maxWidth: '100%',
    minHeight: touchTarget,
    paddingLeft: spacing.lg,
    borderWidth: BORDER_WIDTH,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  main: {
    flexShrink: 1,
    minWidth: 0,
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    marginLeft: -spacing.xs,
  },
  label: {
    flexShrink: 1,
    fontWeight: '600',
  },
  remove: {
    width: REMOVE_BOX,
    height: REMOVE_BOX,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
