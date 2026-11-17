import { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import { FieldInput, FieldPicker } from '@/components/Field';
import SettingsRow, { rowPosition } from '@/components/SettingsRow';
import { opacity, type Theme } from '@/constants/theme';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

let theme: Theme;

function ThemeProbe() {
  theme = useTheme();
  return null;
}

const renderThemed = (ui: ReactElement) =>
  render(
    <ThemeProvider>
      <ThemeProbe />
      {ui}
    </ThemeProvider>,
  );

const styleOf = (node: { props: { style?: unknown } }) =>
  StyleSheet.flatten(node.props.style as never) as Record<string, unknown>;

describe('Button', () => {
  it('fills primary with the accent and secondary with elevated', () => {
    renderThemed(
      <>
        <Button label="Primary" />
        <Button label="Secondary" variant="secondary" />
      </>,
    );

    const [primary, secondary] = screen.getAllByRole('button');
    expect(styleOf(primary).backgroundColor).toBe(theme.accent);
    expect(styleOf(secondary).backgroundColor).toBe(theme.elevated);
  });

  it('does not fire onPress and dims when disabled', () => {
    const onPress = jest.fn();
    renderThemed(<Button label="Done" disabled onPress={onPress} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(styleOf(button).opacity).toBe(opacity.disabled);
  });
});

describe('CircleButton', () => {
  it.each([
    ['lg', 80],
    ['md', 64],
  ] as const)('renders size %s as a %ipx circle', (size, px) => {
    renderThemed(<CircleButton kind="expense" size={size} accessibilityLabel="Add expense" />);

    const button = screen.getByRole('button', { name: 'Add expense' });
    expect(styleOf(button)).toMatchObject({ width: px, height: px });
    expect(styleOf(button).backgroundColor).toBe(theme.expense);
  });
});

describe('SettingsRow', () => {
  it('shows the accent check only on the selected option', () => {
    renderThemed(
      <>
        <SettingsRow variant="option" label="Euro" selected />
        <SettingsRow variant="option" label="Dollar" />
      </>,
    );

    expect(screen.getAllByTestId('settings-row-check')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: /Euro/ })).toBeSelected();
    expect(screen.getByRole('radio', { name: /Dollar/ })).not.toBeSelected();
  });

  it('shows the current value on value rows', () => {
    renderThemed(<SettingsRow variant="value" label="Currency" value="EUR" />);

    expect(screen.getByText('EUR')).toBeOnTheScreen();
  });

  it('maps list indexes to grouped positions', () => {
    expect(rowPosition(0, 1)).toBe('only');
    expect([0, 1, 2].map((i) => rowPosition(i, 3))).toEqual(['first', 'middle', 'last']);
  });
});

describe('Field', () => {
  it('shows an accent border while the input is focused', () => {
    renderThemed(<FieldInput label="Amount" testID="amount" />);

    const input = screen.getByTestId('amount');
    const box = () => styleOf(input.parent?.parent as never);

    expect(box().borderColor).toBe('transparent');
    fireEvent(input, 'focus');
    expect(box().borderColor).toBe(theme.accent);
  });

  it('fills fields with inset, never with the text color', () => {
    renderThemed(<FieldPicker label="Category" value="Food" onPress={() => {}} />);

    const picker = screen.getByRole('button', { name: 'Category: Food' });
    expect(styleOf(picker).backgroundColor).toBe(theme.inset);
    expect(styleOf(picker).backgroundColor).not.toBe(theme.text);
  });
});
