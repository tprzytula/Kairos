import { render, screen } from '@testing-library/react';
import EmptyGroceryList from '.';

describe('Given the EmptyGroceryList component', () => {
  describe('When rendering with default props', () => {
    it('should display the empty grocery list icon', () => {
      render(<EmptyGroceryList />);

      expect(screen.getByLabelText('Empty grocery list')).toBeInTheDocument();
    });

    it('should display the default title and subtitle', () => {
      render(<EmptyGroceryList />);

      expect(screen.getByText('No grocery items found')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first item')).toBeInTheDocument();
    });

    it('should render the empty state component', () => {
      const { container } = render(<EmptyGroceryList />);

      const emptyStateElement = container.firstChild;
      expect(emptyStateElement).toBeInTheDocument();
    });
  });

  describe('When rendering with custom props', () => {
    it('should display custom title and subtitle', () => {
      const customTitle = 'Custom empty title';
      const customSubtitle = 'Custom empty subtitle';

      render(
        <EmptyGroceryList 
          title={customTitle} 
          subtitle={customSubtitle} 
        />
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customSubtitle)).toBeInTheDocument();
    });

    it('should still display the shopping cart icon', () => {
      render(
        <EmptyGroceryList 
          title="Custom title" 
          subtitle="Custom subtitle" 
        />
      );

      expect(screen.getByLabelText('Empty grocery list')).toBeInTheDocument();
    });
  });

  describe('When rendering with partial custom props', () => {
    it('should use custom title and default subtitle', () => {
      render(<EmptyGroceryList title="Custom title only" />);

      expect(screen.getByText('Custom title only')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first item')).toBeInTheDocument();
    });

    it('should use default title and custom subtitle', () => {
      render(<EmptyGroceryList subtitle="Custom subtitle only" />);

      expect(screen.getByText('No grocery items found')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle only')).toBeInTheDocument();
    });
  });
});
