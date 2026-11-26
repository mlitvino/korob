import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { FieldInput } from '@/components/Field';
import Sheet from '@/components/Sheet';
import { opacity, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactionText } from '@/features/transaction-list/hooks/useTransactionText';
import { useDeleteTransaction, useUpdateTransactionComment } from '@/queries/transactions';
import { MAX_COMMENT_LENGTH, type Transaction } from '@/types/Transaction';

type Props = {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
};

export function TransactionDetailsSheet({ transaction, visible, onClose }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const text = useTransactionText(transaction);
  const [comment, setComment] = useState('');
  const updateComment = useUpdateTransactionComment();
  const deleteTransaction = useDeleteTransaction();

  useEffect(() => {
    if (visible) {
      setComment(transaction.description ?? '');
    }
  }, [visible, transaction.id, transaction.description]);

  const confirmDelete = () => {
    Alert.alert(t('transaction.deleteTitle'), t('transaction.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('transaction.delete'),
        style: 'destructive',
        onPress: () => {
          onClose();
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
    updateComment.mutate(
      { id: transaction.id, comment },
      {
        onSuccess: onClose,
        onError: (error) => {
          console.warn('Failed to save comment', error);
          Alert.alert(t('transaction.saveFailed'));
        },
      },
    );
  };

  const commentChanged = comment.trim() !== (transaction.description ?? '');

  return (
    <Sheet
      visible={visible}
      title={`${text.amount} · ${text.category}`}
      closeLabel={t('common.cancel')}
      onClose={onClose}
    >
      {text.entered
        ? (
          <Text style={[typography.bodySm, styles.entered, { color: theme.text }]}>
            {t('transaction.enteredAs', { amount: text.entered })}
          </Text>
        )
        : null}
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
  );
}

const styles = StyleSheet.create({
  entered: {
    opacity: opacity.secondary,
  },
});
