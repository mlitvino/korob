import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { FieldInput } from '@/components/Field';
import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import Sheet from '@/components/Sheet';
import { gutter, opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import {
  validateCategoryName,
  type CategoryNameError,
} from '@/features/categories/validateCategoryName';
import { useCategoryName } from '@/hooks/useCategoryName';
import {
  useActiveCategories,
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

const TYPES: TransactionType[] = ['income', 'expense'];

const ERROR_KEYS = {
  empty: 'categories.errorEmpty',
  duplicate: 'categories.errorDuplicate',
} as const satisfies Record<CategoryNameError, string>;

function CategoryGroup({ type, onAdd, onEdit }: {
  type: TransactionType;
  onAdd: () => void;
  onEdit: (category: Category) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const nameOf = useCategoryName();
  const categories = useActiveCategories(type);

  return (
    <View testID={`categories-${type}`} style={styles.group}>
      <Text
        accessibilityRole="header"
        style={[typography.caption, styles.heading, { color: theme.text }]}
      >
        {t(type === 'income' ? 'total.income' : 'total.expense')}
      </Text>
      <View>
        {categories.map((category, index) => (
          <SettingsRow
            key={category.id}
            variant="nav"
            position={rowPosition(index, categories.length)}
            label={nameOf(category)}
            onPress={() => onEdit(category)}
          />
        ))}
      </View>
      <Button
        variant="secondary"
        size="md"
        icon="add"
        label={t('categories.add')}
        onPress={onAdd}
      />
    </View>
  );
}

export default function Categories() {
  const theme = useTheme();
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
        await createCategory.mutateAsync({ type, name });
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

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {TYPES.map((type) => (
          <CategoryGroup
            key={type}
            type={type}
            onAdd={() => open({ mode: 'add', type })}
            onEdit={(category) => open({ mode: 'edit', category })}
          />
        ))}
      </ScrollView>

      <Sheet
        visible={editor !== null}
        title={t(editor?.mode === 'edit' ? 'categories.editTitle' : 'categories.newTitle')}
        closeLabel={t('common.cancel')}
        onClose={close}
      >
        <FieldInput
          label={t('categories.name')}
          value={name}
          onChangeText={(next) => {
            setName(next);
            setError(null);
          }}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => void save()}
          error={error ? t(ERROR_KEYS[error]) : null}
        />
        <Button label={t('categories.save')} disabled={isSaving} onPress={() => void save()} />
        {editor?.mode === 'edit' ? (
          <Button
            variant="secondary"
            label={t('categories.archive')}
            onPress={() => confirmArchive(editor.category)}
          />
        ) : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: gutter,
    gap: spacing.xxl,
  },
  group: {
    gap: spacing.sm,
  },
  heading: {
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: opacity.secondary,
    paddingHorizontal: spacing.lg,
  },
});
