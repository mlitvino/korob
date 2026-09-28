import React from 'react';
import { Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BalanceProvider, useBalance } from '@/contexts/BalanceContext';
import { STORAGE_KEYS } from '@/storage/persist';

function Balance() {
  return <Text testID="balance">{useBalance()}</Text>;
}

describe('BalanceProvider persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('does not overwrite the stored balance before it has loaded', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.balance, JSON.stringify(250));
    jest.clearAllMocks();

    render(
      <BalanceProvider>
        <Balance />
      </BalanceProvider>,
    );

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.getByTestId('balance')).toHaveTextContent('250'));
    expect(await AsyncStorage.getItem(STORAGE_KEYS.balance)).toBe(JSON.stringify(250));
  });
});
