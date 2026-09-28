import React from 'react';
import { Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, useThemeName } from '@/contexts/ThemeContext';
import { STORAGE_KEYS } from '@/storage/persist';

function ThemeName() {
  return <Text testID="theme">{useThemeName()}</Text>;
}

describe('ThemeProvider persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('does not overwrite the stored theme before it has loaded', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.theme, JSON.stringify('dark'));
    jest.clearAllMocks();

    render(
      <ThemeProvider>
        <ThemeName />
      </ThemeProvider>,
    );

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('dark'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.theme)).toBe(JSON.stringify('dark'));
  });
});
