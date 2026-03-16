import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { useTheme, useSetTheme, useThemeName } from '@/contexts/ThemeContext';
import { ThemeName } from '@/constants/theme';

type ThemeOption = {
  label: string;
  value: ThemeName;
};

const getThemeOptions = (t: TFunction): ThemeOption[] => [
  { label: t('appearance.dark'), value: 'dark' },
  { label: t('appearance.light'), value: 'light' },
  { label: t('appearance.black'), value: 'black' },
  { label: t('appearance.black_yellow'), value: 'black_yellow' },
];

export default function Appearance() {
  const router = useRouter();
  const theme = useTheme();
  const setTheme = useSetTheme();
  const themeName = useThemeName();
  const { t } = useTranslation();
  const themeOptions = getThemeOptions(t);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable
        onPress={() => router.push('/(drawer)/(settings)')}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backArrow, { color: theme.text }]}>‹</Text>
        <Text style={[styles.backLabel, { color: theme.text }]}>{t('appearance.title')}</Text>
      </Pressable>

      {themeOptions.map((option) => (
        <Pressable
          key={option.value}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.surface, borderColor: theme.separator },
            pressed && styles.pressed,
          ]}
          onPress={() => { setTheme(option.value); }}
        >
          <Text style={[styles.rowLabel, { color: theme.text }]}>{option.label}</Text>
          {themeName === option.value && (
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
