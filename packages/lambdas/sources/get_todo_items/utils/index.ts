import { ITodoItem } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<ITodoItem>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};

export const sortItems = (items: Array<ITodoItem>): Array<ITodoItem> => {
  return items.sort((a, b) => {
    if (a?.dueDate && b?.dueDate && a.dueDate > b.dueDate) {
      return 1;
    }

    if (a?.dueDate && b?.dueDate && a.dueDate < b.dueDate) {
      return -1;
    }

    return 0;
  });
};
