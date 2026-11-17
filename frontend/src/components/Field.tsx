import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius, spacing, typography, type Theme } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

const MIN_HEIGHT = 64;
const BORDER_WIDTH = 2;
/** `opacity.secondary` (0.7) as a hex alpha suffix; placeholders can't take opacity. */
const SECONDARY_ALPHA_HEX = 'b3';

const boxStyle = (theme: Theme, focused: boolean): ViewStyle => ({
  minHeight: MIN_HEIGHT,
  paddingVertical: spacing.sm,
  paddingLeft: spacing.lg,
  borderRadius: radius.sm,
  borderWidth: BORDER_WIDTH,
  borderColor: focused ? theme.accent : 'transparent',
  backgroundColor: theme.inset,
  justifyContent: 'center',
});

type FieldInputProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Validation message shown under the field. */
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function FieldInput({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: FieldInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const field = (
    <View style={[boxStyle(theme, focused), { paddingRight: spacing.lg }, error ? null : style]}>
      <Text style={[typography.caption, { color: theme.text, opacity: opacity.secondary }]}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={`${theme.text}${SECONDARY_ALPHA_HEX}`}
        selectionColor={theme.accent}
        cursorColor={theme.accent}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={[typography.title, { fontWeight: '400', color: theme.text, padding: 0 }]}
        {...inputProps}
      />
    </View>
  );

  if (!error) {
    return field;
  }

  return (
    <View style={[{ gap: spacing.xs }, style]}>
      {field}
      <Text
        accessibilityLiveRegion="polite"
        style={[typography.bodySm, { color: theme.expense }]}
      >
        {error}
      </Text>
    </View>
  );
}

type FieldPickerProps = {
  label: string;
  value: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function FieldPicker({ label, value, onPress, style }: FieldPickerProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({ pressed }) => [
        boxStyle(theme, false),
        {
          paddingRight: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: spacing.sm,
          opacity: pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[typography.caption, { color: theme.text, opacity: opacity.secondary }]}>
          {label}
        </Text>
        <Text
          numberOfLines={1}
          style={[typography.body, { fontWeight: '600', color: theme.text }]}
        >
          {value}
        </Text>
      </View>
      <MaterialIcons
        name="arrow-drop-down"
        size={24}
        color={theme.text}
        style={{ opacity: opacity.secondary }}
      />
    </Pressable>
  );
}
