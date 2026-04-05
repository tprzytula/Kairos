import { IGroupedTodoItem, IGroupedAdventureItem } from '../utils/timeGrouping';

export interface IGroupedViewProps {
  groupedToDoItems: IGroupedTodoItem[];
  groupedAdventures: IGroupedAdventureItem[];
  onSwipeAction: (id: string) => void;
  onEditAction: (id: string) => void;
  onAdventureClick: (id: string) => void;
};
