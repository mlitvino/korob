import React, {
  createContext,
  useContext,
  useState,
  ReactNode,

} from 'react';

import { Themes, ThemeColors } from '@/constants/theme';
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

export function useThemeColor(colorName: keyof ThemeColors) {
  const ctx = useContext(ThemeStateContext);
  if (!ctx)
    throw new Error('Error: useTheme is undefined');
  return Themes[ctx][colorName];
}

export function useThemeAction() {
  const ctx = useContext(ThemeDispatchContext);
  if (!ctx)
    throw new Error('Error: useThemeAction is undefined');
  return ctx;
}
