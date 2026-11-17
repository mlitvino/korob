import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import SettingsRow from '@/components/SettingsRow';
import { gutter } from '@/constants/theme';
import { useCurrency, useLanguage } from '@/contexts/SettingsContext';
import { useTheme, useThemeName } from '@/contexts/ThemeContext';
import { LANGUAGE_LABELS } from '@/locales/languageLabels';

export default function SettingsIndex() {
  const router = useRouter();
  const theme = useTheme();
  const themeName = useThemeName();
  const currency = useCurrency();
  const language = useLanguage();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsRow
        variant="value"
        position="first"
        label={t('settings.currency')}
        value={currency}
        onPress={() => router.push('/(drawer)/(settings)/currency')}
      />
      <SettingsRow
        variant="value"
        position="middle"
        label={t('settings.appearance')}
        value={t(`appearance.${themeName}`)}
        onPress={() => router.push('/(drawer)/(settings)/appearance')}
      />
      <SettingsRow
        variant="value"
        position="last"
        label={t('settings.language')}
        value={LANGUAGE_LABELS[language]}
        onPress={() => router.push('/(drawer)/(settings)/language')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: gutter,
  },
});
