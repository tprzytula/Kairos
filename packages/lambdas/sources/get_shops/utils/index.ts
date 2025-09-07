import { IShop } from "@kairos-lambdas-libs/dynamodb/types/shops";

export const sortItems = (items: IShop[]): IShop[] => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
};

export const logResponse = (items: IShop[]): void => {
  console.log(`Retrieved ${items.length} shops`);
};
