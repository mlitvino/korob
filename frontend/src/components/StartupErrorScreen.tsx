import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { gutter, opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  error: Error;
  onRetry: () => void;
};

/** Full-screen overlay shown when the first load of the app's data fails. */
export default function StartupErrorScreen({ error, onRetry }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <Text accessibilityRole="header" style={[typography.headline, { color: theme.text }]}>
        {t('startupError.title')}
      </Text>
      <Text style={[typography.body, styles.message, { color: theme.text }]}>
        {t('startupError.message')}
      </Text>
      <Button label={t('startupError.retry')} onPress={onRetry} />
      <Text selectable style={[typography.caption, styles.detail, { color: theme.text }]}>
        {error.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    gap: spacing.lg,
    padding: gutter,
    zIndex: 1000,
  },
  message: { opacity: opacity.secondary },
  detail: { opacity: opacity.secondary },
});
