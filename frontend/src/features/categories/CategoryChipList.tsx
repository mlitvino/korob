import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CategoryChip from '@/features/categories/CategoryChip';
import { spacing } from '@/constants/theme';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useActiveCategories } from '@/queries/categories';
import type { Category } from '@/types/Category';
import type { TransactionType } from '@/types/Transaction';

type Props = {
  type: TransactionType;
  /** Set when the list is for picking one; leave unset for edit-on-tap lists. */
  selectedId?: string | null;
  onPress: (category: Category) => void;
  onRemove: (category: Category) => void;
  onAdd: () => void;
};

/** Active categories of one type as wrapping chips, ending with an add chip. */
export default function CategoryChipList({ type, selectedId, onPress, onRemove, onAdd }: Props) {
  const { t } = useTranslation();
  const nameOf = useCategoryName();
  const categories = useActiveCategories(type);

  return (
    <View
      accessibilityRole={selectedId === undefined ? undefined : 'radiogroup'}
      style={styles.list}
    >
      {categories.map((category) => {
        const name = nameOf(category);
        return (
          <CategoryChip
            key={category.id}
            label={name}
            selected={category.id === selectedId}
            pickable={selectedId !== undefined}
            onPress={() => onPress(category)}
            onRemove={() => onRemove(category)}
            removeLabel={t('categories.deleteLabel', { name })}
          />
        );
      })}
      <CategoryChip variant="add" label={t('categories.add')} onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
