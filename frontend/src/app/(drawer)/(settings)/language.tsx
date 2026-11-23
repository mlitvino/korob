import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import * as Flags from '@/components/flags';
import { gutter, radius } from '@/constants/theme';
import { type LanguageName } from '@/locales';
import { LANGUAGE_LABELS } from '@/locales/languageLabels';
import { useLanguage, useSetLanguage } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';

type LanguageOption = {
  flag: React.ComponentType<SvgProps>;
  value: LanguageName;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { flag: Flags.GbFlag, value: 'en' },
  { flag: Flags.FiFlag, value: 'fi' },
  { flag: Flags.RuFlag, value: 'ru' },
];

const FLAG_SIZE = 24;

export default function Language() {
  const theme = useTheme();
  const curLang = useLanguage();
  const setLanguage = useSetLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {LANGUAGE_OPTIONS.map(({ flag: Flag, value }, index) => (
        <SettingsRow
          key={value}
          variant="option"
          position={rowPosition(index, LANGUAGE_OPTIONS.length)}
          label={LANGUAGE_LABELS[value]}
          selected={curLang === value}
          leading={
            <View style={styles.flag}>
              <Flag width={FLAG_SIZE} height={FLAG_SIZE} />
            </View>
          }
          onPress={() => {
            setLanguage(value);
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
  flag: {
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
});
