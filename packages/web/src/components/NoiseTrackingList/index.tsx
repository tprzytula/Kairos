import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { Container } from './index.styled';

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
      {noiseTrackingItems.map(({ timestamp }) => (
        <div key={timestamp}>{new Date(timestamp).toLocaleDateString('en-GB', { 
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      ))}
    </Container>
  );
};

export default NoiseTrackingList;
