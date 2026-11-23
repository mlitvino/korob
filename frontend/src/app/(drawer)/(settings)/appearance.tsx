import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import { gutter, ThemeName } from '@/constants/theme';
import { useTheme, useSetTheme, useThemeName } from '@/contexts/ThemeContext';

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
  const theme = useTheme();
  const setTheme = useSetTheme();
  const themeName = useThemeName();
  const { t } = useTranslation();
  const themeOptions = getThemeOptions(t);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {themeOptions.map((option, index) => (
        <SettingsRow
          key={option.value}
          variant="option"
          position={rowPosition(index, themeOptions.length)}
          label={option.label}
          selected={themeName === option.value}
          onPress={() => {
            setTheme(option.value);
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
