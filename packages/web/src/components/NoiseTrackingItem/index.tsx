import { Container, Content, TimeContainer, TimeIcon, AbsoluteTime, RelativeTime, DeleteButton } from './index.styled';
import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { removeNoiseTrackingItem } from '../../api/noiseTracking';
import DeleteIcon from '@mui/icons-material/Delete';

const getFormattedTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return getFormattedTime(timestamp);
}

const getTimeOfDayIcon = (timestamp: number) => {
  const hour = new Date(timestamp).getHours();
  
  if (hour >= 6 && hour < 12) return '🌅'; // Morning
  if (hour >= 12 && hour < 18) return '☀️'; // Afternoon
  if (hour >= 18 && hour < 21) return '🌆'; // Evening
  return '🌙'; // Night
}

const isFromToday = (timestamp: number) => {
  const today = new Date();
  const itemDate = new Date(timestamp);
  return today.getDate() === itemDate.getDate() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getFullYear() === itemDate.getFullYear();
}

const NoiseTrackingItem = ({ timestamp, id }: { timestamp: number; id?: string }) => {
  const { refetchNoiseTrackingItems } = useNoiseTrackingContext();

  const handleDeleteNoiseTrackingItem = () => {
    removeNoiseTrackingItem(timestamp).then(() => {
      refetchNoiseTrackingItems()
    })
  }

  return (
    <Container>
      <Content>
        <TimeContainer>
          <TimeIcon>{getTimeOfDayIcon(timestamp)}</TimeIcon>
          <AbsoluteTime>{getFormattedTime(timestamp)}</AbsoluteTime>
        </TimeContainer>
        <RelativeTime>{getRelativeTime(timestamp)}</RelativeTime>
      </Content>
      {isFromToday(timestamp) && (
        <DeleteButton onClick={handleDeleteNoiseTrackingItem}>
          <DeleteIcon fontSize="small" />
        </DeleteButton>
      )}
    </Container>
  );
};

export default NoiseTrackingItem;
