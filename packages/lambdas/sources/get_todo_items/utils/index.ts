import { ITodoItem } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<ITodoItem>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};
