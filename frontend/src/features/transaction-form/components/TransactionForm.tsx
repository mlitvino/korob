import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import Button from '@/components/Button';
import { FieldInput, FieldPicker } from '@/components/Field';
import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import { spacing } from '@/constants/theme';
import PickerSheet from '@/features/transaction-form/components/PickerSheet';
import { parseAmount } from '@/features/transaction-form/utils/amount';
import {
  getCategoriesByType,
} from '@/features/transaction-form/utils/categories';
import {
  formatDateInput,
  formatTimeInput,
  uses12HourClock,
} from '@/features/transaction-form/utils/dateTimeHelpers';
import type { TransactionCategory, TransactionType } from '@/types/Transaction';

type Props = {
  transactionType: TransactionType;
  onSubmit: (amount: number, occurredAt: Date, category: TransactionCategory) => Promise<void>;
};

export default function TransactionForm({ transactionType, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const categories = useMemo(() => getCategoriesByType(transactionType), [transactionType]);
  const [category, setCategory] = useState<TransactionCategory>(categories[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { t, i18n } = useTranslation();
  const use12Hours = uses12HourClock(i18n.language);

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

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

    if (value === null || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value, occurredAt, category);
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
        value={t(`category.${category}`)}
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

      <PickerSheet
        visible={showCategoryPicker}
        title={t('transaction.selectCategory')}
        doneLabel={t('common.done')}
        onClose={() => setShowCategoryPicker(false)}
      >
        <View>
          {categories.map((item, index) => (
            <SettingsRow
              key={item}
              variant="option"
              position={rowPosition(index, categories.length)}
              label={t(`category.${item}`)}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>
      </PickerSheet>

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
        disabled={isSubmitting}
        onPress={() => void handleSubmit()}
      />
    </View>
  );
}

const TIME_COLUMN_WIDTH = 136;

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
