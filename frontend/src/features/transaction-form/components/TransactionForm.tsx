import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import Button from '@/components/Button';
import { FieldInput, FieldPicker } from '@/components/Field';
import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import { opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import PickerSheet from '@/features/transaction-form/components/PickerSheet';
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
  onSubmit: (amount: number, occurredAt: Date, categoryId: string) => Promise<void>;
};

export default function TransactionForm({ transactionType, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const categories = useActiveCategories(transactionType);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const nameOf = useCategoryName();
  const theme = useTheme();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { t, i18n } = useTranslation();
  const use12Hours = uses12HourClock(i18n.language);

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

      <View style={styles.categoryField}>
        <FieldPicker
          label={t('transaction.selectCategory')}
          value={selectedCategory ? nameOf(selectedCategory) : t('transaction.noCategories')}
          onPress={() => {
            if (categories.length > 0) {
              setShowCategoryPicker(true);
            }
          }}
        />
        {categories.length === 0 ? (
          <Text style={[typography.bodySm, { color: theme.text, opacity: opacity.secondary }]}>
            {t('transaction.noCategoriesHint')}
          </Text>
        ) : null}
      </View>

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
              key={item.id}
              variant="option"
              position={rowPosition(index, categories.length)}
              label={nameOf(item)}
              selected={categoryId === item.id}
              onPress={() => setCategoryId(item.id)}
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
        disabled={isSubmitting || categoryId === null}
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
  categoryField: {
    gap: spacing.xs,
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
