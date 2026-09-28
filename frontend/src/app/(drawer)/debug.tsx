export default function DebugRoute() {
  if (!__DEV__) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DebugPanel } = require('@/features/debug/components/DebugPanel');
  return <DebugPanel />;
}
