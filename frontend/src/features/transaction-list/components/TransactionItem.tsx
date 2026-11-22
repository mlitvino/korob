import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '@/types/Transaction';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactionText } from '@/features/transaction-list/hooks/useTransactionText';

type TransactionItemProps = {
  transaction: Transaction;
  selecting?: boolean;
  selected?: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

const CHECKBOX = 24;

export function TransactionItem({
  transaction,
  selecting = false,
  selected = false,
  onPress,
  onLongPress,
}: TransactionItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const text = useTransactionText(transaction);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const checked = selecting && selected;

  return (
    <Pressable
      accessibilityRole={selecting ? 'checkbox' : 'button'}
      accessibilityState={selecting ? { checked } : undefined}
      accessibilityLabel={`${text.amount}, ${text.category}, ${text.time}`}
      accessibilityHint={selecting ? undefined : t('transaction.selectHint')}
      accessibilityActions={
        selecting ? undefined : [{ name: 'longpress', label: t('transaction.select') }]
      }
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'longpress') {
          onLongPress();
        }
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.transactionItem,
        {
          backgroundColor: checked ? theme.inset : theme.canvas,
          opacity: pressed ? opacity.pressed : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
            {text.time}
          </Text>
          <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
            {text.category}
          </Text>
        </View>

        <Text style={[typography.title, styles.valueText, { color: valueColor }]}>
          {text.amount}
        </Text>
      </View>

      {selecting ? (
        <View
          testID="transaction-checkbox"
          style={[
            styles.checkbox,
            {
              borderColor: checked ? theme.selection : theme.outline,
              backgroundColor: checked ? theme.selection : 'transparent',
            },
          ]}
        >
          {checked ? <MaterialIcons name="check" size={18} color={theme.onActionPrimary} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    textTransform: 'capitalize',
    opacity: opacity.secondary,
  },
  valueText: {
    fontWeight: '700',
  },
  checkbox: {
    width: CHECKBOX,
    height: CHECKBOX,
    borderWidth: 2,
    borderRadius: radius.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
