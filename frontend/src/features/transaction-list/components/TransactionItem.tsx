import { useState } from 'react';
import { Alert, Pressable, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import Sheet from '@/components/Sheet';
import { FieldInput } from '@/components/Field';
import { MAX_COMMENT_LENGTH, type Transaction } from '@/types/Transaction';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useCategoryById } from '@/queries/categories';
import { useDeleteTransaction, useUpdateTransactionComment } from '@/queries/transactions';
import {
  formatTimeInput,
  uses12HourClock,
} from '@/features/transaction-form/utils/dateTimeHelpers';

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const updateComment = useUpdateTransactionComment();
  const deleteTransaction = useDeleteTransaction();
  const categoryById = useCategoryById();
  const nameOf = useCategoryName();
  const category = categoryById(transaction.categoryId);
  const formatCurrency = useCurrencyFormatter();
  const occurredAt = new Date(transaction.occurredAt);
  const valueColor = transaction.type === 'income' ? theme.income : theme.expense;
  const valuePrefix = transaction.type === 'income' ? '+' : '\u2212';

  const confirmDelete = () => {
    Alert.alert(t('transaction.deleteTitle'), t('transaction.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('transaction.delete'),
        style: 'destructive',
        onPress: () => {
          setDetailsOpen(false);
          deleteTransaction.mutate(transaction.id, {
            onError: (error) => {
              console.warn('Failed to delete transaction', error);
              Alert.alert(t('transaction.deleteFailed'));
            },
          });
        },
      },
    ]);
  };

  const saveComment = () => {
    updateComment.mutate({ id: transaction.id, comment }, {
      onSuccess: () => setDetailsOpen(false),
      onError: (error) => {
        console.warn('Failed to save comment', error);
        Alert.alert(t('transaction.saveFailed'));
      },
    });
  };

  // the repository trims, so whitespace-only edits do not count
  const commentChanged = comment.trim() !== (transaction.description ?? '');

  const amount = formatCurrency(transaction.amountCents, transaction.currency);
  const amountText = `${valuePrefix}${amount}`;
  const categoryText = category ? nameOf(category) : '';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setComment(transaction.description ?? '');
          setDetailsOpen(true);
        }}
        style={({ pressed }) => [
          styles.transactionItem,
          { backgroundColor: theme.canvas, opacity: pressed ? opacity.pressed : 1 },
        ]}
      >
        <View style={styles.metaRow}>
          <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
            {formatTimeInput(occurredAt, uses12HourClock(i18n.language))}
          </Text>
          <Text style={[typography.bodySm, styles.metaText, { color: theme.text }]}>
            {categoryText}
          </Text>
        </View>

        <Text style={[typography.title, styles.valueText, { color: valueColor }]}>
          {amountText}
        </Text>
      </Pressable>

      <Sheet
        visible={detailsOpen}
        title={`${amountText} \u00b7 ${categoryText}`}
        closeLabel={t('common.cancel')}
        onClose={() => setDetailsOpen(false)}
      >
        <FieldInput
          label={t('transaction.comment')}
          placeholder={t('transaction.commentPlaceholder')}
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={MAX_COMMENT_LENGTH}
        />
        <Button
          label={t('transaction.save')}
          disabled={!commentChanged || updateComment.isPending}
          onPress={saveComment}
        />
        <Button variant="secondary" label={t('transaction.delete')} onPress={confirmDelete} />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
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
});
