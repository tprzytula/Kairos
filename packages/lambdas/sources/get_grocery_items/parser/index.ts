import { AttributeValue } from "@kairos-lambdas-libs/dynamodb";
import { IDynamoDBGroceryItem, GroceryItem } from "./types";

const isValidDynamoItem = (
  item: Record<string, AttributeValue>,
): item is IDynamoDBGroceryItem =>
  typeof item.quantity?.N === "string" &&
  typeof item.id?.S === "string" &&
  typeof item.name?.S === "string";

export const parseItems = (
  items: Record<string, AttributeValue>[],
): Array<GroceryItem> => {
  return items.filter(isValidDynamoItem).map(({ quantity, id, name }) => ({
    quantity: parseInt(quantity.N, 10),
    id: id.S,
    name: name.S,
  }));
};
