import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<IGroceryItem>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};
