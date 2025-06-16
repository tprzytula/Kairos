import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<IGroceryItem>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};

export const sortItems = (items: Array<IGroceryItem>): Array<IGroceryItem> => {
  return items.sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }

    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }

    return 0;
  });
};
