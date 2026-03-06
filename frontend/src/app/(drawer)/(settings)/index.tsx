import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme-color';

export default function SettingsIndex() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { borderColor: theme.separator }]}>
        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push('/(drawer)/(settings)/appearance')}
        >
          <Text style={[styles.rowLabel, { color: theme.text }]}>Appearance</Text>
          <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionNotFirst: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 22,
  },
});
