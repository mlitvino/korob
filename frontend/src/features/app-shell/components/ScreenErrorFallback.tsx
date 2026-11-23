import type { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/contexts/ThemeContext';
import ErrorView from '@/features/app-shell/components/ErrorView';

/** Error boundary fallback inside the providers: themed and translated. */
export default function ScreenErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ErrorView
      theme={theme}
      title={t('screenError.title')}
      message={t('screenError.message')}
      retryLabel={t('errorActions.retry')}
      restartLabel={t('errorActions.restart')}
      error={error}
      onRetry={() => void retry()}
    />
  );
}
