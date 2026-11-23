import i18n from '@/locales';
import { categoryName } from '@/hooks/useCategoryName';
import type { Category } from '@/types/Category';

const food: Category = {
  id: 'expense-food',
  type: 'expense',
  key: 'food',
  name: null,
  sortOrder: 0,
  archivedAt: null,
};
const pets: Category = {
  id: 'custom-1',
  type: 'expense',
  key: null,
  name: 'Pets',
  sortOrder: 7,
  archivedAt: null,
};

describe('categoryName', () => {
  it.each(['en', 'fi', 'ru'] as const)('translates built-ins in %s', (language) => {
    const t = i18n.getFixedT(language);
    expect(categoryName(food, t)).toBe(t('category.food'));
    expect(categoryName(food, t)).not.toBe('category.food');
  });

  it('shows a custom name as typed in every language', () => {
    expect(categoryName(pets, i18n.getFixedT('fi'))).toBe('Pets');
    expect(categoryName(pets, i18n.getFixedT('ru'))).toBe('Pets');
  });
});
