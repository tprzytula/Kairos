import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { AddNoiseTrackingItemButton, Container } from './index.styled';
import { addNoiseTrackingItem } from '../../api/noiseTracking';
import NoiseTrackingItem from '../NoiseTrackingItem';
import { Typography } from '@mui/material';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <div key={index} />
    ))}
  </Container>
)

const NoiseTrackingList = () => {
  const { noiseTrackingItems, isLoading } = useNoiseTrackingContext();

  const handleAddNoiseTrackingItem = () => {
    addNoiseTrackingItem()
  }

  if (isLoading) {
    return <PlaceholderComponent />
  }

  return (
    <Container>
      <AddNoiseTrackingItemButton variant="contained" onClick={handleAddNoiseTrackingItem}>
        Add Noise Tracking Item
      </AddNoiseTrackingItemButton>
      <Typography variant="h6">Noise Tracking Items</Typography>
      {noiseTrackingItems.map(({ timestamp }) => (
        <NoiseTrackingItem key={timestamp} timestamp={timestamp} />
      ))}
    </Container>
  );
};

export default NoiseTrackingList;
