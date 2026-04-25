import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

type TransactionDateSeparatorProps = {
  createdAt: Date;
};

export function TransactionDateSeparator({ createdAt }: TransactionDateSeparatorProps) {
  const theme = useTheme();

  if (Number.isNaN(createdAt.getTime())) {
    return null;
  }

  return (
    <View style={styles.dateSeparatorWrap}>
      <View style={[styles.dateLine, { backgroundColor: theme.separator }]} />
      <Text style={[styles.dateSeparatorText, { color: theme.text }]}>
        {createdAt.toLocaleDateString(undefined, {
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    textTransform: 'uppercase',
  },
});
