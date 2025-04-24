import { Container, DeleteButton } from './index.styled';
import { Typography } from '@mui/material';
import { removeNoiseTrackingItem } from '../../api/noiseTracking';

const getDateString = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-GB', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const NoiseTrackingItem = ({ timestamp }: { timestamp: number }) => {
  const handleDeleteNoiseTrackingItem = () => {
    removeNoiseTrackingItem(timestamp)
  }

  return (
    <Container>
      <Typography variant="body1">{getDateString(timestamp)}</Typography>
      <DeleteButton color="error" onClick={handleDeleteNoiseTrackingItem}>X</DeleteButton>
    </Container>
  );
};

export default NoiseTrackingItem;
