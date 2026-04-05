import { IGroupedTodoItem } from '../utils/timeGrouping';

export interface IGroupedViewProps {
  groupedToDoItems: IGroupedTodoItem[];
  onSwipeAction: (id: string) => void;
  onEditAction: (id: string) => void;
};
