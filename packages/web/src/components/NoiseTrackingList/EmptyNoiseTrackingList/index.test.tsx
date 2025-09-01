import { render, screen } from '@testing-library/react';
import EmptyNoiseTrackingList from '.';

describe('Given the EmptyNoiseTrackingList component', () => {
  describe('When rendering with default props', () => {
    it('should display the empty noise tracking list icon', () => {
      render(<EmptyNoiseTrackingList />);

      expect(screen.getByLabelText('No noise events')).toBeInTheDocument();
    });

    it('should display the default title and subtitle', () => {
      render(<EmptyNoiseTrackingList />);

      expect(screen.getByText('No noise events recorded yet')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first entry')).toBeInTheDocument();
    });

    it('should render the empty state component', () => {
      const { container } = render(<EmptyNoiseTrackingList />);

      const emptyStateElement = container.firstChild;
      expect(emptyStateElement).toBeInTheDocument();
    });
  });

  describe('When rendering with custom props', () => {
    it('should display custom title and subtitle', () => {
      const customTitle = 'Custom empty title';
      const customSubtitle = 'Custom empty subtitle';

      render(
        <EmptyNoiseTrackingList 
          title={customTitle} 
          subtitle={customSubtitle} 
        />
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customSubtitle)).toBeInTheDocument();
    });

    it('should still display the volume icon', () => {
      render(
        <EmptyNoiseTrackingList 
          title="Custom title" 
          subtitle="Custom subtitle" 
        />
      );

      expect(screen.getByLabelText('No noise events')).toBeInTheDocument();
    });
  });

  describe('When rendering with partial custom props', () => {
    it('should use custom title and default subtitle', () => {
      render(<EmptyNoiseTrackingList title="Custom title only" />);

      expect(screen.getByText('Custom title only')).toBeInTheDocument();
      expect(screen.getByText('Tap the + button to add your first entry')).toBeInTheDocument();
    });

    it('should use default title and custom subtitle', () => {
      render(<EmptyNoiseTrackingList subtitle="Custom subtitle only" />);

      expect(screen.getByText('No noise events recorded yet')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle only')).toBeInTheDocument();
    });
  });
});
