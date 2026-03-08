import { IGroupedTodoItem } from '../utils/timeGrouping';

export interface IGroupedViewProps {
  groupedToDoItems: IGroupedTodoItem[];
  allExpanded?: boolean;
  expandKey?: string | number;
  onSwipeAction: (id: string) => void;
  onEditAction: (id: string) => void;
};
