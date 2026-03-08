import EmptyState from '../../EmptyState';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { IEmptyToDoListProps } from './types';

const EmptyPlanner = ({
  title = "No pending tasks found",
  subtitle = "Tap the + button to add your first task"
}: IEmptyToDoListProps) => {
  return (
    <EmptyState
      icon={<ChecklistOutlinedIcon aria-label="Empty planner" />}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default EmptyPlanner;
