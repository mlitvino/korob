import { useCallback, useLayoutEffect, useRef } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

import DrawerMenuButton from '@/components/DrawerMenuButton';
import HeaderLeft from '@/components/HeaderLeft';
import { useTransactionSelection } from '@/features/transaction-list/hooks/useTransactionSelection';
import { opacity, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteTransactions } from '@/queries/transactions';

/**
 * Multi-select on the list: the selection replaces the header (count, select all, delete),
 * Back or leaving the screen ends it, and the drawer does not open by swipe meanwhile.
 */
export function useSelectionMode(visibleIds: readonly string[]) {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const selection = useTransactionSelection(visibleIds);
  // mutate is stable; the mutation result object is not, so the header effect must not depend on it
  const { mutate: deleteMany, isPending: deleting } = useDeleteTransactions();

  const confirmDeleteSelected = useCallback(() => {
    const ids = [...selection.selectedIds];
    Alert.alert(
      t('transaction.deleteSelectedTitle', { count: ids.length }),
      t('transaction.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('transaction.delete'),
          style: 'destructive',
          onPress: () => {
            deleteMany(ids, {
              onSuccess: selection.clear,
              onError: (error) => {
                console.warn('Failed to delete transactions', error);
                Alert.alert(t('transaction.deleteFailed'));
              },
            });
          },
        },
      ],
    );
  }, [deleteMany, selection.clear, selection.selectedIds, t]);

  useLayoutEffect(() => {
    if (!selection.selecting) {
      navigation.setOptions({
        title: t('nav.transactions'),
        headerLeft: () => <DrawerMenuButton />,
        headerRight: undefined,
        swipeEnabled: true,
      });
      return;
    }
    navigation.setOptions({
      title: t('transaction.selectedCount', { count: selection.selectedIds.size }),
      headerLeft: () => (
        <HeaderLeft
          icon="close"
          accessibilityLabel={t('transaction.cancelSelection')}
          onPress={selection.clear}
          style={styles.headerLeft}
        />
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            onPress={selection.allSelected ? selection.clear : selection.selectAll}
            style={({ pressed }) => [styles.textButton, { opacity: pressed ? opacity.pressed : 1 }]}
          >
            <Text style={[typography.bodySm, styles.textButtonLabel, { color: theme.text }]}>
              {t(selection.allSelected ? 'transaction.deselectAll' : 'transaction.selectAll')}
            </Text>
          </Pressable>
          <HeaderLeft
            icon="delete"
            accessibilityLabel={t('transaction.deleteSelected')}
            onPress={deleting ? () => {} : confirmDeleteSelected}
          />
        </View>
      ),
      swipeEnabled: false,
    });
  }, [
    confirmDeleteSelected,
    deleting,
    navigation,
    selection,
    t,
    theme.text,
  ]);

  const selectingRef = useRef(selection.selecting);
  selectingRef.current = selection.selecting;
  const clearSelection = selection.clear;
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!selectingRef.current) {
        return false;
      }
      clearSelection();
      return true;
    });
    return () => {
      subscription.remove();
      clearSelection();
    };
  }, [clearSelection]));

  return selection;
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  textButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  textButtonLabel: {
    fontWeight: '600',
  },
});
