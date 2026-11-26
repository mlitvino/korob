import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Menu } from 'react-native-paper';

import { opacity, radius, spacing, touchTarget, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocale } from '@/hooks/useLocale';
import { formatPeriodTitle, type Bounds, type PeriodMode } from '@/utils/period';

const MODES: readonly PeriodMode[] = ['day', 'week', 'month', 'year', 'all', 'range'];
/** Drawn lower than a touch target; `hitSlop` makes up the difference. */
const CONTROL_HEIGHT = 40;
const ARROW_WIDTH = 32;
const SLOP = (touchTarget - CONTROL_HEIGHT) / 2;

type TransactionPeriodBarProps = {
  mode: PeriodMode;
  bounds: Bounds | null;
  onModePress: (mode: PeriodMode) => void;
  onStep: (steps: number) => void;
  onTitlePress: () => void;
};

export function TransactionPeriodBar(
  { mode, bounds, onModePress, onStep, onTitlePress }: TransactionPeriodBarProps,
) {
  const theme = useTheme();
  const { t } = useTranslation();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const chooseMode = (next: PeriodMode) => {
    setMenuOpen(false);
    onModePress(next);
  };

  const arrow = (steps: -1 | 1) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(steps < 0 ? 'period.previous' : 'period.next')}
      onPress={() => onStep(steps)}
      hitSlop={SLOP}
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
    <View style={styles.bar}>
      {/* the wrapper fills the row while there is no date next to the dropdown */}
      <View style={mode === 'all' ? styles.fill : null}>
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchorPosition="bottom"
          contentStyle={{ backgroundColor: theme.elevated }}
          anchor={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('period.select')}
              accessibilityState={{ expanded: menuOpen }}
              onPress={() => setMenuOpen(true)}
              hitSlop={SLOP}
              style={({ pressed }) => [
                styles.select,
                { borderColor: theme.outline },
                pressed && styles.pressed,
              ]}
            >
              <Text
                testID="period-mode"
                numberOfLines={1}
                style={[typography.bodySm, styles.selectText, { color: theme.text }]}
              >
                {t(`period.${mode}`)}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={theme.text} />
            </Pressable>
          }
        >
          {MODES.map((value) => (
            <Menu.Item
              key={value}
              testID={`period-option-${value}`}
              title={t(`period.${value}`)}
              trailingIcon={value === mode ? 'check' : undefined}
              onPress={() => chooseMode(value)}
            />
          ))}
        </Menu>
      </View>

      {mode !== 'all' && bounds
        ? (
          <View style={styles.titleRow}>
            {mode === 'range' ? null : arrow(-1)}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('period.change')}
              onPress={onTitlePress}
              hitSlop={{ top: SLOP, bottom: SLOP }}
              style={({ pressed }) => [styles.title, pressed && styles.pressed]}
            >
              <Text
                testID="period-title"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={[typography.bodySm, styles.titleText, { color: theme.text }]}
              >
                {formatPeriodTitle(mode, bounds, locale)}
              </Text>
            </Pressable>
            {mode === 'range' ? null : arrow(1)}
          </View>
        )
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  fill: {
    flex: 1,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: CONTROL_HEIGHT,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.sm,
  },
  selectText: {
    flexGrow: 1,
    fontWeight: '600',
  },
  titleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: ARROW_WIDTH,
    height: CONTROL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    minHeight: CONTROL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '600',
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
