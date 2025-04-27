import { IGroceryItemDefault } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<IGroceryItemDefault>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};
