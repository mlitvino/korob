import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import CategoryEditorSheet from '@/features/categories/CategoryEditorSheet';
import {
  validateCategoryName,
  type CategoryNameError,
} from '@/features/categories/validateCategoryName';
import { useCategoryName } from '@/hooks/useCategoryName';
import {
  useArchiveCategory,
  useCategories,
  useCreateCategory,
  useRenameCategory,
} from '@/queries/categories';
import type { Category } from '@/types/Category';
import type { TransactionType } from '@/types/Transaction';

type Editor =
  | { mode: 'add'; type: TransactionType }
  | { mode: 'edit'; category: Category };

type Options = {
  onCreated?: (category: Category) => void;
};

/** Add/rename sheet and archive confirmation shared by Settings and the form. */
export function useCategoryEditor({ onCreated }: Options = {}) {
  const { t } = useTranslation();
  const nameOf = useCategoryName();
  const categories = useCategories();
  const createCategory = useCreateCategory();
  const renameCategory = useRenameCategory();
  const archiveCategory = useArchiveCategory();

  const [editor, setEditor] = useState<Editor | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<CategoryNameError | null>(null);

  const open = (next: Editor) => {
    setEditor(next);
    setName(next.mode === 'edit' ? nameOf(next.category) : '');
    setError(null);
  };
  const close = () => setEditor(null);

  const save = async () => {
    if (!editor) {
      return;
    }
    const type = editor.mode === 'add' ? editor.type : editor.category.type;
    const excludeId = editor.mode === 'edit' ? editor.category.id : undefined;
    const problem = validateCategoryName(name, type, categories, excludeId);
    if (problem) {
      setError(problem);
      return;
    }

    try {
      if (editor.mode === 'add') {
        const created = await createCategory.mutateAsync({ type, name });
        onCreated?.(created);
      } else {
        await renameCategory.mutateAsync({ id: editor.category.id, name });
      }
      close();
    } catch (saveError) {
      console.warn('Failed to save category', saveError);
      Alert.alert(t('categories.saveFailed'));
    }
  };

  const confirmArchive = (category: Category) => {
    Alert.alert(
      t('categories.archiveTitle', { name: nameOf(category) }),
      t('categories.archiveMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('categories.archive'),
          style: 'destructive',
          onPress: () => {
            archiveCategory.mutate(category.id);
            close();
          },
        },
      ],
    );
  };

  const isSaving = createCategory.isPending || renameCategory.isPending;

  const sheet = (
    <CategoryEditorSheet
      visible={editor !== null}
      mode={editor?.mode === 'edit' ? 'edit' : 'add'}
      name={name}
      error={error}
      saving={isSaving}
      onChangeName={(next) => {
        setName(next);
        setError(null);
      }}
      onSave={() => void save()}
      onArchive={() => {
        if (editor?.mode === 'edit') {
          confirmArchive(editor.category);
        }
      }}
      onClose={close}
    />
  );

  return {
    openAdd: (type: TransactionType) => open({ mode: 'add', type }),
    openEdit: (category: Category) => open({ mode: 'edit', category }),
    confirmArchive,
    sheet,
  };
}
