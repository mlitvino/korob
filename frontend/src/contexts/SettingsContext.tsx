import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import { changeLanguage, getCurrentLanguage, type LanguageName } from '@/locales';
import { loadJson, saveJson, STORAGE_KEYS } from '@/storage/persist';

export type CurrencyCode = 'EUR' | 'USD';

type SettingsProviderProps = {
  children: ReactNode;
};

type SettingsDispatch = {
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (language: LanguageName) => void;
};

const initialCurrency: CurrencyCode = 'EUR';
const SettingsCurrencyContext = createContext<CurrencyCode | undefined>(undefined);
const SettingsLanguageContext = createContext<LanguageName | undefined>(undefined);
const SettingsDispatchContext = createContext<SettingsDispatch | undefined>(undefined);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [language, setLanguageState] = useState<LanguageName>(() => {
    try {
      return getCurrentLanguage();
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const [storedCurrency, storedLanguage] = await Promise.all([
        loadJson<CurrencyCode>(STORAGE_KEYS.currency),
        loadJson<LanguageName>(STORAGE_KEYS.language),
      ]);

      if (!isActive) {
        return;
      }

      if (storedCurrency) {
        setCurrency(storedCurrency);
      }
      if (storedLanguage) {
        setLanguageState(storedLanguage);
        void changeLanguage(storedLanguage);
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    void saveJson(STORAGE_KEYS.currency, currency);
  }, [currency]);

  useEffect(() => {
    void saveJson(STORAGE_KEYS.language, language);
    void changeLanguage(language);
  }, [language]);

  const dispatchValue = useMemo<SettingsDispatch>(() => ({
    setCurrency,
    setLanguage: (nextLanguage) => {
      setLanguageState(nextLanguage);
    },
  }), []);

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
