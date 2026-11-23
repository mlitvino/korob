import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { gutter, opacity, radius, spacing, typography, type Theme } from '@/constants/theme';
import { restartApp } from '@/features/app-shell/restartApp';

type Props = {
  /** Passed in rather than read from context, so the view also works outside the providers. */
  theme: Theme;
  title: string;
  message: string;
  retryLabel: string;
  restartLabel: string;
  error: Error;
  onRetry: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Full-screen error with Try again and Restart; uses no context hooks. */
export default function ErrorView(
  { theme, title, message, retryLabel, restartLabel, error, onRetry, style }: Props,
) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }, style]}>
      <Text accessibilityRole="header" style={[typography.headline, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[typography.body, styles.secondary, { color: theme.text }]}>{message}</Text>
      <ActionButton
        label={retryLabel}
        onPress={onRetry}
        background={theme.actionPrimary}
        color={theme.onActionPrimary}
      />
      <ActionButton
        label={restartLabel}
        onPress={restartApp}
        background={theme.actionSecondary}
        color={theme.onActionSecondary}
      />
      <Text selectable style={[typography.caption, styles.secondary, { color: theme.text }]}>
        {error.message}
      </Text>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  background: string;
  color: string;
};

function ActionButton({ label, onPress, background, color }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, opacity: pressed ? opacity.pressed : 1 },
      ]}
    >
      <Text style={[typography.body, styles.buttonLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    padding: gutter,
  },
  secondary: { opacity: opacity.secondary },
  button: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontWeight: '600' },
});
