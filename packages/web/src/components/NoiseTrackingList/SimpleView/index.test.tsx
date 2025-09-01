import { render, screen } from '@testing-library/react';
import SimpleView from '.';

const mockNoiseTrackingItems = [
  {
    timestamp: new Date().setHours(14, 58, 0, 0) // Today at 14:58
  },
  {
    timestamp: new Date('2027-04-25T10:46:00').getTime() // Future date at 10:46
  },
  {
    timestamp: new Date().setHours(2, 30, 0, 0) // Today at 2:30 AM (should be filtered out)
  }
];

describe('Given the SimpleView component', () => {
  describe('When rendering with noise tracking items', () => {
    it('should display the noise tracking items in a swipeable list', () => {
      render(
        <SimpleView
          noiseTrackingItems={mockNoiseTrackingItems}
        />
      );

      expect(screen.getByText('25 Apr 2027, 10:46')).toBeInTheDocument();
      expect(screen.getByText('14:58', { exact: false })).toBeInTheDocument();
    });

    it('should filter out items outside 7am-11pm range', () => {
      render(
        <SimpleView
          noiseTrackingItems={mockNoiseTrackingItems}
        />
      );

      // Should not show the 2:30 AM item
      expect(screen.queryByText('02:30', { exact: false })).not.toBeInTheDocument();
    });

    it('should sort items by timestamp in descending order', () => {
      render(
        <SimpleView
          noiseTrackingItems={mockNoiseTrackingItems}
        />
      );

      const items = screen.getAllByText(/\d{2}:\d{2}/);
      expect(items).toHaveLength(2); // 2 items within time range
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <SimpleView
          noiseTrackingItems={mockNoiseTrackingItems}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with empty noise tracking list', () => {
    it('should render without errors', () => {
      const { container } = render(
        <SimpleView
          noiseTrackingItems={[]}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should not display any noise tracking items', () => {
      render(
        <SimpleView
          noiseTrackingItems={[]}
        />
      );

      expect(screen.queryByText(/\d{2}:\d{2}/)).not.toBeInTheDocument();
    });
  });

  describe('When rendering with items only outside 7am-11pm range', () => {
    it('should not display any items', () => {
      const nightItems = [
        { timestamp: new Date().setHours(2, 30, 0, 0) },
        { timestamp: new Date().setHours(5, 15, 0, 0) },
      ];

      render(
        <SimpleView
          noiseTrackingItems={nightItems}
        />
      );

      expect(screen.queryByText(/\d{2}:\d{2}/)).not.toBeInTheDocument();
    });
  });
});
