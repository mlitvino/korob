import { render } from '@testing-library/react-native';

import { AppProviders } from '@/contexts/AppProviders';
import Icon from '@/components/IconButton';

describe('IconButton component', () => {
  test('IconButton renders correctly', () => {
    const tree = render(
      <AppProviders>
        <Icon icon={'check'} />
      </AppProviders>,
    );

    expect(tree).toMatchSnapshot();
  });
});
