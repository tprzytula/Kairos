import NoiseTrackingItemPlaceholder from '../../NoiseTrackingItem/Placeholder';
import CollapsibleSectionPlaceholder from '../../CollapsibleSectionPlaceholder';
import { MiniTimelinePlaceholder, TimelineBarPlaceholder } from '../../CollapsibleSectionPlaceholder/index.styled';
import { Container, PlaceholdersWrapper } from './index.styled';
import { IPlaceholderProps } from './types';

const MiniTimelinePlaceholderComponent = () => (
  <MiniTimelinePlaceholder>
    {Array.from({ length: 9 }).map((_, index) => (
      <TimelineBarPlaceholder key={index} />
    ))}
  </MiniTimelinePlaceholder>
);

const Placeholder = ({ numberOfGroups = 3 }: IPlaceholderProps) => {
  return (
    <Container>
      <PlaceholdersWrapper aria-label="Loading noise tracking items">
        {Array.from({ length: numberOfGroups }).map((_, groupIndex) => (
          <CollapsibleSectionPlaceholder 
            key={groupIndex}
            headerRightContent={<MiniTimelinePlaceholderComponent />}
          >
            {Array.from({ length: 2 + groupIndex }).map((_, itemIndex) => (
              <NoiseTrackingItemPlaceholder key={itemIndex} />
            ))}
          </CollapsibleSectionPlaceholder>
        ))}
      </PlaceholdersWrapper>
    </Container>
  );
};

export default Placeholder;
