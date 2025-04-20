import { GroceryItemUnit } from "../../enums/groceryItem";

export interface IGroceryItemProps {
    name: string;
    quantity: number;
    imagePath: string;
    unit: GroceryItemUnit;
}
  