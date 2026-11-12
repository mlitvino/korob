import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

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
  const router = useRouter();
  const theme = useTheme();
  const currency = useCurrency();
  const setCurrency = useSetCurrency();
  const { t } = useTranslation();
  const currencyOptions = getCurrencyOptions(t);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable
        onPress={() => router.push('/(drawer)/(settings)')}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backArrow, { color: theme.text }]}>‹</Text>
        <Text style={[styles.backLabel, { color: theme.text }]}>{t('settings.currency')}</Text>
      </Pressable>

      {currencyOptions.map((option) => (
        <Pressable
          key={option.value}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.surface, borderColor: theme.separator },
            pressed && styles.pressed,
          ]}
          onPress={() => { setCurrency(option.value); }}
        >
          <Text style={[styles.rowLabel, { color: theme.text }]}>{option.label}</Text>
          {currency === option.value && (
            <Text style={[styles.checkmark, { color: theme.income }]}>✓</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  backArrow: {
    fontSize: 32,
    lineHeight: 34,
    marginRight: 6,
  },
  backLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
});
