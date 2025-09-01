import NoiseTrackingItem from '../../NoiseTrackingItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { Container } from './index.styled';
import { ISimpleViewProps, INoiseTrackingItem } from './types';

const ALL_RECORDINGS_ICON = {
  emoji: '🔊',
  backgroundColor: '#f0f9ff',
  foregroundColor: '#0284c7'
};

const transformNoiseItems = (items: { timestamp: number }[]) => {
  return items.map(item => ({
    ...item,
    id: item.timestamp.toString()
  }));
};

const SimpleView = ({ 
  noiseTrackingItems,
  allExpanded,
  expandKey
}: ISimpleViewProps) => {
  const filteredSortedItems = noiseTrackingItems
    .filter(({ timestamp }: INoiseTrackingItem) => {
      const hour = new Date(timestamp).getHours();
      return hour >= 7 && hour <= 23;
    })
    .sort((a: INoiseTrackingItem, b: INoiseTrackingItem) => b.timestamp - a.timestamp);

  return (
    <Container>
      <CollapsibleSection
        title="All Recordings"
        icon={ALL_RECORDINGS_ICON}
        items={filteredSortedItems}
        expandTo={allExpanded}
        expandKey={expandKey}
      >
        <SwipeableList
          component={NoiseTrackingItem}
          list={transformNoiseItems(filteredSortedItems)}
          threshold={0.3}
        />
      </CollapsibleSection>
    </Container>
  );
};

export default SimpleView;
