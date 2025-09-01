import { ICategorizedGroceryGroup } from '../../../hooks/useGroceryCategories/types';

export interface ICategorizedViewProps {
  categorizedGroups: ICategorizedGroceryGroup[];
  allExpanded: boolean;
  expandKey: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};
