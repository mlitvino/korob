import { render, screen } from '@testing-library/react-native';

import DebugRoute from '@/app/(drawer)/debug';

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>{`redirect:${href}`}</MockText>;
  },
}));

jest.mock('@/features/debug/components/DebugPanel', () => ({
  DebugPanel: () => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>debug panel</MockText>;
  },
}));

describe('debug route', () => {
  const globals = globalThis as unknown as { __DEV__: boolean };
  const originalDev = globals.__DEV__;

  afterEach(() => {
    globals.__DEV__ = originalDev;
  });

  it('redirects home in production builds', () => {
    globals.__DEV__ = false;
    render(<DebugRoute />);
    expect(screen.getByText('redirect:/')).toBeOnTheScreen();
  });

  it('shows the debug panel in development', () => {
    globals.__DEV__ = true;
    render(<DebugRoute />);
    expect(screen.getByText('debug panel')).toBeOnTheScreen();
  });
});
