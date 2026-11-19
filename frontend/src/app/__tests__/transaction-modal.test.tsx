import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import TransactionModal from '@/app/transaction-modal';
import { createTestDb, type TestDb } from '@/db/testing/createTestDb';
import { renderWithApp } from '@/testing/renderWithApp';

let mockTestDb: TestDb;

jest.mock('@/db/storage', () => ({
  get db() {
    return mockTestDb.db;
  },
  initDb: () => Promise.resolve(),
}));

jest.mock('expo-router', () => ({
  Stack: {
    // The navigator builds the header; render its left button directly.
    Screen: ({ options }: { options: { headerLeft: () => React.ReactNode } }) => (
      <>{options.headerLeft()}</>
    ),
  },
  useLocalSearchParams: () => ({ type: 'expense' }),
  router: { back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));

beforeEach(() => {
  mockTestDb = createTestDb();
  jest.clearAllMocks();
});

const pressBack = async () => {
  renderWithApp(<TransactionModal />);
  await waitFor(() => expect(screen.getByText('Food')).toBeOnTheScreen());
  fireEvent.press(screen.getByRole('button', { name: 'Back' }));
};

describe('TransactionModal back arrow', () => {
  it('goes back to where the modal was opened', async () => {
    jest.mocked(router.canGoBack).mockReturnValue(true);
    await pressBack();

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('falls back to Home when there is no history', async () => {
    jest.mocked(router.canGoBack).mockReturnValue(false);
    await pressBack();

    expect(router.replace).toHaveBeenCalledWith('/(drawer)');
    expect(router.back).not.toHaveBeenCalled();
  });
});
