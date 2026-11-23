import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import { gutter } from '@/constants/theme';
import { useCurrency, useSetCurrency } from '@/contexts/SettingsContext';
import type { CurrencyCode } from '@/types/Currency';
import { useTheme } from '@/contexts/ThemeContext';

type CurrencyOption = {
  label: string;
  value: CurrencyCode;
};

function getCurrencyOptions(t: TFunction): CurrencyOption[] {
  return [
    { label: t('currency.eur'), value: 'EUR' },
    { label: t('currency.usd'), value: 'USD' },
  ];
}

export default function Currency() {
  const theme = useTheme();
  const currency = useCurrency();
  const setCurrency = useSetCurrency();
  const { t } = useTranslation();
  const currencyOptions = getCurrencyOptions(t);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {currencyOptions.map((option, index) => (
        <SettingsRow
          key={option.value}
          variant="option"
          position={rowPosition(index, currencyOptions.length)}
          label={option.label}
          selected={currency === option.value}
          onPress={() => {
            setCurrency(option.value);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: gutter,
  },
});
