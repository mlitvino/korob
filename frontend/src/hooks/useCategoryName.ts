import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import type { Category } from '@/types/Category';

export function categoryName(category: Category, t: TFunction) {
  return category.key !== null ? t(`category.${category.key}`) : category.name;
}

export function useCategoryName() {
  const { t } = useTranslation();
  return (category: Category) => categoryName(category, t);
}
