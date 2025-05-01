import { DynamoDBGroceryItem } from "../database/types";
import { GroceryItem } from "./types";

export const parseItems = (items: Array<DynamoDBGroceryItem>): Array<GroceryItem> => {
  return items.map(({ quantity, id, name }) => ({
    quantity: parseInt(quantity.N, 10),
    id: id.S,
    name: name.S,
  }));
};
