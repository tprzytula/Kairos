import { ToDoViewMode } from '../../enums/todoViewMode';

export interface IToDoListProps {
  allExpanded?: boolean;
  expandKey?: string | number;
  viewMode?: ToDoViewMode;
};
