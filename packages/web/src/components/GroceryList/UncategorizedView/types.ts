import { IGroceryItem } from '../../../providers/AppStateProvider/types';

export interface IUncategorizedViewProps {
  groceryList: IGroceryItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};
