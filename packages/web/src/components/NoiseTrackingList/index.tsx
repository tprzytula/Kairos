import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { Container } from './index.styled';
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

  if (isLoading) {
    return <PlaceholderComponent />
  }

  return (
    <Container>
      <Typography variant="h6">Noise Tracking Log</Typography>
      {noiseTrackingItems.map(({ timestamp }) => (
        <NoiseTrackingItem key={timestamp} timestamp={timestamp} />
      ))}
    </Container>
  );
};

export default NoiseTrackingList;
