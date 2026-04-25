import { DateType } from 'react-native-ui-datepicker';

export function formatDateInput(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function formatTimeInput(date: Date) {
  return [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':');
}

export function toDate(value: DateType): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'object' && 'toDate' in value) {
    const maybeDate = value.toDate();
    if (maybeDate instanceof Date && !Number.isNaN(maybeDate.getTime())) {
      return maybeDate;
    }
  }

  return null;
}
