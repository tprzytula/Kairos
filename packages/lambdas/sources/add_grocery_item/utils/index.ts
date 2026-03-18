import { DynamoDBTable, scan } from "@kairos-lambdas-libs/dynamodb";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";
import { getCategory } from "../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings";

export interface GroceryItemDefault {
  name: string;
  icon: string;
  unit: string;
}

export const fetchDefaults = async (): Promise<GroceryItemDefault[]> => {
  try {
    return await scan({
      tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
    });
  } catch (error) {
    console.error('Failed to fetch grocery defaults:', error);
    return [];
  }
};

export const getCategoryForItem = (itemName: string, defaults: GroceryItemDefault[]): GroceryItemCategory => {
  const matchingDefault = defaults.find(
    defaultItem => defaultItem.name.toLowerCase() === itemName.toLowerCase()
  );

  if (matchingDefault) {
    return getCategory(matchingDefault.name);
  }

  return getCategory(itemName);
};
