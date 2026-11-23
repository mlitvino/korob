import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/locales';
import RootErrorFallback from '@/features/app-shell/components/RootErrorFallback';
import ScreenErrorFallback from '@/features/app-shell/components/ScreenErrorFallback';
import { restartApp } from '@/features/app-shell/restartApp';
import { renderWithApp } from '@/testing/renderWithApp';

jest.mock('@/features/app-shell/restartApp', () => ({ restartApp: jest.fn() }));

beforeEach(() => {
  jest.mocked(restartApp).mockClear();
});

describe('ScreenErrorFallback', () => {
  it('shows the error and offers Try again and Restart', () => {
    const retry = jest.fn(() => Promise.resolve());
    renderWithApp(<ScreenErrorFallback error={new Error('boom')} retry={retry} />);

    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.getByText('boom')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByRole('button', { name: 'Restart app' }));
    expect(restartApp).toHaveBeenCalledTimes(1);
  });
});

describe('RootErrorFallback', () => {
  it('renders without any providers', () => {
    const retry = jest.fn(() => Promise.resolve());
    render(<RootErrorFallback error={new Error('provider crashed')} retry={retry} />);

    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.getByText('provider crashed')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByRole('button', { name: 'Restart app' }));
    expect(restartApp).toHaveBeenCalledTimes(1);
  });
});
