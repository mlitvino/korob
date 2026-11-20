import { fireEvent, screen } from '@testing-library/react-native';

import CategoryEditorSheet from '@/features/categories/CategoryEditorSheet';
import { renderWithApp } from '@/testing/renderWithApp';

const renderSheet = (props: Partial<Parameters<typeof CategoryEditorSheet>[0]> = {}) => {
  const handlers = {
    onChangeName: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    onClose: jest.fn(),
  };
  renderWithApp(
    <CategoryEditorSheet
      visible
      mode="edit"
      name="Food"
      error={null}
      saving={false}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
};

describe('CategoryEditorSheet', () => {
  it('offers Delete only when editing', () => {
    const { onDelete } = renderSheet();
    expect(screen.getByText('Edit category')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('hides Delete when adding', () => {
    renderSheet({ mode: 'add', name: '' });
    expect(screen.getByText('New category')).toBeOnTheScreen();
    expect(screen.queryByText('Delete')).not.toBeOnTheScreen();
  });

  it('shows the validation message under the field', () => {
    renderSheet({ error: 'duplicate' });
    expect(screen.getByText('A category with this name already exists')).toBeOnTheScreen();
  });

  it('reports typing and saving', () => {
    const { onChangeName, onSave } = renderSheet();
    fireEvent.changeText(screen.getByLabelText('Name'), 'Groceries');
    fireEvent.press(screen.getByText('Save'));
    expect(onChangeName).toHaveBeenCalledWith('Groceries');
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
