import { render, screen } from '@testing-library/react';
import EmptyToDoList from '.';

describe('Given the EmptyToDoList component', () => {
  describe('When rendering with default props', () => {
    it('should display the empty to-do list icon', () => {
      render(<EmptyToDoList />);

      expect(screen.getByLabelText('Empty to-do list')).toBeInTheDocument();
    });

    it('should display the default title and subtitle', () => {
      render(<EmptyToDoList />);

      expect(screen.getByText('No pending to-do items found')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first task')).toBeInTheDocument();
    });

    it('should render the empty state component', () => {
      const { container } = render(<EmptyToDoList />);

      const emptyStateElement = container.firstChild;
      expect(emptyStateElement).toBeInTheDocument();
    });
  });

  describe('When rendering with custom props', () => {
    it('should display custom title and subtitle', () => {
      const customTitle = 'Custom empty title';
      const customSubtitle = 'Custom empty subtitle';

      render(
        <EmptyToDoList 
          title={customTitle} 
          subtitle={customSubtitle} 
        />
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customSubtitle)).toBeInTheDocument();
    });

    it('should still display the checklist icon', () => {
      render(
        <EmptyToDoList 
          title="Custom title" 
          subtitle="Custom subtitle" 
        />
      );

      expect(screen.getByLabelText('Empty to-do list')).toBeInTheDocument();
    });
  });

  describe('When rendering with partial custom props', () => {
    it('should use custom title and default subtitle', () => {
      render(<EmptyToDoList title="Custom title only" />);

      expect(screen.getByText('Custom title only')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first task')).toBeInTheDocument();
    });

    it('should use default title and custom subtitle', () => {
      render(<EmptyToDoList subtitle="Custom subtitle only" />);

      expect(screen.getByText('No pending to-do items found')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle only')).toBeInTheDocument();
    });
  });
});
