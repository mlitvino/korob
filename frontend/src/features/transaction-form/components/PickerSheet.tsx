import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import { opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  visible: boolean;
  title: string;
  doneLabel: string;
  onClose: () => void;
  children: ReactNode;
};

const SCRIM = '#00000080';
const HANDLE = { width: 32, height: 4 };

export default function PickerSheet({
  visible,
  title,
  doneLabel,
  onClose,
  children,
}: Props) {
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
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={doneLabel}
          style={[StyleSheet.absoluteFill, { backgroundColor: SCRIM }]}
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
          {children}
          <Button label={doneLabel} onPress={onClose} style={styles.done} />
        </View>
      </View>
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
  done: {
    marginTop: spacing.lg,
  },
});
