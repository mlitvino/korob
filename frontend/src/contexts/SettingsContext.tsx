import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';

import { usePersistedState } from '@/hooks/usePersistedState';
import { changeLanguage, getCurrentLanguage, resources, type LanguageName } from '@/locales';
import { STORAGE_KEYS } from '@/storage/persist';
import { CURRENCIES, type CurrencyCode } from '@/types/Currency';

type SettingsProviderProps = {
  children: ReactNode;
};

type SettingsDispatch = {
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (language: LanguageName) => void;
};

const initialCurrency: CurrencyCode = 'EUR';

const isCurrency = (value: unknown): value is CurrencyCode =>
  CURRENCIES.includes(value as CurrencyCode);

const isLanguage = (value: unknown): value is LanguageName =>
  typeof value === 'string' && value in resources;

const initialLanguage = (): LanguageName => {
  try {
    return getCurrentLanguage();
  } catch {
    return 'en';
  }
};

const SettingsCurrencyContext = createContext<CurrencyCode | undefined>(undefined);
const SettingsLanguageContext = createContext<LanguageName | undefined>(undefined);
const SettingsDispatchContext = createContext<SettingsDispatch | undefined>(undefined);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [currency, setCurrency] = usePersistedState(
    STORAGE_KEYS.currency,
    initialCurrency,
    isCurrency,
  );
  const [language, setLanguage] = usePersistedState(
    STORAGE_KEYS.language,
    initialLanguage,
    isLanguage,
  );

  useEffect(() => {
    void changeLanguage(language);
  }, [language]);

  const dispatchValue = useMemo<SettingsDispatch>(
    () => ({ setCurrency, setLanguage }),
    [setCurrency, setLanguage],
  );

  return (
    <SettingsCurrencyContext.Provider value={currency}>
      <SettingsLanguageContext.Provider value={language}>
        <SettingsDispatchContext.Provider value={dispatchValue}>
          {children}
        </SettingsDispatchContext.Provider>
      </SettingsLanguageContext.Provider>
    </SettingsCurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(SettingsCurrencyContext);
  if (ctx === undefined) {
    throw new Error('Error: useCurrency must be used within SettingsProvider');
  }
  return ctx;
}

export function useSetCurrency() {
  const ctx = useContext(SettingsDispatchContext);
  if (ctx === undefined) {
    throw new Error('Error: useSetCurrency must be used within SettingsProvider');
  }
  return ctx.setCurrency;
}

export function useLanguage() {
  const ctx = useContext(SettingsLanguageContext);
  if (ctx === undefined) {
    throw new Error('Error: useLanguage must be used within SettingsProvider');
  }
  return ctx;
}

export function useSetLanguage() {
  const ctx = useContext(SettingsDispatchContext);
  if (ctx === undefined) {
    throw new Error('Error: useSetLanguage must be used within SettingsProvider');
  }
  return ctx.setLanguage;
}
