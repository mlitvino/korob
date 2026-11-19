import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { gutter, opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import CategoryChipList from '@/features/categories/CategoryChipList';
import { useCategoryEditor } from '@/features/categories/useCategoryEditor';
import type { TransactionType } from '@/types/Transaction';

const TYPES: TransactionType[] = ['income', 'expense'];

export default function Categories() {
  const theme = useTheme();
  const { t } = useTranslation();
  const editor = useCategoryEditor();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {TYPES.map((type) => (
          <View key={type} testID={`categories-${type}`} style={styles.group}>
            <Text
              accessibilityRole="header"
              style={[typography.caption, styles.heading, { color: theme.text }]}
            >
              {t(type === 'income' ? 'total.income' : 'total.expense')}
            </Text>
            <CategoryChipList
              type={type}
              onPress={editor.openEdit}
              onRemove={editor.confirmArchive}
              onAdd={() => editor.openAdd(type)}
            />
          </View>
        ))}
      </ScrollView>
      {editor.sheet}
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
    gap: spacing.md,
  },
  heading: {
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: opacity.secondary,
  },
});
