import { Container, DeleteButton } from './index.styled';
import { Typography } from '@mui/material';
import { removeNoiseTrackingItem } from '../../api/noiseTracking';
import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';

const getDateString = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-GB', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const isFromToday = (timestamp: number) => {
  const today = new Date();
  const itemDate = new Date(timestamp);
  return today.getDate() === itemDate.getDate() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getFullYear() === itemDate.getFullYear();
}

const NoiseTrackingItem = ({ timestamp }: { timestamp: number }) => {
  const { refetchNoiseTrackingItems } = useNoiseTrackingContext();

  const handleDeleteNoiseTrackingItem = () => {
    removeNoiseTrackingItem(timestamp).then(() => {
      refetchNoiseTrackingItems()
    })
  }

  return (
    <Container>
      <Typography variant="body1">{getDateString(timestamp)}</Typography>
      {isFromToday(timestamp) && (
        <DeleteButton color="error" onClick={handleDeleteNoiseTrackingItem}>X</DeleteButton>
      )}
    </Container>
  );
};

export default NoiseTrackingItem;
