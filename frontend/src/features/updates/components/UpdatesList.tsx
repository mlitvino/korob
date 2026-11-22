import { FlatList, StyleSheet, Text, View } from 'react-native';

import { gutter, opacity, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { CHANGELOG, type Release } from '../changelog';

/** 'YYYY-MM-DD' as a local date; `new Date(string)` is UTC and can show the day before. */
const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

type UpdatesListProps = {
  changelog?: Release[];
};

export function UpdatesList({ changelog = CHANGELOG }: UpdatesListProps) {
  const theme = useTheme();

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      data={changelog}
      keyExtractor={(release) => release.id}
      renderItem={({ item: release }) => (
        <View style={styles.release}>
          <View style={styles.dateWrap}>
            <View style={[styles.line, { backgroundColor: theme.separator }]} />
            <Text style={[typography.caption, styles.date, { color: theme.text }]}>
              {parseLocalDate(release.date).toLocaleDateString(undefined, {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </Text>
            <View style={[styles.line, { backgroundColor: theme.separator }]} />
          </View>
          {release.features.map((feature) => (
            <View key={feature.title} style={[styles.card, { backgroundColor: theme.canvas }]}>
              <Text style={[typography.body, styles.title, { color: theme.text }]}>
                {feature.title}
              </Text>
              <Text style={[typography.bodySm, styles.howTo, { color: theme.text }]}>
                {feature.howTo}
              </Text>
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { alignSelf: 'stretch' },
  content: { padding: gutter, gap: spacing.lg },
  release: { gap: spacing.sm },
  dateWrap: {
    minHeight: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  date: { fontWeight: '600', opacity: opacity.secondary, textTransform: 'uppercase' },
  card: { padding: spacing.lg, borderRadius: radius.md, gap: spacing.xs },
  title: { fontWeight: '700' },
  howTo: { opacity: opacity.secondary },
});
