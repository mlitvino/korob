import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColor } from '@/constants/theme';

type Props = {
  visible: boolean;
  title: string;
  doneLabel: string;
  onClose: () => void;
  theme: ThemeColor;
  children: ReactNode;
};

export default function PickerSheet({
  visible,
  title,
  doneLabel,
  onClose,
  theme,
  children,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.canvas, borderColor: theme.separator },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {children}
          <Pressable
            style={[styles.button, { backgroundColor: theme.elevated }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>{doneLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  button: {
    margin: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
