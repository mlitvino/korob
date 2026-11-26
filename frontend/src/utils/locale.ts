/** Intl locale for an app language, e.g. `ru` → `ru-RU`; unknown languages fall back to `en-US`. */
export function resolveLocale(language: string) {
  if (language.startsWith('fi')) {
    return 'fi-FI';
  }

  if (language.startsWith('ru')) {
    return 'ru-RU';
  }

  return 'en-US';
}
