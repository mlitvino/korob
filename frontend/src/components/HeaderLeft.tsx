import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { opacity, radius, touchTarget } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type HeaderLeftProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderLeft({ icon, accessibilityLabel, onPress, style }: HeaderLeftProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: touchTarget,
          height: touchTarget,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      <MaterialIcons name={icon} size={24} color={theme.text} />
    </Pressable>
  );
}
