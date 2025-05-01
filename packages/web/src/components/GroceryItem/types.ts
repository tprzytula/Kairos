import { GroceryItemUnit } from "../../enums/groceryItem";

export interface IGroceryItemProps {
    id: string;
    name: string;
    quantity: number;
    imagePath: string;
    unit: GroceryItemUnit;
}
  