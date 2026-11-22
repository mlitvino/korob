import { Keyboard, KeyboardAvoidingView, Modal, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Sheet from '@/components/Sheet';
import { ThemeProvider } from '@/contexts/ThemeContext';

const NO_INSETS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

afterEach(() => {
  jest.restoreAllMocks();
});

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

  it('only avoids the keyboard while it is shown, so no gap is left after it hides', async () => {
    const handlers: Record<string, () => void> = {};
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, handler) => {
      handlers[event] = handler as () => void;
      return { remove: jest.fn() } as never;
    });
    render(
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={NO_INSETS}>
          <Sheet visible title="Category" closeLabel="Close" onClose={jest.fn()}>
            <Text>Food</Text>
          </Sheet>
        </SafeAreaProvider>
      </ThemeProvider>,
    );
    await act(async () => {});
    const avoiding = () => screen.UNSAFE_getByType(KeyboardAvoidingView).props.enabled;

    act(() => handlers.keyboardDidShow());
    expect(avoiding()).toBe(true);
    act(() => handlers.keyboardDidHide());
    expect(avoiding()).toBe(false);
  });
});
