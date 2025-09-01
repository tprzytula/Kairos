import EmptyState from '../../EmptyState';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { IEmptyToDoListProps } from './types';

const EmptyToDoList = ({ 
  title = "No pending to-do items found", 
  subtitle = "Tap the + button to add your first task" 
}: IEmptyToDoListProps) => {
  return (
    <EmptyState 
      icon={<ChecklistOutlinedIcon aria-label="Empty to-do list" />}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default EmptyToDoList;
