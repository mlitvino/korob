import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { opacity, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import type { CurrencyCode } from '@/types/Currency';

type MissingRatesNoteProps = {
  /** Currencies left out of the totals; nothing is drawn when empty. */
  missing: readonly CurrencyCode[];
};

/** One line under totals naming the currencies that have no exchange rate yet. */
export function MissingRatesNote({ missing }: MissingRatesNoteProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (missing.length === 0) {
    return null;
  }

  return (
    <Text
      testID="missing-rates"
      style={[typography.caption, styles.note, { color: theme.text }]}
    >
      {t('total.notCounted', { currencies: missing.join(', ') })}
    </Text>
  );
}

const styles = StyleSheet.create({
  note: {
    textAlign: 'center',
    opacity: opacity.secondary,
  },
});
