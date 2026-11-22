import { screen } from '@testing-library/react-native';

import { renderWithApp } from '@/testing/renderWithApp';
import type { Release } from '../../changelog';
import { UpdatesList } from '../UpdatesList';

const changelog: Release[] = [
  { id: '2026-11-23', date: '2026-11-23', features: [
    { title: 'Первая функция', howTo: 'Нажмите кнопку' },
    { title: 'Вторая функция', howTo: 'Потяните вниз' },
  ] },
  { id: '2026-11-01', date: '2026-11-01', features: [
    { title: 'Старая функция', howTo: 'Как раньше' },
  ] },
];

describe('UpdatesList', () => {
  it('shows the release day itself, not the day before in zones west of UTC', () => {
    renderWithApp(<UpdatesList changelog={[changelog[0]]} />);
    expect(screen.getByText(/23/)).toBeOnTheScreen();
    expect(screen.queryByText(/22/)).not.toBeOnTheScreen();
  });

  it('renders every release date, feature title and howTo', () => {
    renderWithApp(<UpdatesList changelog={changelog} />);
    for (const release of changelog) {
      const [year, month, day] = release.date.split('-').map(Number);
      expect(screen.getByText(new Date(year, month - 1, day).toLocaleDateString(undefined, {
        day: '2-digit', month: 'long', year: 'numeric',
      }))).toBeOnTheScreen();
      for (const { title, howTo } of release.features) {
        expect(screen.getByText(title)).toBeOnTheScreen();
        expect(screen.getByText(howTo)).toBeOnTheScreen();
      }
    }
  });
});
