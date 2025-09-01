import { render, screen } from '@testing-library/react';
import CollapsibleSectionPlaceholder from './index';
import { MiniTimelinePlaceholder, TimelineBarPlaceholder } from './index.styled';

const MiniTimelineComponent = () => (
  <MiniTimelinePlaceholder>
    {Array.from({ length: 9 }).map((_, index) => (
      <TimelineBarPlaceholder key={index} />
    ))}
  </MiniTimelinePlaceholder>
);

describe('Given the CollapsibleSectionPlaceholder component', () => {
  it('should render default placeholder', () => {
    const { container } = render(<CollapsibleSectionPlaceholder />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with header right content when provided', () => {
    const { container } = render(
      <CollapsibleSectionPlaceholder 
        headerRightContent={<MiniTimelineComponent />}
      />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <CollapsibleSectionPlaceholder>
        <div data-testid="child-content">Child content</div>
      </CollapsibleSectionPlaceholder>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
