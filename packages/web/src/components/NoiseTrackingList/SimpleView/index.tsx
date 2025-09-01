import NoiseTrackingItem from '../../NoiseTrackingItem';
import SwipeableList from '../../SwipeableList';
import { Container } from './index.styled';
import { ISimpleViewProps } from './types';

const transformNoiseItems = (items: { timestamp: number }[]) => {
  return items.map(item => ({
    ...item,
    id: item.timestamp.toString()
  }));
};

const SimpleView = ({ 
  noiseTrackingItems
}: ISimpleViewProps) => {
  const filteredSortedItems = noiseTrackingItems
    .filter(item => {
      const hour = new Date(item.timestamp).getHours();
      return hour >= 7 && hour <= 23;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Container>
      <SwipeableList
        component={NoiseTrackingItem}
        list={transformNoiseItems(filteredSortedItems)}
        threshold={0.3}
      />
    </Container>
  );
};

export default SimpleView;
