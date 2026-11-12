import { useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import IconButton from '@/components/IconButton';
import { useTheme } from '@/contexts/ThemeContext';
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
  const theme = useTheme();
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
      <TextInput
        style={[styles.input, { backgroundColor: theme.text }]}
        placeholder={t('transaction.enterAmount')}
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Pressable
        onPress={() => setShowCategoryPicker(true)}
        style={[styles.pickerButton, { backgroundColor: theme.text }]}
      >
        <Text style={[styles.pickerLabel, { color: theme.contrastText }]}>
          {t('transaction.selectCategory')}
        </Text>
        <Text style={[styles.pickerValue, { color: theme.contrastText }]}>
          {t(`category.${category}`)}
        </Text>
      </Pressable>

      <View style={styles.dateTimeRow}>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[styles.pickerButton, styles.dateInput, { backgroundColor: theme.text }]}
        >
          <Text style={[styles.pickerLabel, { color: theme.contrastText }]}>
            {t('transaction.selectDate')}
          </Text>
          <Text style={[styles.pickerValue, { color: theme.contrastText }]}>
            {formatDateInput(occurredAt)}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={[styles.pickerButton, styles.timeInput, { backgroundColor: theme.text }]}
        >
          <Text style={[styles.pickerLabel, { color: theme.contrastText }]}>
            {t('transaction.selectTime')}
          </Text>
          <Text style={[styles.pickerValue, { color: theme.contrastText }]}>
            {formatTimeInput(occurredAt, use12Hours)}
          </Text>
        </Pressable>
      </View>

      <PickerSheet
        visible={showCategoryPicker}
        title={t('transaction.selectCategory')}
        doneLabel={t('common.done')}
        onClose={() => setShowCategoryPicker(false)}
        theme={theme}
      >
        <View style={styles.categoryList}>
          {categories.map((item) => {
            const isSelected = category === item;
            return (
              <Pressable
                key={item}
                style={[
                  styles.categoryOption,
                  { borderColor: theme.separator },
                  isSelected
                    ? [styles.categoryOptionActive, { backgroundColor: theme.elevated }]
                    : null,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.categoryOptionText, { color: theme.text }]}>
                  {t(`category.${item}`)}
                </Text>
              </Pressable>
            );
          })}
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

      <IconButton
        icon={'check'}
        label={t('common.done')}
        variant="wide"
        onPress={() => void handleSubmit()}
        style={{ backgroundColor: theme.text }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
    width: 300,
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  categoryOptionActive: {
    borderWidth: 0,
  },
  categoryOptionText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  input: {
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  timeInput: {
    width: 130,
  },
  pickerButton: {
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    opacity: 0.75,
    marginBottom: 4,
  },
  pickerValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
