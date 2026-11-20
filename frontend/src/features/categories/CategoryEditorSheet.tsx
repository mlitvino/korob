import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { FieldInput } from '@/components/Field';
import Sheet from '@/components/Sheet';
import type { CategoryNameError } from '@/features/categories/validateCategoryName';

type Props = {
  visible: boolean;
  /** add: empty name, no Delete button; edit: renaming, with Delete. */
  mode: 'add' | 'edit';
  name: string;
  error: CategoryNameError | null;
  saving: boolean;
  onChangeName: (name: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
};

const ERROR_KEYS = {
  empty: 'categories.errorEmpty',
  duplicate: 'categories.errorDuplicate',
} as const satisfies Record<CategoryNameError, string>;

/** Sheet to name a new category or rename / delete an existing one. */
export default function CategoryEditorSheet({
  visible,
  mode,
  name,
  error,
  saving,
  onChangeName,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const { t } = useTranslation();

  return (
    <Sheet
      visible={visible}
      title={t(mode === 'edit' ? 'categories.editTitle' : 'categories.newTitle')}
      closeLabel={t('common.cancel')}
      onClose={onClose}
    >
      <FieldInput
        label={t('categories.name')}
        value={name}
        onChangeText={onChangeName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onSave}
        error={error ? t(ERROR_KEYS[error]) : null}
      />
      <Button label={t('categories.save')} disabled={saving} onPress={onSave} />
      {mode === 'edit' ? (
        <Button variant="secondary" label={t('categories.delete')} onPress={onDelete} />
      ) : null}
    </Sheet>
  );
}
