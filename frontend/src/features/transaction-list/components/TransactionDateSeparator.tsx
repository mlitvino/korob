import { View, Text, StyleSheet } from 'react-native';

import { opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type TransactionDateSeparatorProps = {
  occurredAt: Date;
};

export function TransactionDateSeparator({ occurredAt }: TransactionDateSeparatorProps) {
  const theme = useTheme();

  if (Number.isNaN(occurredAt.getTime())) {
    return null;
  }

  return (
    <View style={styles.dateSeparatorWrap}>
      <View style={[styles.dateLine, { backgroundColor: theme.separator }]} />
      <Text style={[typography.caption, styles.dateSeparatorText, { color: theme.text }]}>
        {occurredAt.toLocaleDateString(undefined, {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        })}
      </Text>
      <View style={[styles.dateLine, { backgroundColor: theme.separator }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  dateSeparatorWrap: {
    minHeight: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dateSeparatorText: {
    fontWeight: '600',
    opacity: opacity.secondary,
    textTransform: 'uppercase',
  },
});
