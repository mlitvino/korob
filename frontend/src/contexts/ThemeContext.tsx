import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Themes, ThemeColor } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeProviderProps = {
  children: ReactNode,
};

type ThemeState = keyof typeof Themes
type ThemeAction = { setTheme: (t: ThemeState) => void };

const ThemeStateContext = createContext<ThemeState | undefined >(undefined);
const ThemeDispatchContext = createContext<ThemeAction | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<ThemeState>(systemTheme);

  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  return (
    <ThemeStateContext.Provider value={ theme }>
      <ThemeDispatchContext.Provider value={{ setTheme }}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeStateContext);
  if (!ctx)
    throw new Error('Error: useTheme is undefined');
  return Themes[ctx];
}

export function useThemeColor(colorName: keyof ThemeColor) {
  const ctx = useContext(ThemeStateContext);
  if (!ctx)
    throw new Error('Error: useTheme is undefined');
  return Themes[ctx][colorName];
}

export function useThemeName(): ThemeState {
  const ctx = useContext(ThemeStateContext);
  if (ctx === undefined)
    throw new Error('Error: useThemeName must be used within ThemeProvider');
  return ctx;
}

export function useSetTheme() {
  const ctx = useContext(ThemeDispatchContext);
  if (!ctx)
    throw new Error('Error: useThemeAction is undefined');
  return ctx.setTheme;
}
