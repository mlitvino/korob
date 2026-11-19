import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import Button from '@/components/Button';
import { FieldInput, FieldPicker } from '@/components/Field';
import Sheet from '@/components/Sheet';
import { spacing } from '@/constants/theme';
import CategoryChipList from '@/features/categories/CategoryChipList';
import { useCategoryEditor } from '@/features/categories/useCategoryEditor';
import { parseAmount } from '@/features/transaction-form/utils/amount';
import {
  formatDateInput,
  formatTimeInput,
  uses12HourClock,
} from '@/features/transaction-form/utils/dateTimeHelpers';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useActiveCategories } from '@/queries/categories';
import type { TransactionType } from '@/types/Transaction';

type Props = {
  transactionType: TransactionType;
  onSubmit: (amountCents: number, occurredAt: Date, categoryId: string) => Promise<void>;
};

export default function TransactionForm({ transactionType, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const categories = useActiveCategories(transactionType);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const nameOf = useCategoryName();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { t, i18n } = useTranslation();
  const use12Hours = uses12HourClock(i18n.language);
  const { height: windowHeight } = useWindowDimensions();
  const editor = useCategoryEditor({ onCreated: (category) => setCategoryId(category.id) });

  useEffect(() => {
    if (!categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0]?.id ?? null);
    }
  }, [categories, categoryId]);

  const handleDateConfirm = ({ date }: { date: Date | undefined }) => {
    setShowDatePicker(false);
    if (!date) {
      return;
    }

    const next = new Date(occurredAt);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setOccurredAt(next);
  };

  const handleTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setShowTimePicker(false);

    const next = new Date(occurredAt);
    next.setHours(hours, minutes, 0, 0);
    setOccurredAt(next);
  };

  const handleSubmit = async () => {
    const value = parseAmount(amount);

    if (value === null || categoryId === null || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value, occurredAt, categoryId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <FieldInput
        label={t('transaction.amount')}
        placeholder={t('transaction.enterAmount')}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <FieldPicker
        label={t('transaction.selectCategory')}
        value={selectedCategory ? nameOf(selectedCategory) : t('transaction.noCategories')}
        onPress={() => setShowCategoryPicker(true)}
      />

      <View style={styles.dateTimeRow}>
        <FieldPicker
          label={t('transaction.selectDate')}
          value={formatDateInput(occurredAt)}
          onPress={() => setShowDatePicker(true)}
          style={styles.dateInput}
        />
        <FieldPicker
          label={t('transaction.selectTime')}
          value={formatTimeInput(occurredAt, use12Hours)}
          onPress={() => setShowTimePicker(true)}
          style={styles.timeInput}
        />
      </View>

      <Sheet
        visible={showCategoryPicker}
        title={t('transaction.selectCategory')}
        closeLabel={t('common.done')}
        onClose={() => setShowCategoryPicker(false)}
      >
        <ScrollView
          style={{ maxHeight: windowHeight * PICKER_MAX_HEIGHT }}
          keyboardShouldPersistTaps="handled"
        >
          <CategoryChipList
            type={transactionType}
            selectedId={categoryId}
            onPress={(category) => setCategoryId(category.id)}
            onRemove={editor.confirmArchive}
            onAdd={() => {
              setShowCategoryPicker(false);
              editor.openAdd(transactionType);
            }}
          />
        </ScrollView>
        <Button label={t('common.done')} onPress={() => setShowCategoryPicker(false)} />
      </Sheet>
      {editor.sheet}

      <DatePickerModal
        mode="single"
        locale={i18n.language}
        visible={showDatePicker}
        date={occurredAt}
        onDismiss={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
      />

      <TimePickerModal
        locale={i18n.language}
        visible={showTimePicker}
        hours={occurredAt.getHours()}
        minutes={occurredAt.getMinutes()}
        use24HourClock={!use12Hours}
        label={t('transaction.selectTime')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.done')}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
      />

      <Button
        icon={'check'}
        label={t('common.done')}
        disabled={isSubmitting || categoryId === null}
        onPress={() => void handleSubmit()}
      />
    </View>
  );
}

const TIME_COLUMN_WIDTH = 136;
/** Share of the screen the category chips may fill before they scroll. */
const PICKER_MAX_HEIGHT = 0.5;

const styles = StyleSheet.create({
  form: {
    gap: spacing.xl,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateInput: {
    flex: 1,
    minWidth: 0,
  },
  timeInput: {
    width: TIME_COLUMN_WIDTH,
  },
});
