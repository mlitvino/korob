import { useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker, {
  DateType,
} from 'react-native-ui-datepicker';

import IconButton from '@/components/IconButton';
import { useTheme } from '@/contexts/ThemeContext';
import PickerSheet from '@/features/transaction-form/components/PickerSheet';
import {
  getCategoriesByType,
} from '@/features/transaction-form/utils/categories';
import {
  formatDateInput,
  formatTimeInput,
  toDate,
} from '@/features/transaction-form/utils/dateTimeHelpers';
import { useCalendarStyles } from '@/features/transaction-form/hooks/useCalendarStyles';
import type { TransactionCategory, TransactionType } from '@/types/Transaction';

type Props = {
  transactionType: TransactionType;
  onSubmit: (amount: number, createdAt: Date, category: TransactionCategory) => void;
};

export default function TransactionForm({ transactionType, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [createdAt, setCreatedAt] = useState(() => new Date());
  const categories = useMemo(() => getCategoriesByType(transactionType), [transactionType]);
  const [category, setCategory] = useState<TransactionCategory>(categories[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const calendarStyles = useCalendarStyles();

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleDateValueChange = ({ date }: { date: DateType }) => {
    const selectedDate = toDate(date);
    if (!selectedDate) {
      return;
    }

    const next = new Date(createdAt);
    next.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    setCreatedAt(next);
  };

  const handleTimeValueChange = ({ date }: { date: DateType }) => {
    const selectedTime = toDate(date);
    if (!selectedTime) {
      return;
    }

    const next = new Date(createdAt);
    next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    setCreatedAt(next);
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);

    if (!isNaN(value) && value > 0) {
      onSubmit(value, createdAt, category);
      setAmount('');
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.text }]}
        placeholder={t('transaction.enterAmount')}
        placeholderTextColor="#999"
        keyboardType="numeric"
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
            {formatDateInput(createdAt)}
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
            {formatTimeInput(createdAt)}
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

      <PickerSheet
        visible={showDatePicker}
        title={t('transaction.selectDate')}
        doneLabel={t('common.done')}
        onClose={() => setShowDatePicker(false)}
        theme={theme}
      >
        <DateTimePicker
          mode="single"
          date={createdAt}
          onChange={handleDateValueChange}
          styles={calendarStyles}
        />
      </PickerSheet>

      <PickerSheet
        visible={showTimePicker}
        title={t('transaction.selectTime')}
        doneLabel={t('common.done')}
        onClose={() => setShowTimePicker(false)}
        theme={theme}
      >
        <DateTimePicker
          mode="single"
          date={createdAt}
          timePicker
          use12Hours={false}
          initialView="time"
          hideHeader
          hideWeekdays
          onChange={handleTimeValueChange}
          styles={calendarStyles}
        />
      </PickerSheet>

      <IconButton
        icon={'check'}
        label={t('common.done')}
        variant="wide"
        onPress={handleSubmit}
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
