import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useTransactionDispatch } from '@/contexts/TranscationContext';
import { mockTransactions } from '@/features/debug/mockTransactions';

export function DebugPanel() {
  const theme = useTheme();
  const transactionDispatch = useTransactionDispatch();

  const wipeAllData = () => {
    transactionDispatch({ type: 'clear' });
  };

  const seedStartingData = () => {
    transactionDispatch({ type: 'clear' });
    mockTransactions.forEach((transaction) => {
      transactionDispatch({ type: 'add', transaction });
    });
  };

  const confirm = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  };

  const actions = [
    {
      key: 'wipe',
      label: 'Wipe all data',
      onPress: () => confirm(
        'Wipe all data',
        'This deletes every transaction and resets the balance to 0. This cannot be undone.',
        wipeAllData,
      ),
    },
    {
      key: 'seed',
      label: 'Seed starting data',
      onPress: () => confirm(
        'Seed starting data',
        'This replaces all current data with a fixed set of sample transactions.',
        seedStartingData,
      ),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Debug Panel</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Development-only tools. Not available in production builds.
      </Text>

      <View style={[styles.section, { borderColor: theme.separator }]}>
        {actions.map(({ key, label, onPress }) => (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={onPress}
          >
            <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 16,
  },
});
