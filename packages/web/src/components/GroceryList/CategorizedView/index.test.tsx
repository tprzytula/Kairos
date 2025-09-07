import { render, screen } from '@testing-library/react';
import CategorizedView from '.';
import { GroceryItemUnit } from '../../../enums/groceryItem';
import { GroceryCategory } from '../../../enums/groceryCategory';
import { ICategorizedGroceryGroup } from '../../../hooks/useGroceryCategories/types';

const mockCategorizedGroups: ICategorizedGroceryGroup[] = [
  {
    category: GroceryCategory.DAIRY,
    label: 'Dairy',
    items: [
      {
        id: '1',
        name: 'Milk',
        quantity: 1,
        unit: GroceryItemUnit.LITER,
        imagePath: 'milk.png',
        toBeRemoved: false,
        shopId: 'test-shop-1',
      },
    ],
  },
  {
    category: GroceryCategory.BAKERY,
    label: 'Bakery',
    items: [
      {
        id: '2',
        name: 'Bread',
        quantity: 2,
        unit: GroceryItemUnit.UNIT,
        imagePath: 'bread.png',
        toBeRemoved: false,
        shopId: 'test-shop-1',
      },
    ],
  },
];

describe('Given the CategorizedView component', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When rendering with categorized groups', () => {
    it('should display the categorized sections with items', () => {
      render(
        <CategorizedView
          categorizedGroups={mockCategorizedGroups}
          allExpanded={true}
          expandKey={0}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByText('Dairy')).toBeInTheDocument();
      expect(screen.getByText('Bakery')).toBeInTheDocument();
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('should render collapsible sections for each category', () => {
      render(
        <CategorizedView
          categorizedGroups={mockCategorizedGroups}
          allExpanded={true}
          expandKey={0}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getAllByLabelText('Collapse')).toHaveLength(2);
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <CategorizedView
          categorizedGroups={mockCategorizedGroups}
          allExpanded={true}
          expandKey={0}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with empty categorized groups', () => {
    it('should render without errors', () => {
      const { container } = render(
        <CategorizedView
          categorizedGroups={[]}
          allExpanded={true}
          expandKey={0}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
