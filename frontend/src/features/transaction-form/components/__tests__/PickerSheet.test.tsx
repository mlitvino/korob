import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PickerSheet from '@/features/transaction-form/components/PickerSheet';
import { ThemeProvider } from '@/contexts/ThemeContext';

const NO_INSETS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('PickerSheet', () => {
  it('closes from the Done button', () => {
    const onClose = jest.fn();
    render(
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={NO_INSETS}>
          <PickerSheet visible title="Category" doneLabel="Done" onClose={onClose}>
            <Text>Food</Text>
          </PickerSheet>
        </SafeAreaProvider>
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalled();
  });
});
