import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('notFoundScreen.header'),
          headerStyle: { backgroundColor: theme.elevated },
          headerTitleStyle: { color: theme.text },
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.canvas }]}>
        <Link href="/" style={[styles.button, { color: theme.text }]}>
          {t('notFoundScreen.mainMessage')}
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
