import { useColorScheme } from 'react-native';
import type { ErrorBoundaryProps } from 'expo-router';

import { Themes } from '@/constants/theme';
import i18n from '@/locales';
import ErrorView from '@/features/app-shell/components/ErrorView';

/**
 * Error boundary fallback for the root layout. It renders outside every provider, so it
 * takes the system light/dark theme and calls i18n directly instead of using context hooks.
 */
export default function RootErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const theme = Themes[useColorScheme() === 'dark' ? 'dark' : 'light'];

  return (
    <ErrorView
      theme={theme}
      title={i18n.t('screenError.title')}
      message={i18n.t('screenError.message')}
      retryLabel={i18n.t('errorActions.retry')}
      restartLabel={i18n.t('errorActions.restart')}
      error={error}
      onRetry={() => void retry()}
    />
  );
}
