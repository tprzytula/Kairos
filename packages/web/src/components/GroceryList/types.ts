import { IGroceryItem } from "../../providers/AppStateProvider/types";

export interface IGroceryListComponentProps {
    groceryList: Array<IGroceryItem>
}

export interface IGroceryListProps {
  allExpanded?: boolean
  expandKey?: number
  shopId?: string
}
