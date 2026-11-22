import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, screen, waitFor } from '@testing-library/react-native';

import { renderWithApp } from '@/testing/renderWithApp';
import { CHANGELOG } from '../../changelog';
import { resetLastSeenUpdate, useUnseenUpdates } from '../../hooks/useUnseenUpdates';
import { UpdatesDrawerLabel } from '../UpdatesDrawerLabel';

// the dot is hidden from the accessibility tree on purpose; the label carries the meaning
const HIDDEN = { includeHiddenElements: true };

beforeEach(async () => {
  await AsyncStorage.clear();
  resetLastSeenUpdate();
});

describe('UpdatesDrawerLabel', () => {
  it('shows the dot until the page is opened', async () => {
    let markSeen = () => {};
    function Opener() {
      markSeen = useUnseenUpdates().markSeen;
      return null;
    }
    renderWithApp(<><UpdatesDrawerLabel color="#000" /><Opener /></>);
    expect(screen.getByText('Updates')).toBeOnTheScreen();
    await waitFor(() => expect(screen.getByTestId('updates-dot', HIDDEN)).toBeOnTheScreen());
    expect(screen.getByLabelText('Updates, new')).toBeOnTheScreen();
    expect(CHANGELOG.length).toBeGreaterThan(0);

    await act(async () => markSeen());
    await waitFor(() => expect(screen.queryByTestId('updates-dot', HIDDEN)).not.toBeOnTheScreen());
    expect(screen.queryByLabelText('Updates, new')).not.toBeOnTheScreen();
  });
});
