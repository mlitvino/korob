import { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { opacity, radius, scrim, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  visible: boolean;
  title: string;
  /** Screen-reader label for the scrim that closes the sheet. */
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

const HANDLE = { width: 32, height: 4 };

/** Bottom sheet: slides up over a scrim; tapping the scrim or Back closes it. */
export default function Sheet({ visible, title, closeLabel, onClose, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          style={[StyleSheet.absoluteFill, { backgroundColor: scrim }]}
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { backgroundColor: theme.canvas, paddingBottom: spacing.lg + insets.bottom },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.text }]} />
          <Text
            accessibilityRole="header"
            style={[typography.title, styles.title, { color: theme.text }]}
          >
            {title}
          </Text>
          <View style={styles.body}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  handle: {
    ...HANDLE,
    alignSelf: 'center',
    borderRadius: radius.full,
    opacity: opacity.disabled,
  },
  title: {
    fontWeight: '700',
    paddingVertical: spacing.md,
  },
  body: {
    gap: spacing.lg,
  },
});
