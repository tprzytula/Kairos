import { render, screen } from '@testing-library/react';
import GroupedView from '.';

const mockNoiseTrackingItems = [
  {
    timestamp: new Date().setHours(14, 58, 0, 0) // Today at 14:58
  },
  {
    timestamp: new Date('2027-04-25T10:46:00').getTime() // Future date at 10:46
  },
  {
    timestamp: new Date().setHours(16, 30, 0, 0) // Today at 16:30
  },
  {
    timestamp: new Date().setHours(2, 30, 0, 0) // Today at 2:30 AM (should be filtered out)
  }
];

describe('Given the GroupedView component', () => {
  describe('When rendering with noise tracking items', () => {
    it('should display the date group sections with items', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('25 April 2027 • Sunday')).toBeInTheDocument();
      expect(screen.getByText('25 Apr 2027, 10:46')).toBeInTheDocument();
      expect(screen.getByText('14:58', { exact: false })).toBeInTheDocument();
    });

    it('should display the appropriate date group icons', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.getByText('📅')).toBeInTheDocument(); // Today emoji
      expect(screen.getByText('🗓️')).toBeInTheDocument(); // Default emoji for future date
    });

    it('should render collapsible sections for each date group', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.getAllByLabelText('Collapse')).toHaveLength(2);
    });

    it('should display mini timeline components for each group', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.getAllByLabelText('Timeline bar')).toHaveLength(18); // 9 bars per group * 2 groups
    });

    it('should filter out items outside 7am-11pm range', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      // Should not show the 2:30 AM item
      expect(screen.queryByText('02:30', { exact: false })).not.toBeInTheDocument();
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with expand/collapse props', () => {
    it('should pass expand props to CollapsibleSections', () => {
      render(
        <GroupedView
          noiseTrackingItems={mockNoiseTrackingItems}
          allExpanded={false}
          expandKey="test-key"
        />
      );

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('25 April 2027 • Sunday')).toBeInTheDocument();
    });
  });

  describe('When rendering with empty noise tracking items', () => {
    it('should render without errors', () => {
      const { container } = render(
        <GroupedView
          noiseTrackingItems={[]}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should not display any date groups', () => {
      render(
        <GroupedView
          noiseTrackingItems={[]}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.queryByText('Today')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Timeline bar')).not.toBeInTheDocument();
    });
  });

  describe('When rendering with items only outside 7am-11pm range', () => {
    it('should not display any groups', () => {
      const nightItems = [
        { timestamp: new Date().setHours(2, 30, 0, 0) },
        { timestamp: new Date().setHours(5, 15, 0, 0) },
      ];

      render(
        <GroupedView
          noiseTrackingItems={nightItems}
          allExpanded={true}
          expandKey={0}
        />
      );

      expect(screen.queryByText('Today')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Timeline bar')).not.toBeInTheDocument();
    });
  });
});
