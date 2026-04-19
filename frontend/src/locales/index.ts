import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en';
import fi from './fi';
import type { LocaleResource } from './types';

export type Resources = {
  en: LocaleResource;
  fi: LocaleResource;
};

export const resources: Resources = {
  en,
  fi,
};

export type LanguageName = keyof Resources;

export async function changeLanguage(lang: LanguageName) {
  await i18n.changeLanguage(lang)
    .catch((e) => {
      throw new Error('Error: failed to change language:', e);
    });
}

export function getCurrentLanguage() {
  const ln = i18n.language;
  if (!ln) {
    throw new Error('Error: language is undefined');
  }
  return ln as LanguageName;
}

function initLanguage() {
  const locLang = Localization.getLocales()[0]?.languageCode;

  if (locLang && Object.prototype.hasOwnProperty.call(resources, locLang)) {
    return locLang as LanguageName;
  }

  return 'en';
}

const i18n = createInstance();

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => console.warn('Error: i18n init failed:', err));

export default i18n;
