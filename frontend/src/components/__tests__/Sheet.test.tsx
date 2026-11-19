import { Modal, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Sheet from '@/components/Sheet';
import { ThemeProvider } from '@/contexts/ThemeContext';

const NO_INSETS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('Sheet', () => {
  it('shows its content and closes on system Back', async () => {
    const onClose = jest.fn();
    render(
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={NO_INSETS}>
          <Sheet visible title="Category" closeLabel="Close" onClose={onClose}>
            <Text>Food</Text>
          </Sheet>
        </SafeAreaProvider>
      </ThemeProvider>,
    );
    await act(async () => {});

    expect(screen.getByText('Food')).toBeOnTheScreen();
    // The scrim is hidden from screen readers by the modal panel; Back is how they close it.
    fireEvent(screen.UNSAFE_getByType(Modal), 'requestClose');
    expect(onClose).toHaveBeenCalled();
  });
});
