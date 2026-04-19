import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';

type HeaderLeftProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderLeft({ icon, onPress, style }: HeaderLeftProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[{ marginLeft: 14 }, style]}
    >
      <MaterialIcons name={icon} size={26} color={theme.text} />
    </Pressable>
  );
}
