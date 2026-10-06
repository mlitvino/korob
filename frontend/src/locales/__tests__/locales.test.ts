import { getTranslation } from 'react-native-paper-dates';

import { resources } from '@/locales';
import en from '@/locales/en';

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ''): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string'
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});

describe('locales', () => {
  const languages = Object.keys(resources) as (keyof typeof resources)[];
  const enKeys = Object.keys(flatten(en.translation)).sort();

  it.each(languages)('%s has the same keys as en and no empty strings', (language) => {
    const flat = flatten(resources[language].translation);

    expect(Object.keys(flat).sort()).toEqual(enKeys);
    expect(Object.values(flat).filter((value) => value.trim() === '')).toEqual([]);
  });

  it.each(languages)('%s has date picker translations registered', (language) => {
    expect(getTranslation(language, 'save')).not.toBe('save');
  });
});
