import EmptyState from '../../EmptyState';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IEmptyNoiseTrackingListProps } from './types';

const EmptyNoiseTrackingList = ({ 
  title = "No noise events recorded yet", 
  subtitle = "Tap the + button to add your first entry" 
}: IEmptyNoiseTrackingListProps) => {
  return (
    <EmptyState 
      icon={<VolumeUpIcon aria-label="No noise events" />}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default EmptyNoiseTrackingList;
