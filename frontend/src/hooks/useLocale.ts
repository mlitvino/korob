import { useTranslation } from 'react-i18next';

import { resolveLocale } from '@/utils/locale';

/** Intl locale of the app language (not the phone's), for dates and money. */
export function useLocale() {
  const { i18n } = useTranslation();
  return resolveLocale(i18n.language);
}
