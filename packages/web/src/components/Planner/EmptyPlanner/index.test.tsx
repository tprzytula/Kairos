import { render, screen } from '@testing-library/react';
import EmptyPlanner from '.';

describe('Given the EmptyPlanner component', () => {
  describe('When rendering with default props', () => {
    it('should display the empty to-do list icon', () => {
      render(<EmptyPlanner />);

      expect(screen.getByLabelText('Empty planner')).toBeInTheDocument();
    });

    it('should display the default title and subtitle', () => {
      render(<EmptyPlanner />);

      expect(screen.getByText('No pending tasks found')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first task')).toBeInTheDocument();
    });

    it('should render the empty state component', () => {
      const { container } = render(<EmptyPlanner />);

      const emptyStateElement = container.firstChild;
      expect(emptyStateElement).toBeInTheDocument();
    });
  });

  describe('When rendering with custom props', () => {
    it('should display custom title and subtitle', () => {
      const customTitle = 'Custom empty title';
      const customSubtitle = 'Custom empty subtitle';

      render(
        <EmptyPlanner 
          title={customTitle} 
          subtitle={customSubtitle} 
        />
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customSubtitle)).toBeInTheDocument();
    });

    it('should still display the checklist icon', () => {
      render(
        <EmptyPlanner 
          title="Custom title" 
          subtitle="Custom subtitle" 
        />
      );

      expect(screen.getByLabelText('Empty planner')).toBeInTheDocument();
    });
  });

  describe('When rendering with partial custom props', () => {
    it('should use custom title and default subtitle', () => {
      render(<EmptyPlanner title="Custom title only" />);

      expect(screen.getByText('Custom title only')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first task')).toBeInTheDocument();
    });

    it('should use default title and custom subtitle', () => {
      render(<EmptyPlanner subtitle="Custom subtitle only" />);

      expect(screen.getByText('No pending tasks found')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle only')).toBeInTheDocument();
    });
  });
});
