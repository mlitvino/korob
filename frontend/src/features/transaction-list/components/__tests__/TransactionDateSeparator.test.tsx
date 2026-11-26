import AsyncStorage from '@react-native-async-storage/async-storage';
import { screen, waitFor } from '@testing-library/react-native';

import {
  TransactionDateSeparator,
} from '@/features/transaction-list/components/TransactionDateSeparator';
import { changeLanguage } from '@/locales';
import { STORAGE_KEYS } from '@/storage/persist';
import { renderWithApp } from '@/testing/renderWithApp';

describe('TransactionDateSeparator', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
    await changeLanguage('en');
  });

  it('writes the date in the app language, not the phone language', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.language, JSON.stringify('ru'));

    renderWithApp(<TransactionDateSeparator occurredAt={new Date(2026, 10, 25)} />);

    await waitFor(() => expect(screen.getByText(/25 нояб/)).toBeOnTheScreen());
  });
});
