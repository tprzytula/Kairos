import { GroceryItem } from "../../providers/AppStateProvider/types";

export interface IGroceryListComponentProps {
    groceryList: Array<GroceryItem>
}

export interface IGroceryListProps {
    allExpanded?: boolean
    expandKey?: number
}
