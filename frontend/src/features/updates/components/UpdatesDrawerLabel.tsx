import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useUnseenUpdates } from '../hooks/useUnseenUpdates';

const DOT_SIZE = 8;

/** Drawer label with a dot while there is a release the user has not opened. */
export function UpdatesDrawerLabel({ color }: { color: string }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { hasUnseen } = useUnseenUpdates();

  return (
    <View
      accessible
      accessibilityLabel={hasUnseen ? t('nav.updatesNew') : t('nav.updates')}
      style={styles.row}
    >
      <Text style={[typography.body, styles.label, { color }]}>{t('nav.updates')}</Text>
      {hasUnseen ? (
        <View
          testID="updates-dot"
          importantForAccessibility="no-hide-descendants"
          style={[styles.dot, { backgroundColor: theme.badge }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontWeight: '600' },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
});
