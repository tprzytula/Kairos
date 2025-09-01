import { render, screen } from '@testing-library/react';
import UncategorizedView from '.';
import { GroceryItemUnit } from '../../../enums/groceryItem';
import { IGroceryItem } from '../../../providers/AppStateProvider/types';

const mockGroceryItems: IGroceryItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: 1,
    unit: GroceryItemUnit.LITER,
    imagePath: 'milk.png',
    toBeRemoved: false,
  },
  {
    id: '2',
    name: 'Bread',
    quantity: 2,
    unit: GroceryItemUnit.UNIT,
    imagePath: 'bread.png',
    toBeRemoved: false,
  },
];

describe('Given the UncategorizedView component', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When rendering with grocery items', () => {
    it('should display the grocery items in a swipeable list', () => {
      render(
        <UncategorizedView
          groceryList={mockGroceryItems}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <UncategorizedView
          groceryList={mockGroceryItems}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with empty grocery list', () => {
    it('should render without errors', () => {
      const { container } = render(
        <UncategorizedView
          groceryList={[]}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
