import { useMemo } from 'react';
import { useDefaultStyles } from 'react-native-ui-datepicker';

import { useTheme, useThemeName } from '@/contexts/ThemeContext';

export function useCalendarStyles() {
  const theme = useTheme();
  const themeName = useThemeName();
  const pickerThemeVariant = themeName === 'light' ? 'light' : 'dark';
  const defaultCalendarStyles = useDefaultStyles(pickerThemeVariant);

  return useMemo(() => ({
    ...defaultCalendarStyles,
    selected: {
      ...defaultCalendarStyles.selected,
      backgroundColor: theme.pickerAccent,
      borderColor: theme.pickerAccent,
    },
    selected_label: {
      ...defaultCalendarStyles.selected_label,
      color: theme.contrastText,
    },
    today: {
      ...defaultCalendarStyles.today,
      borderColor: theme.pickerAccent,
      borderWidth: 1,
    },
    day_label: {
      ...defaultCalendarStyles.day_label,
      color: theme.text,
    },
    weekday_label: {
      ...defaultCalendarStyles.weekday_label,
      color: theme.text,
    },
    month_selector_label: {
      ...defaultCalendarStyles.month_selector_label,
      color: theme.text,
    },
    year_selector_label: {
      ...defaultCalendarStyles.year_selector_label,
      color: theme.text,
    },
    time_label: {
      ...defaultCalendarStyles.time_label,
      color: theme.text,
    },
    time_selected_indicator: {
      ...defaultCalendarStyles.time_selected_indicator,
      backgroundColor: theme.pickerAccent,
    },
  }), [
    defaultCalendarStyles,
    theme.pickerAccent,
    theme.contrastText,
    theme.text,
  ]);
}
