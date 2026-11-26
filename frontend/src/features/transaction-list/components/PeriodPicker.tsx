import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DatePickerModal } from 'react-native-paper-dates';

import Sheet from '@/components/Sheet';
import { PeriodChip } from '@/features/transaction-list/components/PeriodChip';
import { opacity, spacing, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocale } from '@/hooks/useLocale';
import { capitalize, type Bounds, type PeriodMode } from '@/utils/period';

type PeriodPickerProps = {
  /** Which picker is open; `null` keeps all closed. */
  open: Exclude<PeriodMode, 'all'> | null;
  /** Date shown as picked. */
  anchor: Date;
  /** Current custom range, if the range mode is on. */
  range: Bounds | null;
  onPickDate: (date: Date) => void;
  onPickRange: (first: Date, last: Date) => void;
  onClose: () => void;
};

const MONTHS = Array.from({ length: 12 }, (_, month) => month);
const YEARS_PER_PAGE = 12;

/** A title between two arrows that page the grid under it. */
function GridHeader({ title, previousLabel, nextLabel, onStep }: {
  title: string;
  previousLabel: string;
  nextLabel: string;
  onStep: (steps: -1 | 1) => void;
}) {
  const theme = useTheme();

  const arrow = (steps: -1 | 1) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={steps < 0 ? previousLabel : nextLabel}
      onPress={() => onStep(steps)}
      style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
    >
      <MaterialIcons
        name={steps < 0 ? 'chevron-left' : 'chevron-right'}
        size={24}
        color={theme.text}
      />
    </Pressable>
  );

  return (
    <View style={styles.header}>
      {arrow(-1)}
      <Text style={[typography.title, { color: theme.text }]}>{title}</Text>
      {arrow(1)}
    </View>
  );
}

function MonthGrid({ anchor, onPick }: { anchor: Date; onPick: (date: Date) => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [year, setYear] = useState(() => anchor.getFullYear());

  const monthName = (month: number, length: 'long' | 'short') =>
    capitalize(new Date(year, month, 1).toLocaleDateString(locale, { month: length }));

  return (
    <View style={styles.pickerBody}>
      <GridHeader
        title={String(year)}
        previousLabel={t('period.previousYear')}
        nextLabel={t('period.nextYear')}
        onStep={(steps) => setYear((current) => current + steps)}
      />
      <View style={styles.grid}>
        {MONTHS.map((month) => (
          <PeriodChip
            key={month}
            label={monthName(month, 'short')}
            accessibilityLabel={monthName(month, 'long')}
            selected={year === anchor.getFullYear() && month === anchor.getMonth()}
            onPress={() => onPick(new Date(year, month, 1))}
            style={styles.gridCell}
          />
        ))}
      </View>
    </View>
  );
}

function YearGrid({ anchor, onPick }: { anchor: Date; onPick: (date: Date) => void }) {
  const { t } = useTranslation();
  // pages are counted back from this year, so the current year closes the first one
  const [lastYear, setLastYear] = useState(() => {
    const thisYear = new Date().getFullYear();
    const pagesBack = Math.floor((thisYear - anchor.getFullYear()) / YEARS_PER_PAGE);
    return thisYear - pagesBack * YEARS_PER_PAGE;
  });
  const years = Array.from(
    { length: YEARS_PER_PAGE },
    (_, index) => lastYear - YEARS_PER_PAGE + 1 + index,
  );

  return (
    <View style={styles.pickerBody}>
      <GridHeader
        title={`${years[0]} – ${lastYear}`}
        previousLabel={t('period.previousYears')}
        nextLabel={t('period.nextYears')}
        onStep={(steps) => setLastYear((current) => current + steps * YEARS_PER_PAGE)}
      />
      <View style={styles.grid}>
        {years.map((year) => (
          <PeriodChip
            key={year}
            label={String(year)}
            selected={year === anchor.getFullYear()}
            onPress={() => onPick(new Date(year, anchor.getMonth(), 1))}
            style={styles.gridCell}
          />
        ))}
      </View>
    </View>
  );
}

export function PeriodPicker(
  { open, anchor, range, onPickDate, onPickRange, onClose }: PeriodPickerProps,
) {
  const { t, i18n } = useTranslation();

  const pickDate = (date: Date) => {
    onPickDate(date);
    onClose();
  };

  // the stored end is exclusive; the calendar wants the last day itself
  const lastDay = range
    ? new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate() - 1)
    : undefined;

  return (
    <>
      <Sheet
        visible={open === 'month'}
        title={t('period.pickMonth')}
        closeLabel={t('common.done')}
        onClose={onClose}
      >
        <MonthGrid anchor={anchor} onPick={pickDate} />
      </Sheet>

      <Sheet
        visible={open === 'year'}
        title={t('period.pickYear')}
        closeLabel={t('common.done')}
        onClose={onClose}
      >
        <YearGrid anchor={anchor} onPick={pickDate} />
      </Sheet>

      <DatePickerModal
        mode="single"
        locale={i18n.language}
        visible={open === 'day' || open === 'week'}
        date={anchor}
        onDismiss={onClose}
        onConfirm={({ date }) => {
          if (date) {
            pickDate(date);
          } else {
            onClose();
          }
        }}
      />

      <DatePickerModal
        mode="range"
        locale={i18n.language}
        visible={open === 'range'}
        startDate={range?.start}
        endDate={lastDay}
        onDismiss={onClose}
        onConfirm={({ startDate, endDate }) => {
          if (startDate) {
            onPickRange(startDate, endDate ?? startDate);
          }
          onClose();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pickerBody: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCell: {
    // three per row
    flexBasis: '30%',
    flexGrow: 1,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
