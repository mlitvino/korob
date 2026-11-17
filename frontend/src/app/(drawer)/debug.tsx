import { Redirect } from 'expo-router';

export default function DebugRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DebugPanel } = require('@/features/debug/components/DebugPanel');
  return <DebugPanel />;
}
