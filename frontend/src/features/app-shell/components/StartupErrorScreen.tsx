import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/contexts/ThemeContext';
import ErrorView from '@/features/app-shell/components/ErrorView';

type Props = {
  error: Error;
  onRetry: () => void;
};

/** Full-screen overlay shown when the first load of the app's data fails. */
export default function StartupErrorScreen({ error, onRetry }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ErrorView
      theme={theme}
      title={t('startupError.title')}
      message={t('startupError.message')}
      retryLabel={t('errorActions.retry')}
      restartLabel={t('errorActions.restart')}
      error={error}
      onRetry={onRetry}
      style={styles.overlay}
    />
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
});
