import { fireEvent, screen } from '@testing-library/react-native';

import StartupErrorScreen from '@/features/app-shell/components/StartupErrorScreen';
import { restartApp } from '@/features/app-shell/restartApp';
import { renderWithApp } from '@/testing/renderWithApp';

jest.mock('@/features/app-shell/restartApp', () => ({ restartApp: jest.fn() }));

describe('StartupErrorScreen', () => {
  it('explains the failure, shows the error text and retries on press', () => {
    const onRetry = jest.fn();
    renderWithApp(<StartupErrorScreen error={new Error('disk I/O error')} onRetry={onRetry} />);

    expect(screen.getByText("Couldn't open your data")).toBeOnTheScreen();
    expect(screen.getByText(/Try again, or restart the app/)).toBeOnTheScreen();
    expect(screen.getByText('disk I/O error')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('restarts the app, so a failing migration is not a dead end', () => {
    renderWithApp(<StartupErrorScreen error={new Error('disk I/O error')} onRetry={jest.fn()} />);

    fireEvent.press(screen.getByRole('button', { name: 'Restart app' }));
    expect(restartApp).toHaveBeenCalledTimes(1);
  });
});
