import { StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { ReactElement } from 'react';

import { type Theme } from '@/constants/theme';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import CategoryChip from '@/features/categories/CategoryChip';

let theme: Theme;

function ThemeProbe() {
  theme = useTheme();
  return null;
}

const renderThemed = async (ui: ReactElement) => {
  const result = render(
    <ThemeProvider>
      <ThemeProbe />
      {ui}
    </ThemeProvider>,
  );
  await act(async () => {});
  return result;
};

const styleOf = (node: { props: { style?: unknown } }) =>
  StyleSheet.flatten(node.props.style as never) as Record<string, unknown>;

describe('CategoryChip', () => {
  it('fills with the selection role when selected', async () => {
    await renderThemed(<CategoryChip label="Food" selected pickable />);
    expect(screen.getByRole('radio', { name: 'Food' })).toBeSelected();
    expect(styleOf(screen.getByTestId('category-chip')).backgroundColor).toBe(theme.selection);
  });

  it('uses the outline color for the border when not selected', async () => {
    await renderThemed(<CategoryChip label="Food" />);
    expect(styleOf(screen.getByTestId('category-chip')).borderColor).toBe(theme.outline);
  });

  it('calls onPress and onRemove from separate targets', async () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    await renderThemed(
      <CategoryChip
        label="Food"
        pickable
        onPress={onPress}
        onRemove={onRemove}
        removeLabel="Archive Food"
      />,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Archive Food' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('radio', { name: 'Food' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('has no × without onRemove, and the add variant is a button', async () => {
    await renderThemed(<CategoryChip variant="add" label="Add category" onRemove={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Add category' })).toBeOnTheScreen();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('is a plain button, not a radio, unless it picks one', async () => {
    await renderThemed(<CategoryChip label="Food" onPress={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Food' })).toBeOnTheScreen();
    expect(screen.queryByRole('radio')).not.toBeOnTheScreen();
  });
});
