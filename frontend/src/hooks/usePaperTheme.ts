import { useMemo } from 'react';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { useTheme } from '@/contexts/ThemeContext';

export function usePaperTheme(): MD3Theme {
  const theme = useTheme();

  return useMemo(() => {
    const base = theme.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.pickerAccent,
        onPrimary: theme.contrastText,
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
        backdrop: '#00000066',
        elevation: {
          ...base.colors.elevation,
          level3: theme.elevated,
        },
      },
    };
  }, [theme]);
}
