import React from 'react';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { useTheme } from '@/contexts/ThemeContext';

export default function HeaderLeft() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 14 }}
    >
      <MaterialIcons name="menu" size={26} color={theme.text} />
    </Pressable>
  );
}
