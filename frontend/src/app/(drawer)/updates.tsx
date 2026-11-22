import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { useTheme } from '@/contexts/ThemeContext';
import { UpdatesList } from '@/features/updates/components/UpdatesList';
import { useUnseenUpdates } from '@/features/updates/hooks/useUnseenUpdates';

export default function Updates() {
  const theme = useTheme();
  const { markSeen } = useUnseenUpdates();

  useFocusEffect(useCallback(() => {
    markSeen();
  }, [markSeen]));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <UpdatesList />
    </View>
  );
}
