import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeOption = {
  label: string;
  value: 'light' | 'dark';
};

const THEME_OPTIONS: ThemeOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function Appearance() {
  const router = useRouter();
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable
        onPress={() => router.push('/(drawer)/(settings)')}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backArrow, { color: theme.text }]}>‹</Text>
        <Text style={[styles.backLabel, { color: theme.text }]}>Appearance</Text>
      </Pressable>
      {THEME_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.surface, borderColor: theme.separator },
            pressed && styles.pressed,
          ]}
          onPress={() => { }}
        >
          <Text style={[styles.rowLabel, { color: theme.text }]}>{option.label}</Text>
          {colorScheme === option.value && (
            <Text style={[styles.checkmark, { color: theme.income }]}>✓</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  backArrow: {
    fontSize: 32,
    lineHeight: 34,
    marginRight: 6,
  },
  backLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
});
