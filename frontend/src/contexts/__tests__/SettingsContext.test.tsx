import { Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SettingsProvider, useCurrency, useLanguage } from '@/contexts/SettingsContext';
import { STORAGE_KEYS } from '@/storage/persist';

function Probe() {
  return (
    <>
      <Text testID="currency">{useCurrency()}</Text>
      <Text testID="language">{useLanguage()}</Text>
    </>
  );
}

describe('SettingsProvider persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('does not overwrite stored currency and language before they have loaded', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.currency, JSON.stringify('USD'));
    await AsyncStorage.setItem(STORAGE_KEYS.language, JSON.stringify('fi'));
    jest.clearAllMocks();

    render(
      <SettingsProvider>
        <Probe />
      </SettingsProvider>,
    );

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.getByTestId('currency')).toHaveTextContent('USD'));
    expect(screen.getByTestId('language')).toHaveTextContent('fi');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.currency)).toBe(JSON.stringify('USD'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.language)).toBe(JSON.stringify('fi'));
  });
});
