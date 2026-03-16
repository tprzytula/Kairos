import NoiseTrackingItemPlaceholder from '../../NoiseTrackingItem/Placeholder';
import GroupedListPlaceholder from '../../GroupedListPlaceholder';
import { MiniTimelinePlaceholder, TimelineBarPlaceholder } from '../../CollapsibleSectionPlaceholder/index.styled';
import { Container } from './index.styled';
import { IPlaceholderProps } from './types';

const MiniTimelinePlaceholderComponent = () => (
  <MiniTimelinePlaceholder>
    {Array.from({ length: 9 }).map((_, index) => (
      <TimelineBarPlaceholder key={index} />
    ))}
  </MiniTimelinePlaceholder>
);

const Placeholder = ({ numberOfGroups = 3 }: IPlaceholderProps) => (
  <Container>
    <GroupedListPlaceholder
      ItemPlaceholder={NoiseTrackingItemPlaceholder}
      ariaLabel="Loading noise tracking items"
      numberOfGroups={numberOfGroups}
      groupHeaderRightContent={<MiniTimelinePlaceholderComponent />}
    />
  </Container>
);

export default Placeholder;
