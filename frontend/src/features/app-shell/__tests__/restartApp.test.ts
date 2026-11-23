import { DevSettings } from 'react-native';
import * as Updates from 'expo-updates';

import { restartApp } from '@/features/app-shell/restartApp';

jest.mock('expo-updates', () => ({ reloadAsync: jest.fn(() => Promise.resolve()) }));

const globals = globalThis as unknown as { __DEV__: boolean };
const dev = globals.__DEV__;

afterEach(() => {
  globals.__DEV__ = dev;
  jest.restoreAllMocks();
});

describe('restartApp', () => {
  it('reloads through expo-updates in a release build', () => {
    globals.__DEV__ = false;
    restartApp();
    expect(Updates.reloadAsync).toHaveBeenCalledTimes(1);
  });

  it('reloads the dev bundle in development, where reloadAsync is unsupported', () => {
    globals.__DEV__ = true;
    const reload = jest.spyOn(DevSettings, 'reload').mockImplementation(() => {});
    restartApp();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
