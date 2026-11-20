import { useMemo } from 'react';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { scrim } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export function usePaperTheme(): MD3Theme {
  const theme = useTheme();

  return useMemo(() => {
    const base = theme.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.actionPrimary,
        onPrimary: theme.onActionPrimary,
        primaryContainer: theme.inset,
        onPrimaryContainer: theme.pickerText,
        tertiaryContainer: theme.inset,
        onTertiaryContainer: theme.pickerText,
        background: theme.background,
        onBackground: theme.text,
        surface: theme.surface,
        onSurface: theme.text,
        surfaceVariant: theme.surface,
        onSurfaceVariant: theme.pickerText,
        outline: theme.separator,
        backdrop: scrim,
        elevation: {
          ...base.colors.elevation,
          level3: theme.elevated,
        },
      },
    };
  }, [theme]);
}
