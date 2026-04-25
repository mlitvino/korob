import { useState } from 'react';
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
  formatDateInput,
  formatTimeInput,
  toDate,
} from '@/features/transaction-form/utils/dateTimeHelpers';
import { useCalendarStyles } from '@/features/transaction-form/hooks/useCalendarStyles';

type Props = {
  onSubmit: (amount: number, createdAt: Date) => void;
};

export default function TransactionForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [createdAt, setCreatedAt] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const calendarStyles = useCalendarStyles();

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
      onSubmit(value, createdAt);
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
