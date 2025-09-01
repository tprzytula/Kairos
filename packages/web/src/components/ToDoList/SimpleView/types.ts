import { ITodoItem } from '../../../api/toDoList/retrieve/types';

export interface ISimpleViewProps {
  visibleToDoItems: ITodoItem[];
  allExpanded?: boolean;
  expandKey?: string | number;
  onSwipeAction: (id: string) => void;
  onEditAction: (id: string) => void;
};
